import { Box, Button, Fade, Grid, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import "../assets/styles/loader.scss";
import { Stores, addData, deleteAllData, getStoreData } from "../utils/db";
import { createBulkBill } from "../service/bill";
import { listPayload, showToast } from "../utils/helper";
import { useSelector } from "react-redux";
import { createBulkCustomer, getCustomerList } from "../service/customer";
import useNoInternet from "../hook/useNoInternet";

const SyncModal = ({
  isSyncModalOpen,
  count,
  setIsSyncModalOpen,
  fetchBillData,
}) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { id } = loggedInUser;
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useNoInternet();

  const fetchCustomerData = async () => {
    try {
      let whereCondition = {
        isActive: true,
      };
      if (loggedInUser?.px_role?.name?.toLowerCase() !== "admin") {
        whereCondition = {
          ...whereCondition,
          createdBy: loggedInUser.id,
        };
      }
      const customebody = listPayload(0, whereCondition, 1000);

      const customerRepsonse = await getCustomerList(customebody);
      if (customerRepsonse?.statusCode === 200) {
        const payload = customerRepsonse?.data?.rows?.map((row) => ({
          ...row,
          flag: 0,
        }));
        await addData(Stores.Customer, payload, "bulk");
      } else if (customerRepsonse?.statusCode === 404) {
        const payload = [];
        await addData(Stores.Customer, payload, "bulk");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncDataHandler = async () => {
    try {
      setIsLoading(true);
      const custData = await getStoreData(Stores.Customer);
      const syncCustomerData1 = custData.data.filter(
        (row) => typeof row.id === "string"
      );
      const data1 = syncCustomerData1.map((row) => {
        let data = { ...row, customerNo: row.id, id: null };
        // delete data.id;
        return data;
      });
      // const data2 = custData.data.filter((row) => typeof row.id === "number");
      const data2 = custData.data.filter((row) => row.flag === 1);

      const syncCustomerData = [...data1, ...data2];
      // console.log(syncCustomerData);

      const response = await createBulkCustomer(syncCustomerData);
      if (response.statusCode === 200) {
        const customerData = response.data;
        const billData = await getStoreData(Stores.Bills);

        if (billData.statusCode === 200 && billData.data.length) {
          // const lastRecord = billData.data[billData.data.length - 1];
          // console.log(customerData, billData);
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
          // console.log(syncBillData);

          const bulkBillPayload = syncBillData.map((row) => {
            return {
              billNo: row.billNo,
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
          // console.log(bulkBillPayload);
          const response = await createBulkBill(bulkBillPayload);
          // console.log(response);
          if (response.statusCode === 200) {
            const deleteAllBill = await deleteAllData(Stores.Bills);
            const deleteAllCustomer = await deleteAllData(Stores.Customer);
            if (
              deleteAllBill.statusCode === 200 ||
              deleteAllCustomer.statusCode === 200
            ) {
              showToast(response.message, true);
              fetchCustomerData();
              fetchBillData();
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
                    onClick={() => {
                      if (isOnline) syncDataHandler();
                    }}
                  >
                    {!isOnline
                      ? "No Internet connection.."
                      : isLoading
                      ? "Loading..."
                      : "Sync"}
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
