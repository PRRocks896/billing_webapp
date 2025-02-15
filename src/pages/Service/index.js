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
import { useService } from "./hook/useService";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.MuiChecked + .MuiSwitchTrack": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const Service = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceHandler,
    changeStatusHandler,
    changeWebDisplayHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useService();
  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle="Add Service"
        inputName="service"
        navigatePath="/add-service"
        callAPI={searchServiceHandler}
        addPermission={rights.add}
      />

      {/* service listing */}
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Minutes</TableCell>
                <TableCell>Amount</TableCell>
                {rights.edit && <TableCell>Web Display</TableCell>}
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
                    <TableRow key={"service_" + row.id}>
                      <TableCell align="left">{(index += 1)}</TableCell>
                      <TableCell align="left">
                        {row.px_service_category?.name}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row?.mintues || 'N/A'}</TableCell>
                      <TableCell align="left">{row.amount}</TableCell>
                      {rights.edit && (
                        <TableCell>
                          <Switch
                            style={switchStyles}
                            checked={row.isWebDisplay}
                            onChange={(e) => changeWebDisplayHandler(e, row.id)}
                          />
                        </TableCell>
                      )}
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
                                  navigate(`/edit-service/${row.id}`)
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
                    No service Found
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
          title="service"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default Service;
