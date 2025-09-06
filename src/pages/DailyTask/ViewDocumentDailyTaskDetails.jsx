import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useParams } from "react-router-dom";
import { FiDownload, FiEye } from "react-icons/fi";
import useViewDailyTaskDocument from "./hook/useViewDocumentDailyTaskDetails";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ViewDailyTaskDetailsDocument = () => {
    const {
        photo,
        download,
        handleBack,
        visibleRows
    } = useViewDailyTaskDocument();

    const { id } = useParams();
    const selectedDailyTask = visibleRows.find(row => row.id === Number(id));

    const [open, setOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewPath, setPreviewPath] = useState("");

    const imagePath = (path) => {
        if (!path) return null;
        if (!baseUrl) {
            return path;
        }
        const fixedPath = path.replace(/,/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

        return `${normalizedBaseUrl}${fixedPath}`;
    };

    const handleView = (title, path) => {
        setPreviewTitle(title);
        setPreviewPath(path);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPreviewTitle("");
        setPreviewPath("");
    };

    const showDetail = (title, path) => {
        return (
            <Box>
                <Typography
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    variant="subtitle1"
                    fontWeight={700}
                    fontSize={16}
                >
                    {title}
                    <Box>
                        <Grid container spacing={2}>

                            {path && (
                                <>
                                    <Grid item xs={6} sm={6}>
                                        <Button
                                            size="small"
                                            style={{ marginRight: "5px" }}
                                            className="btn btn-primary"
                                            onClick={() => handleView(title, path)}
                                        >
                                            <FiEye size={15} />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Button
                                            size="small"
                                            className="btn btn-primary"
                                            onClick={() => download(title, imagePath(path))}
                                        >
                                            <FiDownload fontSize={18} />
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                </Typography>

                {!path && (
                    <Typography variant="subtitle1" color="red">
                        Not Uploaded
                    </Typography>
                )}
            </Box>
        );
    };

    const modalPreview = () => {
        if (!previewPath || !selectedDailyTask) return null;
        const fileUrl = imagePath(previewPath);
        const extension = previewPath.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png"].includes(extension)) {
            return (
                <img
                    src={fileUrl}
                    alt={previewTitle}
                    style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
                    crossOrigin="anonymous"
                />
            );
        } else if (extension === "pdf") {
            return (
                <iframe
                    src={fileUrl}
                    title={previewTitle}
                    width="100%"
                    height="700px"
                    style={{ border: "1px solid #ccc", borderRadius: "8px", objectFit: "contain" }}
                />
            );
        }
        return <Typography color="red">Unsupported File Type</Typography>;
    };

    return (
        <>
            <Box className="card">
                <Box style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" fontWeight={700} fontSize={22}>
                        Daily Task Document
                    </Typography>
                    <Button
                        className="btn btn-primary"
                        style={{ padding: "0px", margin: "0px", width: "100px" }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Box>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        {selectedDailyTask ? (
                            <div>
                                <span>Branch Name : {selectedDailyTask.px_user.branchName}</span>
                                <br />
                                <span>Supervisor : {selectedDailyTask.supervisormanager.nickName}</span>
                                <br />
                                <span>Note : {selectedDailyTask.note}</span>
                                <br />
                            </div>
                        ) : (
                            <div>No data found</div>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {showDetail("Photo", photo)}
                    </Grid>

                </Grid>
            </Box >

            <Dialog Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth >
                <DialogTitle>{previewTitle}</DialogTitle>
                <DialogContent>{modalPreview()}</DialogContent>
            </Dialog >
        </>
    );
};

export default ViewDailyTaskDetailsDocument;
