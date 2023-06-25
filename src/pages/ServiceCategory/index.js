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
  { id: 1, name: "service" },
  { id: 2, name: "service" },
  { id: 3, name: "service" },
  { id: 4, name: "service" },
  { id: 5, name: "service" },
  { id: 6, name: "service" },
  { id: 7, name: "service" },
  { id: 8, name: "service" },
  { id: 9, name: "service" },
  { id: 10, name: "service" },
  { id: 11, name: "service" },
];

const AddServiceCategory = () => {
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
                name="serviceCategory-search"
                placeholder="Search Service Category"
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
            <Button component={"button"} className="btn btn-tertiary" onClick={() => navigate('/add-service-category')}>
              <FiPlus /> &nbsp; <p>Add Service Category</p>
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* service category listing */}
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

export default AddServiceCategory;
