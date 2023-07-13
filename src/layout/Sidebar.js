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
import { logoutHandler } from "../utils/helper";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const accessModules = useSelector(
    (state) => state.loggedInUser?.accessModules
  );

  const navigate = useNavigate();
  const location = useLocation();

  // sidebar menu accordion
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const activeTab = location.pathname.substring(1);

  const [mainMenuListArray, setMainMenuListArray] = useState([]);
  const [subMenuListArray, setSubMenuListArray] = useState([]);

  useMemo(() => {
    const mainList =
      accessModules?.length &&
      accessModules?.filter((row) => {
        if (
          row.px_module.name === "User" ||
          row.px_module.name === "Bill" ||
          row.px_module.name === "Report"
        ) {
          return row;
        }
      });
    setMainMenuListArray(mainList);

    const subList =
      accessModules?.length &&
      accessModules?.filter((row) => {
        if (
          row.px_module.name !== "User" &&
          row.px_module.name !== "Bill" &&
          row.px_module.name !== "Report"
        ) {
          return row;
        }
      });
    console.log(subList);
    setSubMenuListArray(subList);
  }, [accessModules]);

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
              {/* <Box
                className={`sub-menu-link ${
                  activeTab === "customer" && "active"
                }`}
                onClick={() => navigate("/customer")}
              >
                <Typography>
                  <FiSquare />
                  Customer
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${activeTab === "staff" && "active"}`}
                onClick={() => navigate("/staff")}
              >
                <Typography>
                  <FiSquare />
                  Staff
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "service-category" && "active"
                }`}
                onClick={() => navigate("/service-category")}
              >
                <Typography>
                  <FiSquare />
                  Service Category
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "service" && "active"
                }`}
                onClick={() => navigate("/service")}
              >
                <Typography>
                  <FiSquare />
                  Service
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "payment-type" && "active"
                }`}
                onClick={() => navigate("/payment-type")}
              >
                <Typography>
                  <FiSquare />
                  Payment Type
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "states" && "active"
                }`}
                onClick={() => navigate("/states")}
              >
                <Typography>
                  <FiSquare />
                  States
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "cities" && "active"
                }`}
                onClick={() => navigate("/cities")}
              >
                <Typography>
                  <FiSquare />
                  Cities
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${activeTab === "role" && "active"}`}
                onClick={() => navigate("/role")}
              >
                <Typography>
                  <FiSquare />
                  Roles
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${
                  activeTab === "module" && "active"
                }`}
                onClick={() => navigate("/module")}
              >
                <Typography>
                  <FiSquare />
                  Modules
                </Typography>
              </Box> */}
              {subMenuListArray?.map((item) => {
                return (
                  <Box
                    className={`sub-menu-link ${
                      activeTab === "module" && "active"
                    }`}
                    onClick={() => navigate(item.px_module.path)}
                  >
                    <Typography>
                      <FiSquare />
                      {item.px_module.name}
                    </Typography>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>

          {/* <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            className="menu-list"
            onClick={() => navigate("/create-bill")}
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography>
                <IoReceiptOutline /> Bill
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            className="menu-list"
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography>
                <FiFileText /> Reports
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
            className="menu-list"
            onClick={() => navigate("/user")}
          >
            <AccordionSummary
              className="menu-title"
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography>
                <FaRegUser /> User
              </Typography>
            </AccordionSummary>
          </Accordion> */}
          {mainMenuListArray?.map((item) => {
            return (
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                className="menu-list"
                onClick={() => {
                  navigate(item.px_module.path, {
                    state: {
                      add: item.add,
                      edit: item.edit,
                      delete: item.delete,
                      view: item.view,
                    },
                  });
                }}
              >
                <AccordionSummary
                  className="menu-title"
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography>{item.px_module.name}</Typography>
                </AccordionSummary>
              </Accordion>
            );
          })}
        </div>
        <div onClick={logoutHandler}>
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
    </>
  );
};

export default Sidebar;
