/**
 * Chat assistant service - FRONTEND-ONLY PLACEHOLDER.
 *
 * This makes no network request. It will later call the n8n chat webhook.
 * When it does, it must send the user's Supabase access token so n8n can
 * verify the user and look up the role server-side. The role must never be
 * taken from anything the browser sends.
 *
 * @param {string} _message
 * @returns {Promise<{ status: 'not_connected', reply: string }>}
 */
export async function sendChatMessage(_message) {
  return {
    status: 'not_connected',
    reply: "The assistant isn't connected yet. Your message was not sent anywhere.",
  };
}
