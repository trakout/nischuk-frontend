import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { init, pageview, trackEvent } from '../service/analyticsService';

const DEFAULT_MEASUREMENT_ID = 'UA-36319031-2';

/**
 * Call from a component inside the router (e.g. layout) to init analytics
 * and send pageview on route change. Replaces old React-GA initialize + set + pageview.
 */
export const useAnalytics = (measurementId: string = DEFAULT_MEASUREMENT_ID): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    init(measurementId);
  }, [measurementId]);

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);
};

/**
 * Track a one-off event (e.g. outbound click). Use from event handlers.
 */
export { trackEvent };