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
        console.log(error);
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
          <Box className="modal-wrapper modal-bg">
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
                                <strong>Service</strong>
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
                                    <TableCell>{item?.service?.name}</TableCell>
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
