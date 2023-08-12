import { Box, Fade, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import "../assets/styles/loader.scss";

const SyncModal = ({ isSyncModalOpen, count }) => {
  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isSyncModalOpen}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isSyncModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              Sync Bills
            </Typography>

            <Box className="modal-body">
              <Box className="confirmation-text">
                <Typography paragraph>
                  {count} Bills are syncing now{" "}
                  <span className="sync-loader"></span>
                </Typography>
              </Box>
            </Box>
            {/* <Box className="modal-footer">
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Button className="btn btn-tertiary" onClick={deleteHandler}>
                    Yes
                  </Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    className="btn btn-cancel"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
            </Box> */}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SyncModal;
