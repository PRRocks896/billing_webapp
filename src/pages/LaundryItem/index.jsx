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
import Switch from "@mui/material/Switch";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

import ConfirmationModal from "../../components/ConfirmationModal";
import TopBar from "../../components/TopBar";
import useLaundryItem from "./hook/useLaundryItem";



const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", 
    },
};

const Laundryitem = () => {
    const {
        page,
        count,
        rights,
        isAdmin,
        visibleRows,
        isDeleteModalOpen,
        deleteLaundryItemHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchLaundryItemHandler,
    } = useLaundryItem();
    const navigate = useNavigate();
    let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle="Add Laundry Item"
                inputName="Laundry Item"
                navigatePath="/add-laundry-item"
                callAPI={searchLaundryItemHandler}
                addPermission={rights.add}
            />
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Name</TableCell>
                                {rights.edit && <TableCell>Status</TableCell>}
                                {isAdmin && <TableCell>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows?.length ? (
                                visibleRows?.map((row) => {
                                    return (
                                        <TableRow key={"itemName" + row?.id}>
                                            <TableCell align="left">{(index += 1)}</TableCell>
                                            <TableCell>{row?.itemName}</TableCell>
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
                                                    {/* {(rights.edit || rights.delete) && ( */}
                                                    <Box className="table-action-btn">
                                                        {rights.edit && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() => navigate(`/edit-laundry-item/${row.id}`)}
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
                                        No Advance Found
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
                    title="laundry item"
                    deleteHandler={deleteLaundryItemHandler}
                />
            )}
        </>
    );
}

export default Laundryitem;
