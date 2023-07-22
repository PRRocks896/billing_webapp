import { Box, Button } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
// import DateRangePicker from "rsuite/DateRangePicker";

const Report = () => {
  const { handleSubmit, onSubmit, pdfData } = useReport();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <DateRangePicker /> */}

        <Box className="card">
          <Button type="submit" className="btn btn-tertiary">
            Submit
          </Button>

          <Box marginTop={2}>
            {pdfData && (
              <iframe
                title="PDF Viewer"
                src={pdfData}
                width="100%"
                height="auto"
              />
              // <object
              //   width="100%"
              //   height="400"
              //   data={pdfData}
              //   type="application/pdf"
              // ></object>
            )}
          </Box>
        </Box>
      </form>
    </>
  );
};

export default Report;
