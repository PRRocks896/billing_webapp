import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ActivityCard = ({
  ActivityTitle,
  ActivityNumber,
  ActivityIcon,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Grid item xs={12} sm={6} md={6} lg={3} xxl={3}>
        <Box className="activity-card" onClick={() => navigate(path)}>
          <Box className="activity-content_1">
            <Typography variant="h6" component="h6" className="text-white">
              {ActivityTitle}
            </Typography>
            <Link className="arrow-icon">
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
