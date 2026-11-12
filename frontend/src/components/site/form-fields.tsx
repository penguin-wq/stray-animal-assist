// Reusable form inputs used by every form on the site (labels, hints and error messages built in).

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, ImagePlus, LoaderCircle, LocateFixed, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PHOTO_TYPES, type FieldErrors } from '@/lib/inquiry-schemas';

// Shared look for text inputs, text areas and dropdowns.
export const fieldClass =
  'mt-[7px] w-full rounded-[10px] border border-line-input bg-card/95 px-3.5 py-3 text-[15px] font-normal text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-plum focus:ring-2 focus:ring-accent aria-[invalid=true]:border-destructive';

/** Red error message under a field (renders nothing when there is no error). */
export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role='alert' className='mt-1.5 text-[13px] font-medium text-destructive'>
      {message}
    </p>
  );
}

// Props every field shares: its form name, label, the current errors and an optional hint.
type BaseProps = {
  name: string;
  label: string;
  errors: FieldErrors;
  hint?: string;
  className?: string;
};

/** A labelled single-line input (text, email, phone, date, number...). */
export function TextField({
  name,
  label,
  errors,
  hint,
  className,
  ...input
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('block text-sm font-semibold text-ink-soft', className)}>
      {label}
      {hint && (
        <span className='mt-0.5 block text-xs font-normal text-muted-foreground'>{hint}</span>
      )}
      <input name={name} aria-invalid={!!errors[name]} className={fieldClass} {...input} />
      <FieldError message={errors[name]} />
    </label>
  );
}

/** A labelled multi-line text box. */
export function TextAreaField({
  name,
  label,
  errors,
  hint,
  className,
  ...input
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn('block text-sm font-semibold text-ink-soft', className)}>
      {label}
      {hint && (
        <span className='mt-0.5 block text-xs font-normal text-muted-foreground'>{hint}</span>
      )}
      <textarea
        name={name}
        rows={4}
        aria-invalid={!!errors[name]}
        className={fieldClass}
        {...input}
      />
      <FieldError message={errors[name]} />
    </label>
  );
}

/** A labelled dropdown with a "Choose..." placeholder. */
export function SelectField({
  name,
  label,
  errors,
  options,
  className,
  ...select
}: BaseProps & { options: readonly string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn('block text-sm font-semibold text-ink-soft', className)}>
      {label}
      <select name={name} aria-invalid={!!errors[name]} className={fieldClass} {...select}>
        <option value='' disabled>
          Select an option
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <FieldError message={errors[name]} />
    </label>
  );
}

/** Pill-style radio or checkbox group. */
export function ChoiceGroup({
  name,
  label,
  errors,
  options,
  multiple = false,
  value,
  onChange,
  className,
}: BaseProps & {
  options: readonly string[];
  multiple?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <fieldset className={cn('text-sm font-semibold text-ink-soft', className)}>
      <legend>{label}</legend>
      <div className='mt-2 flex flex-wrap gap-2'>
        {options.map((o) => (
          <label key={o} className='cursor-pointer'>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={o}
              className='peer sr-only'
              {...(value !== undefined
                ? { checked: value === o, onChange: () => onChange?.(o) }
                : {})}
            />
            <span className='inline-flex rounded-full border border-line-input bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-foreground/40'>
              {o}
            </span>
          </label>
        ))}
      </div>
      <FieldError message={errors[name]} />
    </fieldset>
  );
}

/** A required "I agree" checkbox with its text. */
export function ConsentCheckbox({
  name,
  errors,
  children,
}: {
  name: string;
  errors: FieldErrors;
  children: ReactNode;
}) {
  return (
    <div>
      <label className='flex items-start gap-2.5 text-[13px] leading-5 text-muted-foreground'>
        <input
          type='checkbox'
          name={name}
          aria-invalid={!!errors[name]}
          className='mt-[3px] accent-plum'
        />
        <span>{children}</span>
      </label>
      <FieldError message={errors[name]} />
    </div>
  );
}

/** Green thank-you box shown after a form is completed. */
export function SuccessCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className='rounded-[14px] border border-success-border bg-success-bg p-7'>
      <CheckCircle2 className='size-7 text-success-text' />
      <h3 className='mt-4 text-[22px] font-bold text-success-heading'>{title}</h3>
      <div className='mt-2 text-[15px] leading-6 text-success-text'>{children}</div>
    </div>
  );
}

/* ---------------- Photo drop zone ---------------- */

/**
 * Photo upload area: drag and drop photos onto it or click to choose (or take) them.
 * Shows a preview of each photo with a button to remove it. Photos stay in the browser.
 */
export function PhotoDrop({
  name,
  label,
  hint,
  files,
  onChange,
  max,
  errors,
  capture,
}: {
  name: string;
  label: string;
  hint?: string;
  files: File[];
  onChange: (files: File[]) => void;
  max: number;
  errors: FieldErrors;
  capture?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // Temporary preview links for the chosen photos.
  const [previews, setPreviews] = useState<string[]>([]);

  // Make preview links for the photos and free them again when the photos change.
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  // Adds newly picked photos, never going over the maximum allowed.
  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, max);
    onChange(next);
  };

  // When the limit is reached, the drop area stops accepting more.
  const full = files.length >= max;

  return (
    <div className='text-sm font-semibold text-ink-soft'>
      <label htmlFor={inputId}>{label}</label>
      {hint && <p className='mt-0.5 text-xs font-normal text-muted-foreground'>{hint}</p>}

      {!full && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'mt-2 flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-4 py-7 text-center transition-colors',
            dragging
              ? 'border-plum bg-accent'
              : 'border-line-input bg-card/70 hover:border-plum/60',
            errors[name] && 'border-destructive/60',
          )}
        >
          <ImagePlus className='size-7 text-plum' aria-hidden='true' />
          <p className='mt-2 text-[15px] font-semibold text-foreground'>
            Drop photos here or tap to choose
          </p>
          <p className='mt-1 text-xs font-normal text-muted-foreground'>
            JPG, PNG, WEBP or HEIC · up to 8 MB each ·{' '}
            {max === 1 ? '1 photo' : `up to ${max} photos`}
          </p>
          <input
            ref={inputRef}
            id={inputId}
            type='file'
            accept={PHOTO_TYPES.join(',')}
            multiple={max > 1}
            {...(capture ? { capture: 'environment' as const } : {})}
            className='sr-only'
            onChange={(e) => {
              add(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {files.length > 0 && (
        <ul className='mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4'>
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className='relative overflow-hidden rounded-[10px] border border-line-strong bg-surface-soft'
            >
              {previews[i] ? (
                <img
                  src={previews[i]}
                  alt={file.name}
                  className='aspect-square w-full object-cover'
                />
              ) : (
                <div className='aspect-square' />
              )}
              <button
                type='button'
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className='absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-foreground/75 text-primary-foreground hover:bg-foreground'
              >
                <X className='size-4' />
              </button>
            </li>
          ))}
        </ul>
      )}
      <FieldError message={errors[name]} />
    </div>
  );
}

/* ---------------- Location picker ---------------- */

/**
 * "Where is the animal?" field: type an address, or tap "Use my current location" to drop a
 * pin on a map and fill in the address automatically. Hidden inputs carry the coordinates.
 */
export function LocationPicker({ errors }: { errors: FieldErrors }) {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Ask the device for its location, show it on the map, then look up a readable address.
  const locate = () => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setMessage("Your device can't share its location. Please type the address instead.");
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setCoords({ lat, lng });
        setStatus('idle');
        setMessage('');
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18`,
            { headers: { Accept: 'application/json' } },
          );
          const json = (await res.json()) as { display_name?: string };
          if (json.display_name)
            setAddress((current) => current || json.display_name!.slice(0, 300));
        } catch {
          // The pin is enough; the address field stays editable.
        }
      },
      () => {
        setStatus('error');
        setMessage(
          "We couldn't get your location. Allow location access, or type the address instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  // Small area around the pin for the embedded map.
  const d = 0.004;
  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - d},${coords.lat - d},${coords.lng + d},${coords.lat + d}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : null;

  return (
    <div className='space-y-3'>
      <label className='block text-sm font-semibold text-ink-soft'>
        Where is the animal?
        <span className='mt-0.5 block text-xs font-normal text-muted-foreground'>
          Street, barangay, landmark — anything that helps our team find the spot.
        </span>
        <textarea
          name='locationText'
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-invalid={!!errors['locationText']}
          className={fieldClass}
          placeholder='e.g. Beside the sari-sari store on Rizal St., Brgy. Poblacion, Talisay'
          maxLength={300}
        />
        <FieldError message={errors['locationText']} />
      </label>

      <input type='hidden' name='latitude' value={coords?.lat ?? ''} />
      <input type='hidden' name='longitude' value={coords?.lng ?? ''} />

      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          onClick={locate}
          disabled={status === 'locating'}
          className='inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary-hover disabled:opacity-60'
        >
          {status === 'locating' ? (
            <LoaderCircle className='size-4 animate-spin' />
          ) : (
            <LocateFixed className='size-4' />
          )}
          {coords ? 'Update my location' : 'Use my current location'}
        </button>
        {coords && (
          <span className='inline-flex items-center gap-1.5 text-[13px] font-medium text-success-text'>
            <MapPin className='size-4' /> Pin saved ({coords.lat}, {coords.lng})
          </span>
        )}
      </div>
      {status === 'error' && <p className='text-[13px] text-muted-foreground'>{message}</p>}

      {mapSrc && coords && (
        <div className='overflow-hidden rounded-[12px] border border-line-strong'>
          <iframe
            title='Map of the reported location'
            src={mapSrc}
            className='h-56 w-full'
            loading='lazy'
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target='_blank'
            rel='noreferrer'
            className='block border-t border-line-strong bg-card px-3.5 py-2 text-xs font-semibold text-plum hover:underline'
          >
            Check this spot in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}

/** Form onChange handler that clears a field's error as soon as the visitor edits it. */
export function clearErrorOnChange(setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name;
    if (!name) return;
    setErrors((current) => {
      if (!current[name]) return current;
      const { [name]: _removed, ...rest } = current;
      return rest;
    });
  };
}
