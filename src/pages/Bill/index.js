import React from "react";
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
import { FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useBill } from "./hook/useBill";

const Bill = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchBillHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useBill();

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
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Bill No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell>Payment Type</TableCell>
                  <TableCell>Grand Total</TableCell>
                  {(rights.edit || rights.delete) && (
                    <TableCell>Action</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length ? (
                  visibleRows.map((row) => {
                    return (
                      <TableRow key={"bill_" + row.id}>
                        <TableCell align="left">{(index += 1)}</TableCell>
                        <TableCell align="left">{row.billNo}</TableCell>
                        <TableCell align="left">
                          {row.createdAt.slice(0, 10)}
                        </TableCell>
                        <TableCell align="left">
                          {row.px_customer.name}
                        </TableCell>
                        <TableCell align="left">{row.px_staff.name}</TableCell>
                        <TableCell align="left">
                          {row.px_payment_type.name}
                        </TableCell>
                        <TableCell align="left">{row.grandTotal}</TableCell>
                        {(rights.edit || rights.delete) && (
                          <TableCell>
                            <Box className="table-action-btn">
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
          title="payment type"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default Bill;
