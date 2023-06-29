import { Box, Button, Fade, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { FiPlus } from "react-icons/fi";

const ConfirmationModal = ({ isDeleteModalOpen, deleteModalClose, title }) => {
  return (
    <>
      {/* delete confirmation modal start */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isDeleteModalOpen}
        onClose={deleteModalClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isDeleteModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              Delete {title}
            </Typography>
            <Box className="modal-close" onClick={deleteModalClose}>
              <FiPlus />
            </Box>
            <Box className="modal-body">
              <Box className="confirmation-text">
                <Typography paragraph>
                  Are you sure want to delete this {title}?
                </Typography>
              </Box>
            </Box>
            <Box className="modal-footer">
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Button className="btn btn-tertiary">Yes</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button className="btn btn-cancel" onClick={deleteModalClose}>
                    No
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* delete confirmation modal end */}
    </>
  );
};

export default ConfirmationModal;
