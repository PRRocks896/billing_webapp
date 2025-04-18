import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffById } from "../../../service/staff";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";

const useViewStaffDocument = () => {
    
    const navigate = useNavigate();
    
    const { id } = useParams();
    const [ staffDetail, setStaffDetail ] = useState(null);

    const addressProof = useMemo(() => {
        return staffDetail ? staffDetail?.addressProof : null;
    }, [staffDetail])

    const certificatePhoto = useMemo(() => {
        return staffDetail ? staffDetail?.certificatePhoto : null;
    }, [staffDetail]);

    const idProof = useMemo(() => {
        return staffDetail ? staffDetail?.idProof : null;
    }, [staffDetail]);

    const passbookPhoto = useMemo(() => {
        return staffDetail ? staffDetail?.passbookPhoto : null;
    }, [staffDetail]);

    const signaturePhoto = useMemo(() => {
        return staffDetail ? staffDetail?.signaturePhoto : null;
    }, [staffDetail]);

    const staffPhoto = useMemo(() => {
        return staffDetail ? staffDetail?.staffPhoto : null;
    }, [staffDetail]);

    const download = (title, imagePath) => {
        const extension = imagePath?.slice(imagePath?.lastIndexOf('.'), imagePath?.length);
        fetch(imagePath, { method: 'GET'}).then((response) => {
            response.arrayBuffer().then(function(buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${staffDetail?.name}_${title}${extension}`); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
        }).catch((err) => {
            showToast(err?.message, false);
        })
    }

    const handleBack = () => {
        navigate('/staff');
    }

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const response = await getStaffById(id);
                if (response?.statusCode === 200) {
                    setStaffDetail(response.data);
                } else {
                    showToast(response?.message, false);
                    setStaffDetail(null)
                }
            } catch(error) {
                showToast(error?.message, false);
            } finally {
                stopLoading();
            }
        })();
        // eslint-disable-next-line
    }, [id]);
    
    return {
        idProof,
        staffPhoto,
        staffDetail,
        addressProof,
        passbookPhoto,
        signaturePhoto,
        certificatePhoto,
        download,
        handleBack
    }
}

export default useViewStaffDocument;