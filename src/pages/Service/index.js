import React, { useState } from "react";
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

const service = [
  { id: 1, category: "Category", name: "service-name", amount: "300" },
  { id: 2, category: "Category", name: "service-name", amount: "300" },
  { id: 3, category: "Category", name: "service-name", amount: "300" },
  { id: 4, category: "Category", name: "service-name", amount: "300" },
  { id: 5, category: "Category", name: "service-name", amount: "300" },
  { id: 6, category: "Category", name: "service-name", amount: "300" },
  { id: 7, category: "Category", name: "service-name", amount: "300" },
  { id: 8, category: "Category", name: "service-name", amount: "300" },
  { id: 9, category: "Category", name: "service-name", amount: "300" },
  { id: 10, category: "Category", name: "service-name", amount: "300" },
  { id: 11, category: "Category", name: "service-name", amount: "300" },
];

const Service = () => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - service.length) : 0;

  const visibleRows = React.useMemo(
    () => service.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
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
                name="service-search"
                placeholder="Search Service"
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
            <Button component={"button"} className="btn btn-tertiary" onClick={() => navigate('/add-service')}>
              <FiPlus /> &nbsp; <p>Add Service</p>
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* service listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
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
                          <TableCell align="left">{row.category}</TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.amount}</TableCell>
                          <TableCell>
                            <Box className="table-action-btn">
                              <Button className="btn btn-primary">
                                <FiEdit3 />
                              </Button>
                              <Button className="btn btn-primary">
                                <FiTrash2 />
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
                      No service Found
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
            count={service.length}
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

export default Service;
