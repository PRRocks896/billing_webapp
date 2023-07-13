import React from "react";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useCity } from "./hook/useCity";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "lightgreen", // Customize the track color when checked
  },
};

const City = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchCityHandler,
    changeStatusHandler,
    // ----
    page,
    handleChangePage,
    visibleRows,
    count,
  } = useCity();
  const navigate = useNavigate();
  let index = page * 10;

  const location = useLocation();
  const permisson = location.state;

  return (
    <>
      <TopBar
        btnTitle={"Add City"}
        inputName="city"
        navigatePath="/add-city"
        callAPI={searchCityHandler}
        addPermission={permisson.add}
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
                      <TableRow key={row.id}>
                        <TableCell align="left">{(index += 1)}</TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.px_state.name}</TableCell>
                        <TableCell>
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
                          <TableCell>
                            <Box className="table-action-btn">
                              {permisson.edit && (
                                <Button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    navigate(`/edit-city/${row.id}`)
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
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                      No City Found
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
          title="city"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default City;
