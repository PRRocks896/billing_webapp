import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { FiChevronRight, FiLogOut, FiGrid, FiSquare, FiRepeat } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutHandler, showToast } from "../utils/helper";
import { logout } from "../service/login";
import { startLoading, stopLoading } from "../redux/loader";

const Sidebar = () => {
  let panelNo = 3;
  const { accessModules, id } = useSelector((state) => state.loggedInUser);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
          ["user", "bill", "report", "membership", "membership redeem", 'daily report', 'website booking'].includes(
            row.px_module.name.toLowerCase()
          ) &&
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
          !["newsletter", "blog","city", "state", "seo", "coupon", "user", "bill", "report",  "membership", "membership redeem", 'daily report', 'website booking'].includes(
            row.px_module.name.toLowerCase()
          ) &&
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
        if (["newsletter","blog","coupon", "seo", "city", "state"].includes(row.px_module.name.toLowerCase()) && row.view) {
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
      const response = await logout({id: id});
      if(response && response.success) {
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

        <div>
          <Accordion
            expanded={expanded === "panel7"}
            onChange={handleChange("panel7")}
            className="menu-list"
            onClick={() => {window.location.reload();}}
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
