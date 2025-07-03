import React from "react";
// import moment from "moment";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import Switch from "@mui/material/Switch";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

import ConfirmationModal from "../../components/ConfirmationModal";
import TopBar from "../../components/TopBar";
import useLaundryReceiver from "./hook/useLaundryReceiver";

// const switchStyles = {
//   color: "var(--color-black)",
//   "&.MuiChecked": {
//     color: "green",
//   },
//   "&.MuiChecked + .MuiSwitchTrack": {
//     backgroundColor: "lightgreen", // Customize the track color when checked
//   },
// };

const LaundryReceiver = () => {
  const {
    page,
    count,
    rights,
    isAdmin,
    visibleRows,
    isDeleteModalOpen,
    deleteHandler,
    handleChangePage,
    // changeStatusHandler,
    setIsDeleteModalOpen,
    searchLaundryReceiverHandler,
    deleteBtnClickHandler,
  } = useLaundryReceiver();
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        btnTitle="Add Laundry Receiver"
        inputName="Laundry Receiver"
        navigatePath="/add-laundry-receiver"
        callAPI={searchLaundryReceiverHandler}
        addPermission={rights.add}
      />
      <Box className="card">
        <TableContainer className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Received Date</TableCell>
                <TableCell>Given Date</TableCell>
                <TableCell>Washer Name</TableCell>
                <TableCell>Given Qty</TableCell>
                <TableCell>Receive Qty</TableCell>
                <TableCell>Remaining Qty</TableCell>
                <TableCell>Manager</TableCell>
                {/* {rights.edit && <TableCell>Status</TableCell>} */}
                {isAdmin && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows?.length ? (
                visibleRows?.map((row, index) => {
                  return (
                    <TableRow key={"bill_" + row?.id}>
                      <TableCell align="left">{(index += 1)}</TableCell>
                      <TableCell align="left">{row?.receiveDate}</TableCell>
                      <TableCell align="left">{row?.px_laundry_management?.givenDate}</TableCell>
                      <TableCell align="left">{row?.px_laundry_management?.px_laundry_washer?.name}</TableCell>
                      <TableCell align="left">{row?.px_laundry_management?.givenQty}</TableCell>
                      <TableCell align="left">{row?.receiveQty}</TableCell>
                      <TableCell align="left">{(parseFloat(row?.px_laundry_management?.givenQty) - parseFloat(row?.receiveQty))}</TableCell>
                      <TableCell>{row?.managerData && row?.managerData[0].nickName}</TableCell>
                      {/* {rights.edit && (
                        <TableCell>
                          <Switch
                            style={switchStyles}
                            checked={row.isActive}
                            onChange={(e) => changeStatusHandler(e, row.id)}
                          />
                        </TableCell>
                      )} */}
                      {(rights.edit || rights.delete) && (
                        <TableCell>
                          {/* {(rights.edit || rights.delete) && ( */}
                          <Box className="table-action-btn">
                            {rights.edit && (
                              <Button
                                className="btn btn-primary"
                                onClick={() => navigate(`/edit-laundry-receiver/${row.id}`)}
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
                          {/* )} */}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={8}>
                    No Laundry Management Found
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

export default LaundryReceiver;
