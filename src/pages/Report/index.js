import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";

const Report = () => {
  const {
    pdfData,
    dateRange,
    handleDateChange,
    roleId,
    branchOptions,
    branch,
    handleBranchChange,
  } = useReport();

  return (
    <>
      <Box className="card">
        <Grid container>
          <Grid item xs={3}>
            <DateRangePicker value={dateRange} onChange={handleDateChange} />
          </Grid>
          <Grid item xs={3}>
            {roleId === 1 && (
              <Autocomplete
                size="small"
                disablePortal
                id="Branch"
                options={branchOptions}
                value={branch}
                onChange={(event, newValue) => handleBranchChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                    // error={!!error}
                    // helperText={error?.message ? error.message : ""}
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={2}>
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
      </Box>
    </>
  );
};

export default Report;
