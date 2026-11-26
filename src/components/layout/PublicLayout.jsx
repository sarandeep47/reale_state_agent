import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/** Layout for public pages (landing, login). No chatbot here. */
export function PublicLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
