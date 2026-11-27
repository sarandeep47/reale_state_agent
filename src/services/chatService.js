import { supabase } from '../lib/supabaseClient';

/**
 * Chat assistant service - talks to the n8n "Real Estate AI - Website Agent" webhook.
 *
 * Contract (taken from the deployed workflow):
 *   POST {VITE_N8N_CHAT_WEBHOOK_URL}
 *   Authorization: Bearer <Supabase access token of the signed-in user>
 *   Body: { "message": string (1-1000 chars), "conversation_id"?: uuid }
 *   200     -> { ok: true, conversation_id, reply, fallback }
 *   4xx/5xx -> { ok: false, error: { code, message } }
 *
 * Security: n8n derives the user and role from the verified access token and the profiles
 * table, so this service never sends user_id, role or email. The webhook URL is public;
 * no n8n credential or Supabase secret key is used in the browser. Tokens are never logged.
 */
const WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL?.trim() || '';
const TIMEOUT_MS = 90_000;
export const MAX_MESSAGE_LENGTH = 1000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isChatConfigured = Boolean(WEBHOOK_URL && supabase);

const TEXT = Object.freeze({
  notConfigured: "The assistant isn't connected yet. Your message was not sent anywhere.",
  sessionExpired: 'Your session has expired. Please sign in again to continue chatting.',
  forbidden: "Your account isn't set up for the assistant yet.",
  invalid: 'Please send a message between 1 and 1000 characters.',
  timeout: 'The assistant is taking too long to respond. Please try again.',
  unavailable: 'The assistant is unavailable right now. Please try again in a few minutes.',
});

async function getAccessToken({ refresh = false } = {}) {
  const { data, error } = refresh ? await supabase.auth.refreshSession() : await supabase.auth.getSession();
  if (error) return null;
  return data?.session?.access_token ?? null;
}

async function postMessage(token, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { httpStatus: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

const failure = (status, reply, errorCode = null) => ({ status, reply, errorCode, conversationId: null });

function mapErrorResponse(httpStatus, data) {
  const code = typeof data?.error?.code === 'string' ? data.error.code : null;
  if (httpStatus === 401) return failure('session_expired', TEXT.sessionExpired, code);
  if (httpStatus === 403) return failure('error', TEXT.forbidden, code);
  if (httpStatus === 400) return failure('error', TEXT.invalid, code);
  return failure('error', TEXT.unavailable, code);
}

/**
 * Sends one chat message for the signed-in user.
 *
 * @param {string} message
 * @param {string|null} conversationId - id returned by an earlier reply in this chat session, or null
 * @returns {Promise<{ status: 'ok'|'error'|'session_expired'|'not_configured', reply: string,
 *   conversationId: string|null, fallback?: boolean, errorCode?: string|null, conversationReset?: boolean }>}
 */
export async function sendChatMessage(message, conversationId = null) {
  if (!isChatConfigured) return failure('not_configured', TEXT.notConfigured);

  const text = typeof message === 'string' ? message.trim() : '';
  if (!text || text.length > MAX_MESSAGE_LENGTH) return failure('error', TEXT.invalid, 'invalid_request');

  let token = await getAccessToken();
  if (!token) return failure('session_expired', TEXT.sessionExpired, 'unauthorized');

  const body = { message: text };
  if (typeof conversationId === 'string' && UUID.test(conversationId)) body.conversation_id = conversationId;

  let result;
  let conversationReset = false;
  try {
    result = await postMessage(token, body);

    // Token rejected (e.g. expired): refresh the Supabase session once and retry.
    if (result.httpStatus === 401) {
      token = await getAccessToken({ refresh: true });
      if (!token) return failure('session_expired', TEXT.sessionExpired, 'unauthorized');
      result = await postMessage(token, body);
    }

    // The stored conversation no longer exists for this user: start a new one.
    if (result.httpStatus === 404 && result.data?.error?.code === 'conversation_not_found' && body.conversation_id) {
      conversationReset = true;
      const { conversation_id: _dropped, ...fresh } = body;
      result = await postMessage(token, fresh);
    }
  } catch (err) {
    return err?.name === 'AbortError'
      ? failure('error', TEXT.timeout, 'timeout')
      : failure('error', TEXT.unavailable, 'network_error');
  }

  const data = result.data;
  if (result.httpStatus === 200 && data?.ok === true && typeof data.reply === 'string' && data.reply.trim()) {
    return {
      status: 'ok',
      reply: data.reply.trim(),
      conversationId: typeof data.conversation_id === 'string' && UUID.test(data.conversation_id) ? data.conversation_id : null,
      fallback: data.fallback === true,
      conversationReset,
    };
  }
  return { ...mapErrorResponse(result.httpStatus, data), conversationReset };
}
