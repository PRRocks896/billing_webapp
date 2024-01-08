import { Autocomplete, Button, Box, Grid, TextField } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";

const Report = () => {
  const {
    dateRange,
    handleDateChange,
    roleId,
    branchOptions,
    branch,
    handleBranchChange,
    fetchReportDate
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
              <Autocomplete
                size="small"
                disablePortal
                id="Branch"
                options={branchOptions}
                value={branch}
                onChange={(event, newValue) => handleBranchChange(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Branch" />
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
