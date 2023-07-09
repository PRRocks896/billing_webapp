import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ActivityCard from "../../components/ActivityCard";
import { PiUsersThree } from "react-icons/pi";
import { FaRegHandshake } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";

const ActivityCardArray = [
  { title: "Customer", number: 467, icon: <PiUsersThree /> },
  { title: "Staff", number: 23, icon: <FaRegHandshake /> },
  { title: "Service", number: 12, icon: <SlSettings /> },
  { title: "User", number: 78, icon: <FaRegUser size={"50px"} /> },
];
const Home = () => {
  return (
    <>
      <Box className="card">
        {/* activity card */}
        <Box className="activity-card-wrapper mb-24">
          <Grid container spacing={3}>
            {ActivityCardArray?.map((ActivityCardList, index) => (
              <ActivityCard
                key={index}
                ActivityTitle={ActivityCardList.title}
                ActivityNumber={ActivityCardList.number}
                ActivityIcon={ActivityCardList.icon}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;
