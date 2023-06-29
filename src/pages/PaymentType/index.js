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

const paymentType = [
  { id: 1, pType: "payment type" },
  { id: 2, pType: "payment type" },
  { id: 3, pType: "payment type" },
  { id: 4, pType: "payment type" },
  { id: 5, pType: "payment type" },
  { id: 6, pType: "payment type" },
  { id: 7, pType: "payment type" },
  { id: 8, pType: "payment type" },
  { id: 9, pType: "payment type" },
  { id: 10, pType: "payment type" },
  { id: 11, pType: "payment type" },
];

const PaymentType = () => {
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - paymentType.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      paymentType.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );
  // pagination code end

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  return (
    <>
      <TopBar
        btnTitle="Add Payment Type"
        inputName="payment-type"
        navigatePath="/add-payment-type"
      />

      {/* payment type listing */}
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
                          <TableCell align="left">{row.pType}</TableCell>
                          <TableCell>
                            <Box className="table-action-btn">
                              <Button className="btn btn-primary">
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
                      No PaymentType Found
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
            count={paymentType.length}
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
          title="payment type"
        />
      )}
    </>
  );
};

export default PaymentType;
