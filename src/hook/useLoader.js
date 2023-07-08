import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../redux/loader";

const useLoader = () => {
  const dispatch = useDispatch();

  const loading = (isLoading) => {
    console.log(isLoading);
    if (isLoading) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  };

  return { loading };
};

export default useLoader;
