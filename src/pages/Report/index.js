import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const Report = () => {
  return (
    <>
      {/* state listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Bill No</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left">1</TableCell>
                  <TableCell align="left">19/07/2023</TableCell>
                  <TableCell align="left">Manikonda</TableCell>
                  <TableCell align="left">CustomerName-4547851252</TableCell>
                  <TableCell align="left">G0002</TableCell>
                  <TableCell align="left">service1</TableCell>
                  <TableCell align="left">1</TableCell>
                  <TableCell align="left">100</TableCell>
                  <TableCell align="left">100</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography>Grand Total : 100</Typography>
        </Box>
      </Box>
    </>
  );
};

export default Report;
