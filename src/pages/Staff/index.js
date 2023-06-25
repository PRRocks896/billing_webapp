import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { FiEdit3, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const staff = [
  { id: 1, name: "Krushang rathod" },
  { id: 2, name: "Krushang rathod" },
  { id: 3, name: "Krushang rathod" },
  { id: 4, name: "Krushang rathod" },
  { id: 5, name: "Krushang rathod" },
  { id: 6, name: "Krushang rathod" },
  { id: 7, name: "Krushang rathod" },
  { id: 8, name: "Krushang rathod" },
  { id: 9, name: "Krushang rathod" },
  { id: 10, name: "Krushang rathod" },
  { id: 11, name: "Krushang rathod" },
];

const Staff = () => {
  const navigate = useNavigate();

  // pagination code start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - staff.length) : 0;

  const visibleRows = useMemo(
    () => staff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );
  // pagination code end

  return (
    <>
      {/* top page action with text */}
      <Box className="top-bar">
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            <Box className="search-box">
              <InputBase
                name="staff-search"
                placeholder="Search Staff"
                endAdornment={
                  <InputAdornment
                    position="end"
                    className="end-input-icon text-grey"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <FiSearch />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
          </Grid>

          <Grid item>
            <Button component={"button"} className="btn btn-tertiary" onClick={() => navigate('/add-staff')}>
              <FiPlus /> &nbsp; <p>Add Staff</p>
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* staff listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length ? (
                  visibleRows.map((row, index) => {
                    return (
                      <>
                        <TableRow key={row.id}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell>
                            <Box className="table-action-btn">
                              <Button className="btn btn-primary">
                                <FiEdit3 size={15} />
                              </Button>
                              <Button className="btn btn-primary">
                                <FiTrash2 size={15} />
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                      No staff Found
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <Box
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </Box>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={staff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </>
  );
};

export default Staff;
