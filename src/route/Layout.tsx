import { Outlet } from 'react-router-dom';
import { useAnalytics } from '../hook/useAnalytics';

/**
 * Root layout: runs analytics (init + pageview on route change) and renders the matched route.
 */
export const Layout = () => {
  useAnalytics();
  return <Outlet />;
};
