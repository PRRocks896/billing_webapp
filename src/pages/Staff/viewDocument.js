import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { FiDownload } from "react-icons/fi";

import useViewStaffDocument from "./hook/useViewDocument";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ViewStaffDocument = () => {
    const {
        idProof,
        staffPhoto,
        addressProof,
        passbookPhoto,
        signaturePhoto,
        certificatePhoto,
        download,
        handleBack
    } = useViewStaffDocument();

    const imagePath = (path) => {
        return `${baseUrl}${path?.split('/public')[1]}`
    }

    const showDetail = (title, path) => {
        return (
            <Box>
                <Typography style={{ display: 'flex', justifyContent: 'space-between'}} variant="subtitle1" fontWeight={700} fontSize={16}>
                    {title}
                    {path !== null &&
                        <Button style={{ padding: '0px', margin: '0px', width: '50px'}} className="btn btn-primary" onClick={() => download(title, imagePath(path))}>
                            <FiDownload fontSize={22}/>
                        </Button>
                    }
                </Typography>
                {path !== null ?
                    <Box sx={{ width: '100%', height: '500px' }}>
                        <img style={{ height: '100%', width: '100%'}} crossOrigin="anonymous" src={imagePath(path)} alt={title}/>
                    </Box>
                : 
                    <Typography variant="subtitle1" color="red">Not Uploaded</Typography>
                }
            </Box>
        )
    }

    return (
        <>
            <Box className="card">
                <Box style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Staff Document</Typography>
                    <Button className="btn btn-primary" style={{ padding: '0px', margin: '0px', width: '100px'}} onClick={handleBack}>
                        Back
                    </Button>
                </Box>
                <br/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        {showDetail('ID Proof', idProof)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {showDetail('Staff Photo', staffPhoto)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {showDetail('Address Proof', addressProof)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {showDetail('Passbook Photo', passbookPhoto)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {showDetail('Signature Photo', signaturePhoto)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {showDetail('Certificate Photo', certificatePhoto)}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default ViewStaffDocument;