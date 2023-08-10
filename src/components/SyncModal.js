import { Box, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const SyncModal = ({ isModalOpen }) => {
  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isModalOpen}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Box className="modal-body">
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="confirmation-text"
              >
                <span
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                  className="loader"
                ></span>
                <Typography paragraph>Syncing data to server... </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SyncModal;
