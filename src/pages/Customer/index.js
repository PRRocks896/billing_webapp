import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Switch,
} from "@mui/material";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const customers = [
  { id: 1, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 2, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 3, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 4, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 5, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 6, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 7, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 8, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 9, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 10, name: "Krushang rathod", number: 9879854706, gender: "Male" },
  { id: 11, name: "Krushang rathod", number: 9879854706, gender: "Male" },
];

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const Customer = () => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0;

  const visibleRows = React.useMemo(
    () => customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );
  // pagination code end

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  const editHandler = () => {
    navigate("/edit-customer");
  };

  return (
    <>
      <TopBar
        btnTitle="Add Customer"
        inputName="customer"
        navigatePath="/add-customer"
      />

      {/* customer listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Status</TableCell>
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
                          <TableCell align="left">{row.number}</TableCell>
                          <TableCell align="left">{row.gender}</TableCell>
                          <TableCell align="left">
                            <Switch style={switchStyles} />
                          </TableCell>
                          <TableCell align="left">
                            <Box className="table-action-btn">
                              <Button
                                className="btn btn-primary"
                                onClick={editHandler}
                              >
                                <FiEdit3 size={15} />
                              </Button>
                              <Button
                                className="btn btn-primary"
                                onClick={deleteModalOpen}
                              >
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
                    <TableCell sx={{ textAlign: "center" }} colSpan={5}>
                      No customers Found
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
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          deleteModalClose={deleteModalClose}
          title="customer"
        />
      )}
    </>
  );
};

export default Customer;
