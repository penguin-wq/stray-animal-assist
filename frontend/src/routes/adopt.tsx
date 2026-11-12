import { Outlet, createFileRoute } from '@tanstack/react-router';

// Layout route for /adopt/*: renders only the outlet so the inquiry page
// (/adopt/inquiry) can appear without the site navbar and footer.
export const Route = createFileRoute('/adopt')({
  component: () => <Outlet />,
});
