import { Box, Button, Fade, Grid, Modal, Typography } from "@mui/material";
import React from "react";

const AddCustomer = ({ isCustomerModalOpen, setIsCustomerModalOpen }) => {
  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isCustomerModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              New Customer
            </Typography>
            <Box className="modal-body">...</Box>
            <Box className="modal-footer">
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Button className="btn btn-tertiary">Save</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    className="btn btn-cancel"
                    onClick={() => setIsCustomerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddCustomer;
