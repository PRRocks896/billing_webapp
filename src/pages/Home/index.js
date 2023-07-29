import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ActivityCard from "../../components/ActivityCard";
import { PiUsersThree } from "react-icons/pi";
import { FaRegHandshake } from "react-icons/fa";
// import { FaRegUser } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { useHome } from "./hook/useHome";
import { TbFileInvoice } from "react-icons/tb";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import DonutChart from "../../components/DonutChart ";

// const customerData = [
//   { id: 1, name: "Customer 1", phone: 8575698421 },
//   { id: 2, name: "Customer 2", phone: 8575698421 },
//   { id: 3, name: "Customer 3", phone: 8575698421 },
//   { id: 4, name: "Customer 4", phone: 8575698421 },
//   { id: 5, name: "Customer 5", phone: 8575698421 },
// ];

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
              ActivityTitle={"User"}
              ActivityNumber={details?.counts?.userCount}
              ActivityIcon={<TbFileInvoice />}
              path="create-bill"
            />
          </Grid>
        </Box>
      </Box>

      {/* Projects */}
      {/* <Grid container marginTop={2} spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} xxl={4}>
          <Box className="card">
            <DonutChart chartData={details?.counts} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xxl={4}>
          <Box className="card">
            <Grid
              container
              spacing={2}
              className="card-title-bar"
              alignItems={"center"}
            >
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="h6"
                  className="text-black card-title"
                >
                  Customers
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={"end"}>
                <Typography
                  variant="body1"
                  component="span"
                  className="text-grey see-all"
                >
                  See All
                </Typography>
              </Grid>
            </Grid>

            <TableContainer className="table-wrapper">
              <Table className="customer-summary-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerData?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid> */}
    </>
  );
};

export default Home;
