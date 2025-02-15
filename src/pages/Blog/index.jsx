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

import useBlogHooks from "./hook/useBlog.hook";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const Blog = () => {
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
        searchBlogHandler,
    } = useBlogHooks();

    let index = page * 10;


    return (
        <>
        <TopBar
                btnTitle={"Add Blog"}
                inputName="blog"
                navigatePath="/add-blog"
                callAPI={searchBlogHandler}
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
                                {/* <TableCell>Slug</TableCell> */}
                                <TableCell>Short Description</TableCell>
                                <TableCell>Publish Date</TableCell>
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
                                        <TableRow key={"membership_plan_" + row.id}>
                                            <TableCell align="left">{(index += 1)}</TableCell>
                                            <TableCell align="left" sx={{whiteSpace: 'break-spaces'}}>{row.title}</TableCell>
                                            {/* <TableCell align="left" sx={{whiteSpace: 'break-spaces'}}>{row.slug}</TableCell> */}
                                            <TableCell align="left">{row.shortDescription}</TableCell>
                                            <TableCell align="left">{moment(row.createdAt).format('DD/MM/yyyy hh:mm A')}</TableCell>
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
                                                                    navigate(`/edit-blog/${row.id}`)
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
                                        No Membership Plan Found
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
                title="Blog"
                deleteHandler={deleteHandler}
            />
        </>
    )
}

export default Blog;