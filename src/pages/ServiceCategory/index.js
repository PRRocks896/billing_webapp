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
import { useServiceCategory } from "./hook/useServicecategory";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.MuiChecked + .MuiSwitchTrack": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const ServiceCategory = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceCategoryHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useServiceCategory();

  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle="Add Service Category"
        inputName="service-category"
        navigatePath="/add-service-category"
        callAPI={searchServiceCategoryHandler}
        addPermission={rights.add}
      />

      {/* service category listing */}
      <Box className="card">
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
                    <TableRow key={"service_category_" + row.id}>
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
                                  navigate(`/edit-service-category/${row.id}`)
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
                    No service category found
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
          title="service category"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default ServiceCategory;
