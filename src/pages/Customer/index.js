import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomer } from "./hook/useCustomer";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen",
  },
};

const Customer = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchCustomerHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  } = useCustomer();
  const navigate = useNavigate();
  let index = page * 10;

  const location = useLocation();
  const permisson = location.state;

  return (
    <>
      <TopBar
        btnTitle="Add Customer"
        inputName="customer"
        navigatePath="/add-customer"
        callAPI={searchCustomerHandler}
        addPermission={permisson.add}
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
                  {(!permisson.edit || permisson.delete) && (
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
                          <TableCell align="left">{row.phoneNumber}</TableCell>
                          <TableCell align="left">{row.gender}</TableCell>
                          <TableCell align="left">
                            {permisson.edit ? (
                              <Switch
                                style={switchStyles}
                                checked={row.isActive}
                                onChange={(e) => changeStatusHandler(e, row.id)}
                              />
                            ) : (
                              <Switch
                                style={switchStyles}
                                checked={row.isActive}
                                disabled
                              />
                            )}
                          </TableCell>
                          {(permisson.edit || permisson.delete) && (
                            <TableCell align="left">
                              <Box className="table-action-btn">
                                {permisson.edit && (
                                  <Button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      navigate(`/edit-customer/${row.id}`)
                                    }
                                  >
                                    <FiEdit3 size={15} />
                                  </Button>
                                )}
                                {permisson.delete && (
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
                    <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                      No customers Found
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
          title="customer"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default Customer;
