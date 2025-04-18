import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "./hook/useCustomer";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.MuiChecked + .MuiSwitchTrack": {
    backgroundColor: "lightgreen",
  },
};

const Customer = () => {
  const {
    branchList,
    isAdmin,
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
    rights,
    setSelectedBranch,
    downloadCustomer
  } = useCustomer();
  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      {isAdmin ?
        <>
        <Box className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                id="userID"
                disablePortal
                multiple
                // isOptionEqualToValue={(option, value) => option?.id === value}
                getOptionLabel={(option) => option.branchName ? option.branchName : ''}
                options={branchList || []}
                // value={branchList?.find((option) => option.id === selectedBranch) ?? ''}
                onChange={(_event, value) => {
                  if (value) {
                    setSelectedBranch(value)
                  } else {
                    setSelectedBranch(null);
                  }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.branchName}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button fullWidth className="btn btn-tertiary" onClick={downloadCustomer}>Export</Button>
            </Grid>
          </Grid>
        </Box>
        <br/>
        </>
        : null
      }
      <TopBar
        btnTitle="Add Customer"
        inputName="customer"
        navigatePath="/add-customer"
        callAPI={searchCustomerHandler}
        addPermission={rights.add}
      />

      {/* customer listing */}
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                {isAdmin &&
                  <TableCell>OTP</TableCell>
                }
                <TableCell>DOB</TableCell>
                <TableCell>Gender</TableCell>
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
                    <TableRow key={"customer_" + row.id}>
                      <TableCell align="left">{(index += 1)}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.phoneNumber}</TableCell>
                      {isAdmin &&
                        <TableCell align="left">{row?.otp || 'N/A'}</TableCell>
                      }
                      <TableCell align="left">{row.dob || 'N/A'}</TableCell>
                      <TableCell align="left">{row.gender}</TableCell>
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
                                  navigate(`/edit-customer/${row.id}`)
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
