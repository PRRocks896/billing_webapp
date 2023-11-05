import {
  Box,
  Fade,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getBillList } from "../service/bill";
import { listPayload } from "../utils/helper";
import { useSelector } from "react-redux";
import moment from 'moment';

const getDate = () => {
  const originalDate = "2023-10-09T17:43:46.000Z";

  const dateObj = new Date(originalDate);

  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
  const year = dateObj.getUTCFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

const CustomerBillData = ({
  customerPhone,
  isCustomerBillDataModalOpen,
  setIsCustomerBillDataModalOpen,
}) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userRole = loggedInUser?.px_role?.name?.toLowerCase();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        setIsLoading(true);
        let whereCondition = {
          isDeleted: false,
          searchText: customerPhone.label.toString(),
        };
        if (userRole !== "admin") {
          whereCondition = {
            ...whereCondition,
            userID: loggedInUser.id,
          };
        }

        const body = listPayload(0, whereCondition, 1000, {
          sortBy: "createdAt",
        });

        const response = await getBillList(body);
        if (response?.statusCode === 200) {
          setData(response.data.rows);
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillData();
  }, [customerPhone.label, loggedInUser.id, userRole]);
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
          <Box className="modal-wrapper modal-lg modal-bg">
            {isLoading ? (
              <Typography
                variant="h5"
                component="h5"
                className="text-black modal-title"
              >
                Loading...
              </Typography>
            ) : (
              <>
                <Typography variant="h6" className="text-black">
                  Customer: {data[0]?.px_customer?.name}
                </Typography>
                <Typography variant="h6" className="text-black">
                  Phone Number: {customerPhone.label.toString()}
                </Typography>
                <hr />
                {data.map((row) => {
                  return (
                    <>
                      <Box sx={{ marginBottom: "16px" }}>
                        <Typography variant="h6" className="text-black">
                          Bill No: {row.billNo}
                        </Typography>

                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Date</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Therapist</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Reference By</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Paid By</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Service</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Qty</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Amount</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.detail.map((item) => {
                              return (
                                <>
                                  <TableRow>
                                    <TableCell>
                                      {moment(row.createdAt).format('DD/MM/yyyy hh:mm A')}
                                      {/* {getDate(row.createdAt)} */}
                                    </TableCell>
                                    <TableCell>{row?.px_staff?.name}</TableCell>
                                    <TableCell>{row?.referenceBy}</TableCell>
                                    <TableCell>{
                                      row?.px_payment_type?.name === 'Card' ? `${row?.px_payment_type?.name} - ${row?.cardNo}` : row?.px_payment_type?.name
                                    }</TableCell>
                                    <TableCell>{item?.service?.name}</TableCell>
                                    <TableCell>{item?.quantity}</TableCell>
                                    <TableCell>{item.rate}</TableCell>
                                  </TableRow>
                                </>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </>
                  );
                })}
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CustomerBillData;
