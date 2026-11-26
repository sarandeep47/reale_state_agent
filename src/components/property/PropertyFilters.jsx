import { PROPERTY_TYPES } from '../../services/propertyService';
import { Button } from '../ui/Button';

export function PropertyFilters({ value, onChange, onReset }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  const budgetInvalid =
    value.budgetMin !== '' && value.budgetMax !== '' && Number(value.budgetMin) > Number(value.budgetMax);

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Property filters">
      <label className="field">
        <span className="field__label">Location</span>
        <input
          className="field__input"
          type="text"
          placeholder="e.g. Anna Nagar"
          value={value.location}
          onChange={set('location')}
          maxLength={80}
        />
      </label>

      <label className="field">
        <span className="field__label">Property type</span>
        <select className="field__input" value={value.propertyType} onChange={set('propertyType')}>
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Min budget (₹)</span>
        <input
          className="field__input"
          type="number"
          inputMode="numeric"
          min="0"
          step="100000"
          placeholder="No minimum"
          value={value.budgetMin}
          onChange={set('budgetMin')}
        />
      </label>

      <label className="field">
        <span className="field__label">Max budget (₹)</span>
        <input
          className="field__input"
          type="number"
          inputMode="numeric"
          min="0"
          step="100000"
          placeholder="No maximum"
          value={value.budgetMax}
          onChange={set('budgetMax')}
          aria-invalid={budgetInvalid}
        />
      </label>

      <div className="filters__actions">
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>

      {budgetInvalid && <p className="field__error">Minimum budget is higher than the maximum.</p>}
    </form>
  );
}
