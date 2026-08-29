import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { isLoggedIn, user, accessRights } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPendingDailyReport = useMemo(() => {
    if (user && user.hasOwnProperty("isLastDailyReportAdded")) {
      return user.isLastDailyReportAdded;
    }
    return false;
  }, [user]);

  useEffect(() => {
    if (isPendingDailyReport && location.pathname !== "/daily-report") {
      navigate('/daily-report', { replace: true });
    }
  }, [isPendingDailyReport, location.pathname, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location]);

  useEffect(() => {
    if (!isLoggedIn || isPendingDailyReport) return;

    // Routes that should never be blocked by access rights
    const whitelistedPaths = ['/dashboard', '/daily-report', '/', '/404', '/500', '/maintenance'];
    const isWhitelisted = whitelistedPaths.some(
      (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`))
    );

    if (isWhitelisted) return;

    // Pass location.pathname directly to accessRights (which matches module paths across /add, /edit/:id, /view/:id, etc.)
    const rights = accessRights(location.pathname);
    if (!rights?.view) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, isPendingDailyReport, location.pathname, accessRights, navigate]);

  return children;
}
