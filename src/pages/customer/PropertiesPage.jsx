import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listProperties } from '../../services/propertyService';
import { EMPTY_FILTERS, filterProperties } from '../../utils/filterProperties';
import { PropertyFilters } from '../../components/property/PropertyFilters';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { EmptyState } from '../../components/ui/EmptyState';
import { Notice } from '../../components/ui/Notice';
import { Spinner } from '../../components/ui/Spinner';

export function PropertiesPage() {
  const { profile } = useAuth();
  const [result, setResult] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    let active = true;
    listProperties()
      .then((r) => active && setResult(r))
      .catch((error) => active && setResult({ status: 'error', properties: [], error }));
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => filterProperties(result?.properties ?? [], filters), [result, filters]);
  const firstName = profile?.full_name?.split(' ')[0];

  let content;
  if (!result) {
    content = <Spinner label="Loading properties..." />;
  } else if (result.status === 'error') {
    content = (
      <Notice tone="error" title="Couldn't load properties">
        Please try again later.
      </Notice>
    );
  } else if (result.status === 'not_connected') {
    content = (
      <EmptyState title="No listings yet">
        Our property inventory isn't connected yet. Listings will appear here as soon as they're available.
      </EmptyState>
    );
  } else if (visible.length === 0) {
    content = (
      <EmptyState icon="🔍" title="No properties match your filters">
        Try a different location, type or budget.
      </EmptyState>
    );
  } else {
    content = <PropertyGrid properties={visible} />;
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{firstName ? `Hi ${firstName}, find your next home` : 'Find your next home'}</h1>
        <p className="page__subtitle">Filter by location, property type and budget.</p>
      </div>

      <PropertyFilters value={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} />

      <div className="page__section">{content}</div>
    </div>
  );
}
