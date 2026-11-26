import { PropertyCard } from './PropertyCard';

export function PropertyGrid({ properties }) {
  return (
    <div className="property-grid">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
