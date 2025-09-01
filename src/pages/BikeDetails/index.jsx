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

// import { FiEdit3, FiTrash2, FiEye } from "react-icons/fi";
import TopBar from "../../components/TopBar";
// import ConfirmationModal from "../../components/ConfirmationModal";
// import { useStaff } from "./hook/useStaff";
import { useNavigate } from "react-router-dom";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const BikeDetails = () => {
    //   const {
    //     isAdmin,
    //     isDeleteModalOpen,
    //     setIsDeleteModalOpen,
    //     deleteHandler,
    //     deleteBtnClickHandler,
    //     searchStaffHandler,
    //     changeStatusHandler,
    //     page,
    //     handleChangePage,
    //     visibleRows,
    //     count,
    //     rights,
    //   } = useStaff();

    const navigate = useNavigate();
    //   let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add Bike Details"}
                inputName="staff"
                navigatePath="/bike-details"
            // callAPI={searchStaffHandler}
            // addPermission={rights.add}
            />

            {/* staff listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Bike Owner Name</TableCell>
                                <TableCell>City Name</TableCell>
                                <TableCell>Bike Name</TableCell>
                                <TableCell>Register Number</TableCell>
                                <TableCell>Register Date</TableCell>
                                <TableCell>Renew Date</TableCell>
                                <TableCell>RC Book</TableCell>
                                <TableCell>Insurance Number</TableCell>
                                <TableCell>Insurance Date</TableCell>
                                <TableCell>Insurance Renew Date</TableCell>
                                <TableCell>Insurance Doc</TableCell>
                                <TableCell>Status</TableCell>

                                <TableCell>Action</TableCell>

                            </TableRow>
                        </TableHead>

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                //   count={count}
                //   rowsPerPage={10}
                //   page={page}
                //   onPageChange={handleChangePage}
                />
            </Box>

            {/* {isDeleteModalOpen && (
        <ConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          title="staff"
          deleteHandler={deleteHandler}
        />
      )} */}
        </>
    );
};

export default BikeDetails;
