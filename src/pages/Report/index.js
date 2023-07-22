import { Box, Typography } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";

const Report = () => {
  const { pdfData, dateRange, handleDateChange } = useReport();

  return (
    <>
      <Box className="card">
        <DateRangePicker value={dateRange} onChange={handleDateChange} />
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
