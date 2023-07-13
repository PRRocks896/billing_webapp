import React from "react";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
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
import { useModule } from "./hook/useModule";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const Module = () => {
  const navigate = useNavigate();
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchModuleHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useModule();

  let index = page * 10;
  return (
    <>
      <TopBar
        btnTitle={"Add Module"}
        inputName="module"
        navigatePath="/add-module"
        callAPI={searchModuleHandler}
        addPermission={rights.add}
      />

      {/* state listing */}
      <Box className="card">
        <Box className="">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Module</TableCell>
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
                      <TableRow key={index}>
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
                                    navigate(`/edit-module/${row.id}`)
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
                      No Modules Found
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

      {/* {isDeleteModalOpen && ( */}
      <ConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        title="state"
        deleteHandler={deleteHandler}
      />
      {/* )} */}
    </>
  );
};

export default Module;
