import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useStaff } from "./hook/useStaff";
import { useNavigate } from "react-router-dom";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const Staff = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchStaffHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useStaff();

  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle={"Add Staff"}
        inputName="staff"
        navigatePath="/add-staff"
        callAPI={searchStaffHandler}
        addPermission={rights.add}
      />

      {/* staff listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
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
                      <>
                        <TableRow key={row.id}>
                          <TableCell align="left">{(index += 1)}</TableCell>
                          <TableCell align="left">{row.name}</TableCell>
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
                            <TableCell>
                              <Box className="table-action-btn">
                                {rights.edit && (
                                  <Button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      navigate(`/edit-staff/${row.id}`)
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
          title="staff"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default Staff;
