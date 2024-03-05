import { Autocomplete, Button, Box, Grid, TextField } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

const Report = () => {
  const {
    roleId,
    dateRange,
    branchOptions,
    paymentList,
    
    // branch,
    
    fetchReportDate,
    handleDateChange,
    handleBranchChange,
    handlePaymentChange,
  } = useReport();

  return (
    <>
      <Box className="card">
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
