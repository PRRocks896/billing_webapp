import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const ActivityCard = ({ ActivityTitle, ActivityNumber, ActivityIcon }) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={6} lg={3} xxl={3}>
        <Box className="activity-card">
          <Box className="activity-content">
            <Typography variant="h6" component="h6" className="text-white">
              {ActivityTitle}
            </Typography>
            <Typography variant="span" component="span" className="text-white">
              {ActivityNumber}
            </Typography>
          </Box>
          <Box className="activity-icons">{ActivityIcon}</Box>
        </Box>
      </Grid>
    </>
  );
};

export default ActivityCard;
