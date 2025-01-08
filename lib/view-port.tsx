import { useEffect, useState } from 'react';

// Define breakpoint sizes in pixels
export const breakpoints = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  'desktop-lg': 1440,
  '2xl': 1536,
  '3xl': 1920,
} as const;

type Breakpoint = keyof typeof breakpoints;

// Type for the hook return value
interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isDesktopLg: boolean;
  is2XL: boolean;
  is3XL: boolean;
  breakpoint: Breakpoint;
}

export const useViewport = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    isDesktopLg: false,
    is2XL: false,
    is3XL: false,
    breakpoint: 'mobile',
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setViewport({
        width,
        height,
        isMobile: width >= breakpoints.mobile && width < breakpoints.tablet,
        isTablet: width >= breakpoints.tablet && width < breakpoints.laptop,
        isLaptop: width >= breakpoints.laptop && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop && width < breakpoints['desktop-lg'],
        isDesktopLg: width >= breakpoints['desktop-lg'] && width < breakpoints['2xl'],
        is2XL: width >= breakpoints['2xl'] && width < breakpoints['3xl'],
        is3XL: width >= breakpoints['3xl'],
        breakpoint: getBreakpoint(width),
      });
    };

    // Initial call
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Helper function to get current breakpoint
const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints['desktop-lg']) return 'desktop-lg';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.laptop) return 'laptop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
};

// Utility component for conditional rendering based on breakpoint
interface ViewportMatchProps {
  children: React.ReactNode;
  breakpoint: Breakpoint | Breakpoint[];
  above?: boolean;
  below?: boolean;
}

export const ViewportMatch: React.FC<ViewportMatchProps> = ({
  children,
  breakpoint,
  above = false,
  below = false,
}) => {
  const { width } = useViewport();
  const breakpointValues = Array.isArray(breakpoint) ? breakpoint : [breakpoint];
  
  const matches = breakpointValues.some(bp => {
    const breakpointWidth = breakpoints[bp];
    if (above) return width >= breakpointWidth;
    if (below) return width < breakpointWidth;
    return width >= breakpointWidth && width < getNextBreakpoint(bp);
  });

  return matches ? <>{children}</> : null;
};

// Helper function to get next breakpoint value
const getNextBreakpoint = (breakpoint: Breakpoint): number => {
  const breakpointKeys = Object.keys(breakpoints) as Breakpoint[];
  const currentIndex = breakpointKeys.indexOf(breakpoint);
  const nextBreakpoint = breakpointKeys[currentIndex + 1];
  return nextBreakpoint ? breakpoints[nextBreakpoint] : Infinity;
};
