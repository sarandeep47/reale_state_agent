import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';

// Labels only. Values stay "Not connected" until real data sources exist; nothing is estimated.
const STATS = ['Active listings', 'New leads', 'Site visits', 'Deals closed'];

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-IN', { dateStyle: 'medium' });
}

export function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Owner dashboard</h1>
        <p className="page__subtitle">An overview of your business. Data sources aren't connected yet.</p>
      </div>

      <div className="stat-grid">
        {STATS.map((label) => (
          <div key={label} className="stat">
            <div className="stat__label">{label}</div>
            <div className="stat__value">-</div>
            <div className="stat__hint">Not connected</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Property inventory">
          <EmptyState title="Inventory not connected">
            Properties will be listed here once the inventory is connected.
          </EmptyState>
        </Card>

        <Card title="Recent leads">
          <EmptyState icon="📋" title="No leads to show">
            Leads will appear here once the lead source is connected.
          </EmptyState>
        </Card>

        <Card title="Your account">
          <dl className="details">
            <dt>Name</dt>
            <dd>{profile?.full_name || '-'}</dd>
            <dt>Email</dt>
            <dd>{profile?.email || '-'}</dd>
            <dt>Role</dt>
            <dd className="details__role">{profile?.role}</dd>
            <dt>Member since</dt>
            <dd>{formatDate(profile?.created_at)}</dd>
          </dl>
        </Card>
      </div>
    </div>
  );
}
