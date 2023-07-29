import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

const ActivityCard = ({
  ActivityTitle,
  ActivityNumber,
  ActivityIcon,
  path,
}) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={6} lg={3} xxl={3}>
        <Box className="activity-card">
          <Box className="activity-content_1">
            <Typography variant="h6" component="h6" className="text-white">
              {ActivityTitle}
            </Typography>
            <Link className="arrow-icon" to={path}>
              <FaLongArrowAltRight />
            </Link>
          </Box>
          <Box className="activity-content_2">
            <Typography variant="span" component="span" className="text-white">
              {ActivityNumber}
            </Typography>
            <Box className="activity-icons">{ActivityIcon}</Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default ActivityCard;
