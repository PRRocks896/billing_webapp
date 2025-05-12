import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import useHomePageHook from "./hook/useHomePage.hook";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const HomePage = () => {
    const navigate = useNavigate();
    const {
        page,
        count,
        rights,
        visibleRows,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchHomePageHandler,
    } = useHomePageHook();
    
    let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add Home Page"}
                inputName="home page"
                navigatePath="/add-home-page"
                callAPI={searchHomePageHandler}
                addPermission={rights.add}
            />
            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Detail</TableCell>
                                <TableCell>Publish Date</TableCell>
                                {rights.edit && <TableCell>Status</TableCell>}
                                {(rights.edit || rights.delete) && (
                                    <TableCell>Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows?.length > 0 ? (
                                visibleRows.map((row) => {
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell>{++index}</TableCell>
                                            <TableCell>{row.title}</TableCell>
                                            <TableCell>{row.detail}</TableCell>
                                            <TableCell>
                                                {moment(row.createdAt).format("YYYY-MM-DD")}
                                            </TableCell>
                                            {rights.edit && (
                                                <TableCell>
                                                    <Switch
                                                        checked={row.isActive}
                                                        onChange={(e) =>
                                                            changeStatusHandler(e, row.id)
                                                        }
                                                        sx={switchStyles}
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
                                                                navigate(
                                                                    `/edit-home-page/${row.id}`
                                                                )
                                                            }
                                                        >
                                                            <FiEdit3 />
                                                        </Button>
                                                    )}
                                                    {rights.delete && (
                                                        <Button
                                                            className="btn btn-primary"
                                                            onClick={() =>
                                                                deleteBtnClickHandler(row.id)
                                                            }
                                                        >
                                                            <FiTrash2 />
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
                                    <TableCell colSpan={6} align="center">
                                        No data found
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
                title="Home Page"
                deleteHandler={deleteHandler}
            />
        </>
    );
}

export default HomePage;