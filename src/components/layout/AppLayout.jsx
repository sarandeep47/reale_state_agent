import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ChatLauncher } from '../chat/ChatLauncher';

/**
 * Layout for authenticated, role-checked pages.
 * Rendered only inside <RequireRole>, so the chatbot appears on every
 * authenticated page and never on public pages.
 */
export function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <ChatLauncher />
    </div>
  );
}
