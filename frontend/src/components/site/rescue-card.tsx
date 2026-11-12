import { Link } from '@tanstack/react-router';
import { ArrowRight, PawPrint } from 'lucide-react';
import { siteButtonClasses } from './site-button';
import type { Rescue } from '@/data/rescues';

/** Card for one animal in the rescues grid, linking to that animal's detail page. */
export function RescueCard({ rescue }: { rescue: Rescue }) {
  return (
    <article className='overflow-hidden rounded-[10px] border border-line-strong bg-card transition-transform hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(17,18,20,0.07)]'>
      {/* Photo area: shows a paw icon until real animal photos are added. */}
      <div className='flex aspect-[1.25] items-center justify-center bg-surface-soft text-line-strong'>
        <PawPrint
          aria-label={`${rescue.name} photo placeholder`}
          className='size-[52px]'
          strokeWidth={1.25}
        />
      </div>
      <div className='flex items-end justify-between gap-3 border-t border-line-strong p-[26px]'>
        <div>
          <p className='text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
            {rescue.type} · {rescue.age} · {rescue.gender}
          </p>
          <h2 className='mt-3 text-[21px] font-bold uppercase tracking-[0.02em] text-ink-soft'>
            {rescue.name}
          </h2>
        </div>
        {/* "About me" button opens /rescues/<slug>. */}
        <Link
          to='/rescues/$slug'
          params={{ slug: rescue.slug }}
          className={siteButtonClasses('secondary', 'sm', 'shrink-0 rounded-full text-sm')}
        >
          About me
          <ArrowRight aria-hidden='true' className='size-3.5' />
        </Link>
      </div>
    </article>
  );
}
