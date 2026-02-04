import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  FiChevronRight,
  FiLogOut,
  FiGrid,
  FiSquare,
  FiRepeat,
} from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { FaTruckRampBox } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutHandler, showToast } from "../utils/helper";
import { logout } from "../service/login";
import { startLoading, stopLoading } from "../redux/loader";

const Sidebar = () => {
  let panelNo = 3;
  const { accessModules, id, px_role } = useSelector((state) => state.loggedInUser);

  const isAdmin = useMemo(() => {
    if (px_role && px_role.name) {
      return ['admin', 'super admin'].includes(px_role?.name?.toLowerCase())
    }
    return false;
  }, [px_role]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // sidebar menu accordion
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const activeTab = location.pathname;

  const courierMenuListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (["send courier", "receive courier"].includes(row.px_module.name.toLowerCase()) && row.view) {
          return row;
        } else {
          return null;
        }
      });
    } else {
      return [];
    }
  }, [accessModules]);

  const reportListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          [
            "report",
            "staff report"
          ].includes(row.px_module.name.toLowerCase()) &&
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


  const laundryManagementListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          [
            "laundry management",
            "laundry item",
            "laundry washer",
            "laundry receiver",
            "laundry report"
          ].includes(row.px_module.name.toLowerCase()) && row.view
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

  const mainMenuListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          [
            "user",
            "bill",
            // "report",
            "salary report",
            "membership",
            "membership redeem",
            "daily report",
            "website booking",
          ].includes(row.px_module.name.toLowerCase()) &&
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
          ![
            "laundry report",
            "salary report",
            "laundry receiver",
            "laundry management",
            "laundry item",
            "laundry washer",
            "home page",
            "newsletter",
            "blog",
            "city",
            "state",
            "seo",
            "coupon",
            "user",
            "bill",
            "report",
            "staff report",
            "sales report",
            "membership",
            "membership redeem",
            "daily report",
            "website booking",
            "send courier",
            "receive courier"
          ].includes(row.px_module.name.toLowerCase()) &&
          row.view
        ) {
          return row;
        } else {
          return null;
        }
      });
    }
  }, [accessModules]);

  const subMenuWebListArray = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      return accessModules?.filter((row) => {
        if (
          [
            "home page",
            "newsletter",
            "blog",
            "coupon",
            "seo",
            "city",
            "state",
          ].includes(row.px_module.name.toLowerCase()) &&
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

  const logoutClickHandler = async () => {
    try {
      dispatch(startLoading());
      const response = await logout({ id: id });
      if (response && response.success) {
        logoutHandler();
      } else {
        showToast(response.message || response.messageCode, false);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      dispatch(stopLoading());
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

          {/* <Accordion
            expanded={expanded === "panel-barcode"}
            onChange={handleChange("panel-barcode")}
            className="menu-list"
            onClick={() => navigate("/barcode")}
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel-barcode-content"
              id="panel-barcode-header"
            >
              <Typography>
                <FiSquare /> Barcode
              </Typography>
            </AccordionSummary>
          </Accordion> */}

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
                      className={`sub-menu-link ${activeTab === item?.px_module?.path && "active"
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

          {subMenuWebListArray?.length > 0 && (
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              className="menu-list"
            >
              <AccordionSummary
                className="menu-title"
                expandIcon={<FiChevronRight />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography>
                  <FiGrid /> Web Master
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="sub-menu-list">
                {subMenuWebListArray?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      className={`sub-menu-link ${activeTab === item?.px_module?.path && "active"
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
          {laundryManagementListArray?.length > 0 && (
            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
              className="menu-list"
            >
              <AccordionSummary
                className="menu-title"
                expandIcon={<FiChevronRight />}
                aria-controls="panel5bh-content"
                id="panel5bh-header"
              >
                <Typography>
                  <FiGrid /> Laundry Management
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="sub-menu-list">
                {laundryManagementListArray?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      className={`sub-menu-link ${activeTab === item?.px_module?.path && "active"
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
          {courierMenuListArray?.length > 0 && (
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
              className="menu-list"
            >
              <AccordionSummary
                className="menu-title"
                expandIcon={<FiChevronRight />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography>
                  <FaTruckRampBox /> Courier
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="sub-menu-list">
                {courierMenuListArray?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      className={`sub-menu-link ${activeTab === item?.px_module?.path && "active"
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
          {reportListArray?.length > 0 && (
            <Accordion
              expanded={expanded === "panel6"}
              onChange={handleChange("panel6")}
              className="menu-list"
            >
              <AccordionSummary
                className="menu-title"
                expandIcon={<FiChevronRight />}
                aria-controls="panel6bh-content"
                id="panel6bh-header"
              >
                <Typography>
                  <FaTruckRampBox /> Reports
                </Typography>
              </AccordionSummary>
              {isAdmin ?
                <AccordionDetails className="sub-menu-list">
                  <Box
                    // key={index}
                    className={`sub-menu-link ${activeTab === "staff report" && "active"
                      }`}
                    onClick={() =>
                      navigate('/staff-report', {
                        state: {
                          add: true,
                          edit: true,
                          delete: true,
                          view: true,
                        },
                      })
                    }
                  >
                    <Typography>
                      <FiSquare />
                      Staff Report
                    </Typography>
                  </Box>
                  <Box
                    // key={index}
                    className={`sub-menu-link ${activeTab === "sales report" && "active"
                      }`}
                    onClick={() =>
                      navigate('/sales-report', {
                        state: {
                          add: true,
                          edit: true,
                          delete: true,
                          view: true,
                        },
                      })
                    }
                  >
                    <Typography>
                      <FiSquare />
                      Sales Report
                    </Typography>
                  </Box>
                </AccordionDetails>
                :
                <AccordionDetails className="sub-menu-list">
                  {reportListArray?.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        className={`sub-menu-link ${activeTab === item?.px_module?.path && "active"
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
                    )
                  })}
                </AccordionDetails>
              }
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

        <div>
          <Accordion
            expanded={expanded === "panel7"}
            onChange={handleChange("panel7")}
            className="menu-list"
            onClick={() => {
              window.location.reload();
            }}
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography>
                <FiRepeat /> Hard Refresh
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === "panel8"}
            onChange={handleChange("panel8")}
            className="menu-list"
            onClick={logoutClickHandler}
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
    </>
  );
};

export default Sidebar;
