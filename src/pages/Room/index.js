import React from "react";
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

import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import useRoomHook from "./hook/useRoom";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const Room = () => {
    const {
        page,
        rows,
        count,
        rights,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        searchRoomHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
    } = useRoomHook();

    const navigate = useNavigate();
    let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add Room"}
                inputName="room"
                navigatePath="/add-room"
                callAPI={searchRoomHandler}
                addPermission={rights.add}
            />
            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Room Name</TableCell>
                                {/* <TableCell>Display Name</TableCell>
                                <TableCell>Bill Code</TableCell>
                                <TableCell>Cash Bill Code</TableCell> */}
                                {rights.edit && <TableCell>Status</TableCell>}
                                {(rights.edit || rights.delete) && (
                                    <TableCell>Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length ? (
                                rows.map((row) => {
                                    return (
                                        <TableRow key={"role_" + row.id}>
                                            <TableCell align="left">{(index += 1)}</TableCell>
                                            <TableCell align="left">{row.roomName}</TableCell>
                                            {/* <TableCell align="left">{row.displayName}</TableCell>
                                            <TableCell align="left">{row.billCode}</TableCell>
                                            <TableCell align="left">{row.cashBillCode}</TableCell> */}
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
                                                                onClick={() => navigate(`/edit-company/${row.id}`)}
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
                                        No Room Found
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

            <ConfirmationModal
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                title="state"
                deleteHandler={deleteHandler}
            />
        </>
    );
}

export default Room;