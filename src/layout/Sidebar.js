import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { FiChevronRight, FiLogOut, FiGrid, FiSquare } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutHandler, showToast } from "../utils/helper";
import { useSelector } from "react-redux";
import { Stores, deleteAllData, getStoreData } from "../utils/db";
import SyncModal from "../components/SyncModal";
import { createBulkBill } from "../service/bill";

const Sidebar = () => {
  let panelNo = 3;
  const { accessModules, id } = useSelector((state) => state.loggedInUser);

  const navigate = useNavigate();
  const location = useLocation();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [billCount, setBillCount] = useState(0);

  // sidebar menu accordion
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const activeTab = location.pathname;

  const mainMenuListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          ["User", "Bill", "Report"].includes(row.px_module.name) &&
          row.view
        ) {
          return row;
        } else {
          return null;
        }
      });
    } else {
      return [];
    }
  }, [accessModules]);

  const subMenuListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          !["User", "Bill", "Report"].includes(row.px_module.name) &&
          row.view
        ) {
          return row;
        } else {
          return null;
        }
      });
    }
  }, [accessModules]);

  const logoutClickHandler = async () => {
    try {
      await deleteAllData(Stores.Staff);
      await deleteAllData(Stores.Customer);
      await deleteAllData(Stores.Service);
      await deleteAllData(Stores.Payment);

      const billData = await getStoreData(Stores.Bills);
      if (billData.statusCode === 200 && billData.data.length) {
        setBillCount(billData.data.length);
        setIsSyncModalOpen(true);

        const bulkBillPayload = billData.data.map((row) => {
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
            roomNo: +row.roomNo,
            staffID: row.staffID,
            userID: row.userID,
            isDeleted: false,
            isActive: true,
          };
        });

        const response = await createBulkBill(bulkBillPayload);

        if (response.statusCode === 200) {
          const deleteAll = await deleteAllData(Stores.Bills);
          if (deleteAll.statusCode === 200) {
            showToast(response.message, true);
            setIsSyncModalOpen(false);
            logoutHandler();
          }
        } else {
          logoutHandler();
        }
      } else {
        logoutHandler();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSyncModalOpen(false);
    }
  };

  return (
    <>
      {/* sidebar menu */}
      <Box className="sidebar-menu">
        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            className="menu-list"
            onClick={() => navigate("/")}
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>
                <GoHome /> Home
              </Typography>
            </AccordionSummary>
          </Accordion>

          {subMenuListArray?.length > 0 && (
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              className="menu-list"
            >
              <AccordionSummary
                className="menu-title"
                expandIcon={<FiChevronRight />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography>
                  <FiGrid /> Master
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="sub-menu-list">
                {subMenuListArray?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      className={`sub-menu-link ${
                        activeTab === item?.px_module?.path && "active"
                      }`}
                      onClick={() =>
                        navigate(item?.px_module?.path, {
                          state: {
                            add: item.add,
                            edit: item.edit,
                            delete: item.delete,
                            view: item.view,
                          },
                        })
                      }
                    >
                      <Typography>
                        <FiSquare />
                        {item?.px_module?.name}
                      </Typography>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          )}

          {mainMenuListArray?.map((item, index) => {
            return (
              <Accordion
                key={index}
                expanded={expanded === panelNo}
                onChange={handleChange(panelNo++)}
                className="menu-list"
                onClick={() => {
                  navigate(item?.px_module?.path, {
                    state: {
                      add: item?.add,
                      edit: item?.edit,
                      delete: item?.delete,
                      view: item?.view,
                    },
                  });
                }}
              >
                <AccordionSummary
                  className="menu-title"
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography>
                    <i className={`${item?.px_module?.icon}`}></i>
                    {item?.px_module?.name}
                  </Typography>
                </AccordionSummary>
              </Accordion>
            );
          })}
        </div>
        <div onClick={logoutClickHandler}>
          <Accordion
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
            className="menu-list"
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography>
                <FiLogOut /> Logout
              </Typography>
            </AccordionSummary>
          </Accordion>
        </div>
      </Box>

      {isSyncModalOpen && (
        <SyncModal isSyncModalOpen={isSyncModalOpen} count={billCount} />
      )}
    </>
  );
};

export default Sidebar;
