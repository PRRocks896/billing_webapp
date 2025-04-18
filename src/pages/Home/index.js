import React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ActivityCard from "../../components/ActivityCard";
import TextField from "@mui/material/TextField";
import { PiUsersThree } from "react-icons/pi";
import { FaRegHandshake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { useHome } from "./hook/useHome";
import { TbFileInvoice } from "react-icons/tb";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";

import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

const Home = () => {
  const {
    billList,
    isAdmin,
    details,
    dateRange,
    branchOptions,
    handleDateChange,
    fetchDailyReport,
    handleBranchChange
  } = useHome();

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
      <br/>
      {isAdmin &&
        <Box className="card">
          <Box className="activity-card-wrapper mb-24">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <DateRangePicker value={dateRange} onChange={handleDateChange} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  freeSolo
                  size="small"
                  disablePortal
                  multiple
                  id="Branch"
                  options={branchOptions || []}
                  getOptionLabel={(option) => option.label}
                  // value={branch}
                  onChange={(event, newValue) => handleBranchChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Branch" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button className="btn btn-tertiary" onClick={fetchDailyReport}>Search</Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <br/>
              <TableContainer className="table-wrapper">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Branch Name</TableCell>
                      <TableCell>Total Customer</TableCell>
                      <TableCell>Cash Sales</TableCell>
                      <TableCell>UPI Sales</TableCell>
                      <TableCell>Card Sales</TableCell>
                      <TableCell>Total Sales</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billList && billList.map((bill, index) => (
                      <TableRow key={"bill_report" + index}>
                        <TableCell>{(index + 1)}</TableCell>
                        <TableCell>{bill?.user?.lastName}</TableCell>
                        <TableCell>{bill?.totalCustomer}</TableCell>
                        <TableCell>{bill?.totalCash}/-</TableCell>
                        <TableCell>{bill?.totalUPI}/-</TableCell>
                        <TableCell>{bill?.totalCard}/-</TableCell>
                        <TableCell>{(bill?.totalCash) + (bill?.totalUPI) + (bill?.totalCard)}/-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Grid>
          </Box>
        </Box>
      }
    </>
  );
};

export default Home;
