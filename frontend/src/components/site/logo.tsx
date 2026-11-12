import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

/** StrayAssist wordmark that links back to the home page. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex flex-col items-end', className)}>
      <Link
        to='/'
        aria-label='StrayAssist home'
        className='flex items-center gap-1 text-muted-foreground'
      >
        {/* Placeholder logo mark from the original design (a crossed square). */}
        <svg
          aria-hidden='true'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <rect x='1' y='1' width='22' height='22' />
          <path d='M1 1l22 22M23 1L1 23' />
        </svg>
        <span className='text-2xl leading-6 font-bold tracking-[-0.02em]'>StrayAssist</span>
      </Link>
      <span className='mt-0.5 text-xs leading-3 text-muted-foreground'>
        {'by '}
        <a
          href='https://design-ui.com'
          target='_blank'
          rel='noreferrer'
          className='underline underline-offset-2 hover:text-foreground'
        >
          design-ui.com
        </a>
      </span>
    </div>
  );
}
