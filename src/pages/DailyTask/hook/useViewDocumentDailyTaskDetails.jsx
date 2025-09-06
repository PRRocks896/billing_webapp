import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDailyTaskById } from "../../../service/dailyTask";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useDispatch, useSelector } from "react-redux";


const useViewDailyTaskDocument = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dailyTask = useSelector((state) => state.dailyTask.data);

    const { id } = useParams();
    const [dailyTaskDetails, setDailyTaskDetails] = useState(null);

    const photo = useMemo(() => {
        return dailyTaskDetails ? dailyTaskDetails?.photo : null;
    }, [dailyTaskDetails])

    const visibleRows = useMemo(() => {
        return dailyTask;
    }, [dailyTask]);


    const download = (title, imagePath) => {
        const extension = imagePath?.slice(imagePath?.lastIndexOf('.'), imagePath?.length);
        fetch(imagePath, { method: 'GET' }).then((response) => {
            response.arrayBuffer().then(function (buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${dailyTaskDetails?.name}_${title}${extension}`); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }).catch((err) => {
            showToast(err?.message, false);
        })
    }

    const handleBack = () => {
        navigate('/daily-task');
    }

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const response = await getDailyTaskById(id);
                if (response?.statusCode === 200) {
                    setDailyTaskDetails(response.data);
                } else {
                    showToast(response?.message, false);
                    setDailyTaskDetails(null)
                }
            } catch (error) {
                showToast(error?.message, false);
            } finally {
                stopLoading();
            }
        })();
        // eslint-disable-next-line
    }, [id]);

    return {
        photo,
        download,
        handleBack,
        visibleRows
    }
}

export default useViewDailyTaskDocument;