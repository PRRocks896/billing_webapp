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
import { useServiceCategory } from "./hook/useServicecategory";
import { useSelector } from "react-redux";

const ServiceCategory = () => {
  useServiceCategory();
  const serviceSategories = useSelector((state) => state.serviceCategory.data);
  console.log("service category page", serviceSategories);

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
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - serviceSategories.length)
      : 0;

  const visibleRows = React.useMemo(
    () =>
      serviceSategories.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [page, rowsPerPage, serviceSategories]
  );
  // pagination code end

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  return (
    <>
      <TopBar
        btnTitle="Add Service Category"
        inputName="service-category"
        navigatePath="/add-service-category"
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
                          <TableCell>
                            <Box className="table-action-btn">
                              <Button
                                className="btn btn-primary"
                                onClick={() =>
                                  navigate("/edit-service-category")
                                }
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={serviceSategories.length}
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
          title="service category"
        />
      )}
    </>
  );
};

export default ServiceCategory;
