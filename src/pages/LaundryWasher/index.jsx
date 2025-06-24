import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { FiEdit3, FiTrash2 } from "react-icons/fi";
import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useLaundryWasher } from "./hook/useLaundryWasher";
import { useNavigate } from "react-router-dom";

const switchStyles = {
  color: "var(--color-black)",
  "&.MuiChecked": {
    color: "green",
  },
  "&.MuiChecked + .MuiSwitchTrack": {
    backgroundColor: "lightgreen", 
  },
};

const LaundryWasher = () => {
  const {
    isAdmin,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchLaundryWasherHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  } = useLaundryWasher();

  const navigate = useNavigate();
  let index = page * 10;

  return (
    <>
      <TopBar
        btnTitle={"Add Laundry Washer"}
        inputName="Laundry Washer"
        navigatePath="/add-laundry-washer"
        callAPI={searchLaundryWasherHandler}
        addPermission={rights.add}
      />

      {/* LaundryWasher listing */}
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                {isAdmin &&
                  <TableCell>Phone No.</TableCell>
                }
                 <TableCell>Address</TableCell>
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
                    <TableRow key={"laundryWasher" + row.id}>
                      <TableCell width={25}>{(index += 1)}</TableCell>
                      <TableCell width={200}>{row.name}</TableCell>
                      {isAdmin &&
                        <TableCell width={100}>{row.phoneNumber}</TableCell>
                      }
                      <TableCell width={125}>{row.address}</TableCell>
                      {rights.edit && (
                        <TableCell width={50}>
                          <Switch
                            style={switchStyles}
                            checked={row.isActive}
                            onChange={(e) => changeStatusHandler(e, row.id)}
                          />
                        </TableCell>
                      )}
                      {(rights.edit || rights.delete) && (
                        <TableCell width={50}>
                          <Box className="table-action-btn">
                          
                            {rights.edit && (
                              <Button
                                className="btn btn-primary"
                                onClick={() =>
                                  navigate(`/edit-laundry-washer/${row.id}`)
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
          title="laundryWasher"
          deleteHandler={deleteHandler}
        />
      )}
    </>
  );
};

export default LaundryWasher;
