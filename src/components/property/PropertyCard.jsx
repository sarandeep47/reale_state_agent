import { formatInr } from '../../utils/filterProperties';

/** Displays one real inventory record. Only renders fields that exist. */
export function PropertyCard({ property }) {
  return (
    <article className="property-card">
      <div className="property-card__body">
        <h3 className="property-card__title">{property.title || property.property_type || 'Property'}</h3>
        {property.location && <p className="property-card__location">{property.location}</p>}
        <div className="property-card__meta">
          {property.property_type && <span className="tag">{property.property_type}</span>}
          {property.bedrooms != null && <span className="tag">{property.bedrooms} BHK</span>}
        </div>
      </div>
      <div className="property-card__price">{formatInr(property.price)}</div>
    </article>
  );
}
