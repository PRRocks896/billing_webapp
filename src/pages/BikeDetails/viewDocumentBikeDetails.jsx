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
import useViewBikeDetailsDocument from "./hook/useViewDocumentBikeDetails.";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ViewBikeDetailsDocument = () => {
    const {
        rcBookDoc,
        insurancePolicyDoc,
        download,
        handleBack,
        visibleRows
    } = useViewBikeDetailsDocument();

    const { id } = useParams();
    const selectedBike = visibleRows.find(row => row.id === Number(id));

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
        if (!previewPath || !selectedBike) return null;
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
                        Bike Details Document
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
                        {showDetail("Rc Book", rcBookDoc)}
                        {selectedBike ? (
                            <div>
                                <span>Bike Name : {selectedBike.bikeName}</span>
                                <br />
                                <span>Bike Number : {selectedBike.bikeNumber}</span>
                                <br />
                                <span>Register Number : {selectedBike.registerNumber}</span>
                                <br />
                                <span>Register Date : {selectedBike.registerDate}</span>
                                <br />
                                <span>Renew Date: {selectedBike.renewDate}</span>
                            </div>
                        ) : (
                            <div>No data found</div>
                        )}

                    </Grid>

                    <Grid item xs={12} sm={12}>
                        {showDetail("Insurance Policy", insurancePolicyDoc)}
                        {selectedBike ? (
                            <div>
                                <span>Insurance Number : {selectedBike.insuranceNumber}</span>
                                <br />
                                <span>Insurance Date : {selectedBike.insuranceDate}</span>
                                <br />
                                <span>Insurance Renew Date : {selectedBike.insuranceRenewDate}</span>
                                <br />
                            </div>
                        ) : (
                            <div>No data found</div>
                        )}

                    </Grid>
                </Grid>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{previewTitle}</DialogTitle>
                <DialogContent>{modalPreview()}</DialogContent>
            </Dialog>
        </>
    );
};

export default ViewBikeDetailsDocument;
