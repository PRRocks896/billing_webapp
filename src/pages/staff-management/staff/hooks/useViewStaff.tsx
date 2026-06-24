import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffById } from "service/staff";

const UseViewStaff = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { startLoading, stopLoading } = useAuth();
    const [staffData, setStaffData] = useState<any>(null);

    const handleBack = () => navigate("/staff");

    const fetchStaffData = useCallback(async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getStaffById(Number(id));
            if (success) {
                setStaffData(data);
            } else {
                openSnackbar({
                    open: true,
                    message,
                    variant: 'alert',
                    alert: { color: 'error' },
                    severity: 'error'
                });
                navigate('/staff');
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: { color: 'error' },
                severity: 'error'
            });
            navigate('/staff');
        } finally {
            stopLoading();
        }
    }, [id, navigate, startLoading, stopLoading]);

    useEffect(() => {
        if (id) {
            fetchStaffData();
        }
    }, [fetchStaffData]);

    const addressProof = useMemo(() => {
        return staffData ? staffData?.addressProof : null;
    }, [staffData])

    const certificatePhoto = useMemo(() => {
        return staffData ? staffData?.certificatePhoto : null;
    }, [staffData]);

    const idProof = useMemo(() => {
        return staffData ? staffData?.idProof : null;
    }, [staffData]);

    const passbookPhoto = useMemo(() => {
        return staffData ? staffData?.passbookPhoto : null;
    }, [staffData]);

    const signaturePhoto = useMemo(() => {
        return staffData ? staffData?.signaturePhoto : null;
    }, [staffData]);

    const staffPhoto = useMemo(() => {
        return staffData ? staffData?.staffPhoto : null;
    }, [staffData]);

    const download = (title: string, imagePath: string) => {
        const extension = imagePath?.slice(imagePath?.lastIndexOf('.'), imagePath?.length);
        fetch(imagePath, { method: 'GET' }).then((response) => {
            response.arrayBuffer().then(function (buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${staffData?.name}_${title}${extension}`); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }).catch((error: any) => {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: { color: 'error' },
                severity: 'error'
            });
        })
    }

    return {
        addressProof,
        certificatePhoto,
        idProof,
        passbookPhoto,
        signaturePhoto,
        staffPhoto,
        staffData,
        download,
        handleBack,
    };
}

export default UseViewStaff;