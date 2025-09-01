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

const DailyTask = () => {
   

    const navigate = useNavigate();


    return (
        <>
            <TopBar
                btnTitle={"Add Daily Task"}
                inputName="staff"
                navigatePath="/daily-task"
           
            />

            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>General Manager</TableCell>
                                <TableCell>Supervisor</TableCell>
                                <TableCell>Branch Name</TableCell>
                                <TableCell>Note</TableCell>
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
          title="daily task"
          deleteHandler={deleteHandler}
        />
      )} */}
        </>
    );
};

export default DailyTask;
