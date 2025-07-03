import React from "react";
import { Controller } from "react-hook-form";
import moment from "moment";

import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FiEdit3, FiTrash2, FiPrinter } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useBill } from "./hook/useBill";
import { useNavigate } from "react-router-dom";

const Bill = () => {
  const {
    // date,
    // setDate,
    userList,
    // selectedUser,
    // setSelectedUser,
    control,
    reset,
    isAdmin,
    handlePrint,
    isDeleteModalOpen,
    handleChangeRowsPerPage,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchBillHandler,
    page,
    rowsPerPage,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useBill();
  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle="Create Bill"
        inputName="Bill"
        navigatePath="/create-bill"
        callAPI={searchBillHandler}
        addPermission={rights.add}
      />

      {/* payment type listing */}
      <Box className="card">
        {isAdmin && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="date"
                  control={control}
                  render={({
                    field: { onChange, value }
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Select Date"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => <TextField size="small" {...params} />}
                        format="DD-MM-YYYY"      
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="selectedUser"
                  control={control}
                  render={({
                    field: { onChange, value }
                  }) => {
                    return (
                    <Autocomplete
                      options={userList || []}
                      getOptionLabel={(option) =>
                        typeof option === 'string' ? option : option?.label || ''
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      value={value || null}
                      onChange={(_, newValue) => {
                        onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="User" />
                      )}
                    />
                  )}}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  style={{ height: "55px"}}
                  className="btn btn-tertiary"
                  onClick={() => {
                    reset({
                      date: null,
                      selectedUser: null
                    });
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        <br/>
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                {isAdmin &&
                  <TableCell>Branch Name</TableCell>
                }
                <TableCell>Bill No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Grand Total</TableCell>
                {isAdmin &&
                  <TableCell>Action</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows?.length ? (
                visibleRows?.map((row) => {
                  return (
                    <TableRow key={"bill_" + row?.id}>
                      <TableCell align="left">{(index += 1)}</TableCell>
                      {isAdmin &&
                        <TableCell>{`${row?.px_user?.firstName} - ${row?.px_user?.lastName}`}</TableCell>
                      }
                      <TableCell align="left">{row?.billNo}</TableCell>
                      <TableCell align="left">
                        {moment(row?.createdAt).format('yyyy-MM-DD hh:mm A')}
                      </TableCell>
                      <TableCell align="left">
                        {row?.px_customer?.name}
                        {isAdmin &&
                          <>
                            <br/>
                            {row?.px_customer?.phoneNumber}
                          </>
                        }
                      </TableCell>
                      <TableCell align="left">{row?.px_staff?.nickName}</TableCell>
                      <TableCell align="left">
                        {row?.px_payment_type?.name}
                      </TableCell>
                      <TableCell align="left">{row?.grandTotal}</TableCell>
                      {isAdmin &&
                      <TableCell>
                        {/* {(rights.edit || rights.delete) && ( */}
                        <Box className="table-action-btn">
                          {rights.edit && row.detail[0]?.service && (
                            <Button
                              className="btn btn-primary"
                              onClick={() => navigate(`/edit-bill/${row.id}`)}
                            >
                              <FiEdit3 size={15} />
                            </Button>
                          )}
                          {rights.delete && (
                            <Button
                              className="btn btn-primary"
                              onClick={deleteBtnClickHandler.bind(null, row.id)}
                            >
                              <FiTrash2 size={15} />
                            </Button>
                          )}
                          {isAdmin &&
                            <Button
                              className="btn btn-primary"
                              onClick={() => handlePrint(row.id)}
                            >
                              <FiPrinter size={15} />
                            </Button>
                          }
                        </Box>
                        {/* )} */}
                      </TableCell>}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                    No Bill Found
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
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          title="bill"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default Bill;
