import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ActivityCard from "../../components/ActivityCard";
import { PiUsersThree } from "react-icons/pi";
import { FaRegHandshake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { useHome } from "./hook/useHome";
import { TbFileInvoice } from "react-icons/tb";

const Home = () => {
  const { details } = useHome();

  return (
    <>
      <Box className="card">
        {/* activity card */}
        <Box className="activity-card-wrapper mb-24">
          <Grid container spacing={3}>
            <ActivityCard
              ActivityTitle={"Customer"}
              ActivityNumber={details?.counts?.customerCount}
              ActivityIcon={<PiUsersThree />}
              path="add-customer"
            />
            <ActivityCard
              ActivityTitle={"Staff"}
              ActivityNumber={details?.counts?.staffCount}
              ActivityIcon={<FaRegHandshake />}
              path="add-staff"
            />
            <ActivityCard
              ActivityTitle={"Service"}
              ActivityNumber={details?.counts?.serviceCount}
              ActivityIcon={<SlSettings />}
              path="add-service"
            />
            <ActivityCard
              ActivityTitle={"Bill"}
              ActivityNumber={details?.counts?.billCount}
              ActivityIcon={<TbFileInvoice />}
              path="create-bill"
            />
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;
