import { Box, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const CustomerBillData = ({
  customerPhone,
  isCustomerBillDataModalOpen,
  setIsCustomerBillDataModalOpen,
}) => {
  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isCustomerBillDataModalOpen}
        onClose={() => {
          setIsCustomerBillDataModalOpen(false);
        }}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isCustomerBillDataModalOpen}>
          <Box className="modal-wrapper modal-bg">
            {!customerPhone ? (
              <Typography
                variant="h5"
                component="h5"
                className="text-black modal-title"
              >
                Customer Phone Number Not Selected
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h6"
                  component="h6"
                  className="text-black modal-title"
                >
                  Bill No:
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CustomerBillData;
