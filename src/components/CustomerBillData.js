import { Box, Fade, Modal, Typography } from "@mui/material";
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
          sortBy: "billNo",
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h6"
                    className="text-black"
                  >
                    Bill No
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h6"
                    className="text-black"
                  >
                    Service
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h6"
                    className="text-black"
                  >
                    Amount
                  </Typography>
                </Box>
                <hr />
                {data.map((row) => {
                  return (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="p"
                          component="p"
                          className="text-black"
                        >
                          {row.billNo}
                        </Typography>
                        {row.detail.map((service) => {
                          return (
                            <>
                              <Typography
                                variant="p"
                                component="p"
                                className="text-black"
                              >
                                {service.serviceID}
                              </Typography>
                              <Typography
                                variant="p"
                                component="p"
                                className="text-black"
                              >
                                {service.rate}
                              </Typography>
                            </>
                          );
                        })}
                      </Box>
                      <hr />
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
