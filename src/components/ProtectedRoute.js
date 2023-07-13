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
          } else if (res.px_module.path === `/${mainPath.split("-")[1]}`) {
            // Check for Add
            if (mainPath.includes("add") && res.add) {
              return true;
              // Check for Edit
            } else if (mainPath.includes("edit") && res.edit) {
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

  // const navigate = useNavigate();
  // console.log("********", path, Component);
  // const { accessModules } = useSelector((state) => state.loggedInUser);
  // console.log(accessModules);
  // useMemo(() => {
  //   let isAccessPath;
  //   if (accessModules) {
  //     for (let element of accessModules) {
  //       console.warn(element);
  //       if (element.px_module.path === `/${path}` && element.view) {
  //         // isAccessPath = true;
  //         // break;
  //         if (!element.add) {
  //           isAccessPath = false;
  //         } else {
  //           isAccessPath = true;
  //         }
  //         if (!element.edit) {
  //           isAccessPath = false;
  //         } else {
  //           isAccessPath = true;
  //         }
  //         if (isAccessPath) {
  //           break;
  //         }
  //       } else {
  //         isAccessPath = false;
  //       }
  //     }
  //   }
  //   if (!isAccessPath) {
  //     navigate("/", { replace: true });
  //   }
  // }, [accessModules, navigate, path]);
  // return Component;
};

export default ProtectedRoute;
