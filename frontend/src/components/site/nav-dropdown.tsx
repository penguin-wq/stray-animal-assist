import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { NavLinkItem } from '@/data/nav';
import { cn } from '@/lib/utils';
import { SmartLink } from './smart-link';

/** Desktop menu item that opens a small list of links (used for "Resources"). */
export function NavDropdown({ label, items }: { label: string; items: NavLinkItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // While open, close the menu when the user clicks outside it or presses Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className='relative'>
      {/* The menu label; clicking toggles the list. */}
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-1.5 text-base font-medium text-foreground hover:text-muted-foreground'
      >
        {label}
        <ChevronDown
          aria-hidden='true'
          className={cn('size-4 transition-transform', open && 'rotate-180')}
          strokeWidth={2}
        />
      </button>
      {/* The list of links, shown only while open. Picking a link closes it. */}
      {open && (
        <ul className='absolute top-[calc(100%+12px)] right-0 z-20 w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-dropdown'>
          {items.map((item) => (
            <li key={item.label}>
              <SmartLink
                to={item.to}
                onClick={() => setOpen(false)}
                className='block rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-secondary'
              >
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
