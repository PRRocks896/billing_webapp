import {
    Box,
    Button,
    Fade,
    Grid,
    Modal,
    Typography,
  } from "@mui/material";
  import React from "react";

const ViewDetail = ({
    open,
    detail,
    okTitle = 'Save',
    handleOk,
    handleClose,
}) => {
    return (
        <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        >
            <Fade in={open}>
                <Box className="modal-wrapper modal-bg">
                    <Typography
                        variant="h6"
                        component="h6"
                        className="text-black modal-title"
                    >
                        Are you sure?
                    </Typography>
                    <Box className="modal-body">
                        {Object.keys(detail)?.map((field, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                                        {field.toUpperCase()}:
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1" fontSize={18}>
                                        {Object.values(detail)[index]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                    <Box className="modal-footer">
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <Button className="btn btn-tertiary" onClick={handleOk}>
                                    {okTitle}
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Button className="btn btn-cancel" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default ViewDetail;