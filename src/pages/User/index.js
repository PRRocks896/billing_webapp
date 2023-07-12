import React from "react";
import {
  Box,
  Button,
  Switch,
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
import { useUser } from "./hook/useUser";
import { useLocation, useNavigate } from "react-router-dom";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const User = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchUserHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  } = useUser();
  const navigate = useNavigate();
  let index = page * 10;
  // pagination code start

  const location = useLocation();
  const permisson = location.state;
  console.log(permisson);

  return (
    <>
      <TopBar
        btnTitle="Add User"
        inputName="user"
        navigatePath="/add-user"
        callAPI={searchUserHandler}
      />

      {/* service category listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length ? (
                  visibleRows.map((row) => {
                    return (
                      <>
                        <TableRow key={index}>
                          <TableCell align="left">{(index += 1)}</TableCell>
                          <TableCell align="left">
                            {row.firstName + " " + row.lastName}
                          </TableCell>
                          <TableCell align="left">{row.userName}</TableCell>
                          <TableCell align="left">{row.branchName}</TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">{row.phoneNumber}</TableCell>
                          <TableCell>
                            <Switch
                              style={switchStyles}
                              checked={row.isActive}
                              onChange={(e) => changeStatusHandler(e, row.id)}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Box className="table-action-btn">
                              <Button
                                className="btn btn-primary"
                                onClick={() => navigate(`/edit-user/${row.id}`)}
                              >
                                <FiEdit3 size={15} />
                              </Button>
                              <Button
                                className="btn btn-primary"
                                onClick={deleteBtnClickHandler.bind(
                                  null,
                                  row.id
                                )}
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
                      No Users Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={10}
            component="div"
            count={count}
            rowsPerPage={10}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          title="user"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default User;
