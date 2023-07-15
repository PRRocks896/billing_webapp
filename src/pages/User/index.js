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
import { useUser } from "./hook/useUser";
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
    rights,
  } = useUser();
  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle="Add User"
        inputName="user"
        navigatePath="/add-user"
        callAPI={searchUserHandler}
        addPermission={rights.add}
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
                  {rights.edit && <TableCell>Status</TableCell>}
                  {(rights.edit || rights.delete) && (
                    <TableCell>Action</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length ? (
                  visibleRows.map((row) => {
                    return (
                      <TableRow key={"user_" + row.id}>
                        <TableCell align="left">{(index += 1)}</TableCell>
                        <TableCell align="left">
                          {row.firstName + " " + row.lastName}
                        </TableCell>
                        <TableCell align="left">{row.userName}</TableCell>
                        <TableCell align="left">{row.branchName}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.phoneNumber}</TableCell>

                        {rights.edit && (
                          <TableCell>
                            <Switch
                              style={switchStyles}
                              checked={row.isActive}
                              onChange={(e) => changeStatusHandler(e, row.id)}
                            />
                          </TableCell>
                        )}

                        {(rights.edit || rights.delete) && (
                          <TableCell align="left">
                            <Box className="table-action-btn">
                              {rights.edit && (
                                <Button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    navigate(`/edit-user/${row.id}`)
                                  }
                                >
                                  <FiEdit3 size={15} />
                                </Button>
                              )}
                              {rights.delete && (
                                <Button
                                  className="btn btn-primary"
                                  onClick={deleteBtnClickHandler.bind(
                                    null,
                                    row.id
                                  )}
                                >
                                  <FiTrash2 size={15} />
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
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
            rowsPerPageOptions={[10]}
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
