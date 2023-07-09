import React, { useState } from "react";
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
} from "@mui/material";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const users = [
  {
    id: 1,
    first_name: "krushag",
    last_name: "rathod",
    username: "RK8998",
    branch: "Branch 1",
    role: "user",
    email: "kushang@gmail.com",
    phone: 9879854706,
    address: "B/302 Nilkanth apt, near kantareshwar temple, katargam, surat-4",
  },
  {
    id: 2,
    first_name: "krushag",
    last_name: "rathod",
    username: "RK8998",
    branch: "Branch 1",
    role: "user",
    email: "kushang@gmail.com",
    phone: 9879854706,
    address: "B/302 Nilkanth apt, near kantareshwar temple, katargam, surat-4",
  },
  {
    id: 3,
    first_name: "krushag",
    last_name: "rathod",
    username: "RK8998",
    branch: "Branch 1",
    role: "user",
    email: "kushang@gmail.com",
    phone: 9879854706,
    address: "B/302 Nilkanth apt, near kantareshwar temple, katargam, surat-4",
  },
  {
    id: 4,
    first_name: "krushag",
    last_name: "rathod",
    username: "RK8998",
    branch: "Branch 1",
    role: "user",
    email: "kushang@gmail.com",
    phone: 9879854706,
    address: "B/302 Nilkanth apt, near kantareshwar temple, katargam, surat-4",
  },
  {
    id: 5,
    first_name: "krushag",
    last_name: "rathod",
    username: "RK8998",
    branch: "Branch 1",
    role: "user",
    email: "kushang@gmail.com",
    phone: 9879854706,
    address: "B/302 Nilkanth apt, near kantareshwar temple, katargam, surat-4",
  },
];

const User = () => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleRows = React.useMemo(
    () => users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );
  // pagination code end

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  return (
    <>
      <TopBar btnTitle="Add User" inputName="user" navigatePath="/add-user" />

      {/* service category listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length ? (
                  visibleRows.map((row, index) => {
                    return (
                      <>
                        <TableRow key={row.id}>
                          <TableCell align="left">
                            {row.first_name + " " + row.last_name}
                          </TableCell>
                          <TableCell align="left">{row.username}</TableCell>
                          <TableCell align="left">{row.branch}</TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">{row.phone}</TableCell>
                          <TableCell align="left" className="exclude-wrap">
                            {row.address}
                          </TableCell>

                          <TableCell align="left">
                            <Box className="table-action-btn">
                              <Button
                                className="btn btn-primary"
                                onClick={() => navigate("/edit-user")}
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
            rowsPerPageOptions={10}
            component="div"
            count={users.length}
            rowsPerPage={10}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          deleteModalClose={deleteModalClose}
          title="user"
        />
      )}
    </>
  );
};

export default User;
