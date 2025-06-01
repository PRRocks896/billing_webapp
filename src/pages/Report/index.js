import { Autocomplete, Button, Box, Grid, TextField, Typography, FormControl } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

const Report = () => {
  const {
    year,
    month,
    userList,
    selectedUser,
    setSelectedUser,
    roleId,
    dateRange,
    gstDateRange,
    managerDateRange,
    managerList,
    companyOptions,
    paymentList,
    serviceList,
    // selectedService,
    setYear,
    setMonth,
    fetchUserList,
    fetchReportDate,
    handleDateChange,
    handleBranchChange,
    handlePaymentChange,
    fetchGstReportData,
    handleGstDateChange,
    handleGstPaymentChange,
    fetchManagerReportData,
    handleManagerDateChange,
    handleManagerChange,
    setSelectedService,
    fetchAttendanceReportData
  } = useReport();

  return (
    <>
      <Box className="card">
        <Typography variant="h5">Sales Report</Typography>
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <DateRangePicker value={dateRange} onChange={handleDateChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            {roleId === 1 && (
              <>
                <Autocomplete
                  freeSolo
                  size="small"
                  disablePortal
                  // multiple
                  id="Comapny"
                  options={companyOptions || []}
                  getOptionLabel={(option) => option.label}
                  // value={branch}
                  onChange={(_, newValue) => handleBranchChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Company" />
                  )}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            {roleId === 1 && (
               <Autocomplete
               freeSolo
               size="small"
               disablePortal
               multiple
               id="paymentID"
               options={paymentList || []}
               getOptionLabel={(option) => option.label}
               // value={value}
               // onBlur={onBlur}
               onChange={(event, newValue) => {
                 handlePaymentChange(newValue)
               }}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Payment Type"
                 />
               )}
             />
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button className="btn btn-tertiary" onClick={fetchReportDate}>Export</Button>
          </Grid>
        </Grid>
      </Box>
      <br/>
      <Box className="card">
        <Typography variant="h5">GST Report</Typography>
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <DateRangePicker value={gstDateRange} onChange={handleGstDateChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            {roleId === 1 && (
              <Autocomplete
                freeSolo
                size="small"
                disablePortal
                multiple
                id="paymentID"
                options={paymentList || []}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                  handleGstPaymentChange(newValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Payment Type"
                  />
                )}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button className="btn btn-tertiary" onClick={fetchGstReportData}>Export</Button>
          </Grid>
        </Grid>
      </Box>
      <br/>
      <Box className="card">
        <Typography variant="h5">Manager Report</Typography>
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <DateRangePicker value={managerDateRange} onChange={handleManagerDateChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              freeSolo
              size="small"
              disablePortal
              // multiple
              id="service"
              options={serviceList || []}
              getOptionLabel={(option) => option.label}
              // value={branch}
              onChange={(_, newValue) => {
                console.log("newValue", newValue);
                const selected = JSON.parse(JSON.stringify(newValue));
                if(selected && selected?.value) {
                  setSelectedService(selected?.value);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Service" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              freeSolo
              size="small"
              disablePortal
              // multiple
              id="manager"
              options={managerList || []}
              getOptionLabel={(option) => `${option?.nickName} (${option?.name})`}
              // value={branch}
              onChange={(_, newValue) => {
                const selected = JSON.parse(JSON.stringify(newValue));
                if(selected && selected?.id) {
                  handleManagerChange(selected?.id);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Manager" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button className="btn btn-tertiary" onClick={fetchManagerReportData}>Export</Button>
          </Grid>
        </Grid>
      </Box>
      <Box className="card">
        <Typography variant="h5">Attendance Report</Typography>
        <br/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            {roleId === 1 && (
              <Autocomplete
                freeSolo
                size="small"
                disablePortal
                // multiple
                id="Comapny"
                options={companyOptions || []}
                getOptionLabel={(option) => option.label}
                // value={branch}
                onChange={(_, newValue) => {
                  console.log("newValue", newValue);
                  handleBranchChange(newValue)
                  fetchUserList(newValue?.value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Company" />
                )}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              freeSolo
              size="small"
              disablePortal
              // multiple
              id="userID"
              options={userList || []}
              getOptionLabel={(option) => option.label}
              // value={branch}
              onChange={(_, newValue) => {
                const selected = JSON.parse(JSON.stringify(newValue));
                if(selected && selected?.value) {
                  setSelectedUser(selected?.value);
                } else {
                  setSelectedUser(null);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="User" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              freeSolo
              size="small"
              disablePortal
              // multiple
              id="year"
              options={[...Array(10)].map((_, index) => new Date().getFullYear() - index) || []}
              getOptionLabel={(option) => option}
              value={year}
              onChange={(_, newValue) => {
                setYear(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Year" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              freeSolo
              size="small"
              disablePortal
              // multiple
              id="month"
              options={[...Array(12)].map((_, index) => (new Date('01-01-2025').getMonth() + 1) + index) || []}
              getOptionLabel={(option) => option}
              value={month}
              onChange={(_, newValue) => {
                setMonth(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Month" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button className="btn btn-tertiary" onClick={() => fetchAttendanceReportData()}>Export</Button>
          </Grid>
        </Grid>
      </Box>
      {/* <Box marginTop={2}>
        {pdfData ? (
          <iframe
            title="PDF Viewer"
            src={pdfData}
            width="100%"
            style={{ height: "calc(100vh - 100px)" }}
          />
        ) : (
          <Box className="card">
            <Typography>No Report Found</Typography>
          </Box>
        )}
      </Box> */}
    </>
  );
};

export default Report;
