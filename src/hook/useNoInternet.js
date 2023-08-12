import { useEffect, useState } from "react";

const useNoInternet = () => {
  const status = window.navigator.onLine;
  const [isOnline, setIsOnline] = useState(status);
  const pathname = window.location.pathname;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, pathname };
};

export default useNoInternet;
