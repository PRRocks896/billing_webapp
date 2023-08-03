import { useEffect, useState } from "react";

const useNoInternet = () => {
  const status = window.navigator.onLine;
  console.log("status", status);
  const [isOnline, setIsOnline] = useState(status);

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

  return isOnline;
};

export default useNoInternet;
