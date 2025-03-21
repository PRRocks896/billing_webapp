import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import useNewsLetterHooks from "./hook/userNewsLetter";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.MuiChecked + .MuiSwitchTrack": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const NewsLetter = () => {
  const {
    page,
    count,
    rights,
    visibleRows,
    handleChangePage,
    searchNewsLetterHandler,
  } = useNewsLetterHooks();
  const navigate = useNavigate();
  let index = page * 10;
  return (
    <>
      <TopBar
        btnTitle="Add News Letter"
        inputName="News Letter"
        navigatePath="/add-newsletter"
        callAPI={searchNewsLetterHandler}
        addPermission={false}
      />
      {/* payment type listing */}
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length ? (
                visibleRows.map((row) => {
                  return (
                    <TableRow key={"payment_" + row.id}>
                      <TableCell align="left">{(index += 1)}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                    No Payment Type Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={count}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Box>
    </>
  );
};

export default NewsLetter;
