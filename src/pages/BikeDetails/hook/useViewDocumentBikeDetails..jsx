import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBikeDetailsById } from "../../../service/bikeDetails";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import {  useSelector } from "react-redux";


const useViewBikeDetailsDocument = () => {

    const navigate = useNavigate();
    const bikeDetailsData = useSelector((state) => state.bikeDetails.data);

    const { id } = useParams();
    const [bikeDetails, setBikeDetails] = useState(null);

    const rcBookDoc = useMemo(() => {
        return bikeDetails ? bikeDetails?.rcBookDoc : null;
    }, [bikeDetails])

    const insurancePolicyDoc = useMemo(() => {
        return bikeDetails ? bikeDetails?.insurancePolicyDoc : null;
    }, [bikeDetails]);

    const visibleRows = useMemo(() => {
        return bikeDetailsData;
    }, [bikeDetailsData]);


    const download = (title, imagePath) => {
        const extension = imagePath?.slice(imagePath?.lastIndexOf('.'), imagePath?.length);
        fetch(imagePath, { method: 'GET' }).then((response) => {
            response.arrayBuffer().then(function (buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${bikeDetails?.name}_${title}${extension}`); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }).catch((err) => {
            showToast(err?.message, false);
        })
    }

    const handleBack = () => {
        navigate('/bike-details');
    }

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const response = await getBikeDetailsById(id);
                if (response?.statusCode === 200) {
                    setBikeDetails(response.data);
                } else {
                    showToast(response?.message, false);
                    setBikeDetails(null)
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
        rcBookDoc,
        insurancePolicyDoc,
        download,
        handleBack,
        visibleRows
    }
}

export default useViewBikeDetailsDocument;