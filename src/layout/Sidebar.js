import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  FiChevronRight,
  FiFileText,
  FiLogOut,
  FiGrid,
  FiSquare,
} from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { IoReceiptOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutHandler } from "../utils/helper";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // sidebar menu accordion
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [activeTab, setActiveTab] = useState(location.pathname.substring(1));

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
              <Box
                className={`sub-menu-link ${
                  activeTab === "customer" && "active"
                }`}
                onClick={() => {
                  setActiveTab("customer");
                  navigate("/customer");
                }}
              >
                <Typography>
                  <FiSquare />
                  Customer
                </Typography>
              </Box>
              <Box
                className={`sub-menu-link ${activeTab === "staff" && "active"}`}
                onClick={() => {
                  setActiveTab("staff");
                  navigate("/staff");
                }}
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
                onClick={() => {
                  setActiveTab("service-category");
                  navigate("/service-category");
                }}
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
                onClick={() => {
                  setActiveTab("service");
                  navigate("/service");
                }}
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
                onClick={() => {
                  setActiveTab("payment-type");
                  navigate("/payment-type");
                }}
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
                onClick={() => {
                  setActiveTab("states");
                  navigate("/states");
                }}
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
                onClick={() => {
                  setActiveTab("cities");
                  navigate("/cities");
                }}
              >
                <Typography>
                  <FiSquare />
                  Cities
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
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
          </Accordion>
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
