import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Create MediaQueryList object
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event) => setMatches(event.matches);
    
    // Add event listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  // Return false on initial server-side rendering
  if (!mounted) return false;

  return matches;
}

// Predefined breakpoints based on Tailwind's default breakpoints
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export function useBreakpoint(breakpoint) {
  return useMediaQuery(breakpoints[breakpoint]);
}

export function useIsMobile() {
  return !useMediaQuery('(min-width: 768px)');
}

export function useIsTablet() {
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  return isTablet;
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
}

export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useResponsiveValue(values) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  if (isDesktop) return values.desktop || values.tablet || values.mobile;
  if (isTablet) return values.tablet || values.mobile;
  return values.mobile;
}

export default useMediaQuery;