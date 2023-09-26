import { Box, Button, Fade, Grid, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import "../assets/styles/loader.scss";
import { Stores, deleteAllData, getStoreData } from "../utils/db";
import { createBulkBill } from "../service/bill";
import { showToast } from "../utils/helper";
import { useSelector } from "react-redux";
import { createBulkCustomer } from "../service/customer";

const SyncModal = ({ isSyncModalOpen, count, setIsSyncModalOpen }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { id } = loggedInUser;
  const [isLoading, setIsLoading] = useState(false);

  const syncDataHandler = async () => {
    try {
      setIsLoading(true);
      const custData = await getStoreData(Stores.Customer);
      const syncCustomerData1 = custData.data.filter(
        (row) => typeof row.id === "string"
      );
      const syncCustomerData = syncCustomerData1.map((row) => {
        let data = { ...row, customerNo: row.id };
        delete data.id;
        return data;
      });

      const response = await createBulkCustomer(syncCustomerData);
      console.log(response);
      if (response.statusCode === 200) {
        const customerData = response.data;
        const billData = await getStoreData(Stores.Bills);

        if (billData.statusCode === 200 && billData.data.length) {
          // const lastRecord = billData.data[billData.data.length - 1];

          const syncBillData = billData.data.map((row) => {
            const cust = customerData.find(
              (item) => item.customerNo === row.px_customer.customerNo
            );
            if (cust) {
              return { ...row, customerID: cust.id };
            } else {
              return { ...row };
            }
          });
          console.log(syncBillData);

          const bulkBillPayload = syncBillData.map((row) => {
            return {
              cardNo: row.cardNo,
              createdAt: row.createdAt,
              createdBy: id,
              customerID: row.customerID,
              detail: row.detail.map((item) => ({
                discount: item.discount,
                quantity: item.quantity,
                rate: item.rate,
                serviceID: item.serviceID,
                total: item.total,
              })),
              grandTotal: row.grandTotal.toString(),
              paymentID: row.paymentID,
              phoneNumber: row.phoneNumber.toString(),
              roomNo: row.roomNo,
              staffID: row.staffID,
              userID: row.userID,
              isDeleted: false,
              isActive: true,
              referenceBy: row.referenceBy,
            };
          });
          const response = await createBulkBill(bulkBillPayload);
          if (response.statusCode === 200) {
            const deleteAll = await deleteAllData(Stores.Bills);
            if (deleteAll.statusCode === 200) {
              showToast(response.message, true);
              setIsSyncModalOpen(false);
            }
          } else {
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsSyncModalOpen(false);
    }
  };
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
                  {count} Bills are pending to sync{" "}
                  {/* <span className="sync-loader"></span> */}
                </Typography>
              </Box>
            </Box>
            <Box className="modal-footer">
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <Button
                    className="btn btn-tertiary"
                    onClick={syncDataHandler}
                  >
                    {isLoading ? "Loading..." : "Sync"}
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

export default SyncModal;
