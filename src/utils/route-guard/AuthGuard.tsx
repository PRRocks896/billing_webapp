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
    if (isPendingDailyReport && location.pathname !== "/daily-report/add") {
      navigate('/daily-report/add', { replace: true });
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
    if (!isLoggedIn) return;

    // Routes that should never be blocked by access rights
    const whitelistedPaths = ['/dashboard', '/daily-report/add', '/'];
    const currentPath = location.pathname.split('/').filter((p) => p !== '').length > 1 && !['add', 'edit', 'view'].includes(location.pathname.split('/')[location.pathname.split('/').length - 1]) ? "/" + location.pathname.split('/').filter((p) => p !== '')[1] : location.pathname;

    if (whitelistedPaths.includes(currentPath)) return;
    const rights = accessRights(currentPath);
    if (!rights?.view) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, location.pathname, accessRights, navigate]);

  return children;
}
