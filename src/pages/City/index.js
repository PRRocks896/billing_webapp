import React, { useMemo, useState } from "react";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { useCity } from "./hook/useCity";

const City = () => {
  const {
    isDeleteModalOpen,
    deleteModalClose,
    deleteHandler,
    deleteBtnClickHandler,
    searchCityHandler,
  } = useCity();
  const navigate = useNavigate();
  const cities = useSelector((state) => state.city.data);
  console.log(cities);

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cities.length) : 0;

  const visibleRows = useMemo(
    () => cities?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, cities]
  );
  // pagination code end

  return (
    <>
      <TopBar
        btnTitle={"Add City"}
        inputName="city"
        navigatePath="/add-city"
        callAPI={searchCityHandler}
      />

      {/* state listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
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
                          <TableCell align="left">
                            {row.px_state.name}
                          </TableCell>
                          <TableCell>
                            <Box className="table-action-btn">
                              <Button
                                className="btn btn-primary"
                                onClick={() => navigate(`/edit-city/${row.id}`)}
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
                      No City Found
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
            count={cities.length}
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
          title="city"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default City;
