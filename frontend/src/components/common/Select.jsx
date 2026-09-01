import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Select
 * A themed drop-in replacement for a native <select className="form-input">.
 * Native <select> popups are rendered by the OS/browser chrome, so page CSS
 * (including the site's custom ::-webkit-scrollbar styling) can never reach
 * them — the option list always shows a generic system scrollbar. This
 * renders the option list as a normal in-page element instead, so it picks
 * up the same themed scrollbar, colors, and radius as everything else.
 *
 * @param {Object} props
 * @param {string|number} props.value
 * @param {(value: string|number) => void} props.onChange
 * @param {{ value: string|number, label: string }[]} props.options
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required]
 */
export default function Select({ value, onChange, options, placeholder = 'Select...', required = false }) {
  const selected = options.find(o => String(o.value) === String(value));

  return (
    <Listbox value={value} onChange={onChange}>
      <div style={{ position: 'relative' }}>
        <ListboxButton
          type="button"
          className="form-input"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ color: selected ? 'var(--text-main)' : 'var(--text-subtle)' }}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={16} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
        </ListboxButton>

        {/* Hidden input so native form validation (`required`) still works */}
        {required && (
          <input
            tabIndex={-1}
            value={value || ''}
            required
            onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, height: 0, width: '100%', pointerEvents: 'none' }}
          />
        )}

        <ListboxOptions
          anchor="bottom start"
          transition
          className="hide-scrollbar"
          style={{
            width: 'var(--button-width)',
            marginTop: '0.4rem',
            maxHeight: '14rem',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.35rem',
            zIndex: 10001,
          }}
        >
          {options.map(opt => (
            <ListboxOption
              key={opt.value}
              value={opt.value}
              style={{ listStyle: 'none' }}
              className="select-option"
            >
              {({ selected: isSelected, focus }) => (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.55rem 0.7rem', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontSize: '0.9rem',
                    background: focus ? 'var(--bg-subtle)' : 'transparent',
                    color: isSelected ? 'var(--brand-violet)' : 'var(--text-main)',
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  {opt.label}
                  {isSelected && <Check size={15} color="var(--brand-violet)" />}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
