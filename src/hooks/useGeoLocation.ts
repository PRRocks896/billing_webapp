import { useState, useCallback, useEffect } from 'react';

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface GeoLocationHookResult {
  location: GeoLocation | null;
  error: string | null;
  isLoading: boolean;
  getLocation: () => void;
}

/**
 * Custom hook to get the user's geographic location.
 * 
 * @param autoFetch - Whether to automatically fetch location on mount. Defaults to true.
 * @returns {GeoLocationHookResult} The location data, error state, loading state, and a function to trigger a manual fetch.
 */
const useGeoLocation = (autoFetch: boolean = true): GeoLocationHookResult => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to get location');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    if (autoFetch) {
      getLocation();
    }
  }, [autoFetch, getLocation]);

  return { location, error, isLoading, getLocation };
};

export default useGeoLocation;
