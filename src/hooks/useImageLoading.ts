import { useState, useCallback } from 'react';

interface UseImageLoadingReturn {
  imageLoaded: boolean;
  imageError: boolean;
  handleLoad: () => void;
  handleError: () => void;
}

/**
 * Manages image loading and error states for card components.
 * Provides consistent skeleton → loaded → error behavior.
 */
export function useImageLoading(): UseImageLoadingReturn {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback(() => setImageLoaded(true), []);
  const handleError = useCallback(() => setImageError(true), []);

  return { imageLoaded, imageError, handleLoad, handleError };
}
