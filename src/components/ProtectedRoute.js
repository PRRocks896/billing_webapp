import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ path, Component }) => {
  const navigate = useNavigate();
  const { accessModules } = useSelector((state) => state.loggedInUser);

  useMemo(() => {
    let isAccessPath;
    if (accessModules) {
      for (let element of accessModules) {
        if (element.px_module.path === `/${path}`) {
          isAccessPath = true;
          break;
        } else {
          isAccessPath = false;
        }
      }
    }

    if (!isAccessPath) {
      navigate("/", { replace: true });
    }
  }, [accessModules, navigate, path]);

  return Component;
};

export default ProtectedRoute;
