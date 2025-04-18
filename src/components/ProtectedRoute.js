import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ path, Component }) => {
  const navigate = useNavigate();
  const { accessModules } = useSelector((state) => state.loggedInUser);
  const isAccessible = useMemo(() => {
    // Split path and get only name
    const mainPath = path.split("/")[0];
    if (accessModules && accessModules.length > 0) {
      
      return accessModules
        .map((res) => {
          // Check for View
          if (res.px_module.path === `/${mainPath}` && res.view) {
            return true;
          } else if (
            res.px_module.path ===
            `/${mainPath.substring(mainPath.indexOf("-") + 1)}`
          ) {
            // Check for Add
            if (
              (mainPath.includes("add") || mainPath.includes("create")) &&
              res.add
            ) {
              return true;
              // Check for Edit
            } else if (mainPath.includes("edit") && res.edit) {
              return true;
            } else if (mainPath.includes('view') && res.view) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .includes(true);
    } else {
      return false;
    }
  }, [accessModules, path]);


  useEffect(() => {
    // Not Found access return false and redirect to dashboard
    if (!isAccessible) {
      navigate("/", { replace: true });
    }
  }, [isAccessible, navigate]);
  return Component;

  // --------------------------------------------------------
};

export default ProtectedRoute;
