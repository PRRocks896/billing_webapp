import React from "react";
import { useNavigate } from "react-router-dom";
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

import useSeoHook from "./hook/useSeo.hook";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const SEO = () => {
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
        searchSeoHandler
    } = useSeoHook();
    return (
        <>
            <TopBar
                btnTitle={"Add SEO"}
                inputName="seo"
                navigatePath="/add-seo"
                callAPI={searchSeoHandler}
                addPermission={rights.add}
            />

            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Max Price</TableCell>
                                {rights.edit && <TableCell>Status</TableCell>}
                                {/* {(rights.edit || rights.delete) && ( */}
                                    <TableCell>Action</TableCell>
                                {/* )} */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.length ? (
                                visibleRows.map((row) => {
                                    return (
                                        <TableRow key={"membership_" + row.id}>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="left">{row.code}</TableCell>
                                            <TableCell align="left">{row.type}</TableCell>
                                            <TableCell align="left">{row.value}</TableCell>
                                            <TableCell align="left">{row.maxPrice}</TableCell>
                                            {rights.edit && (
                                                <TableCell>
                                                    <Switch
                                                        style={switchStyles}
                                                        checked={row.isActive}
                                                        onChange={(e) => changeStatusHandler(e, row.id)}
                                                    />
                                                </TableCell>
                                            )}
                                            {/* {(rights.edit || rights.delete) && ( */}
                                                <TableCell>
                                                    <Box className="table-action-btn">
                                                        {rights.edit && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(`/edit-seo/${row.id}`)
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
                                                    {row?.minutes === 0 &&
                                                        <Button
                                                            sx={{ marginTop: 2}}
                                                            className="btn btn-primary"
                                                            onClick={() =>
                                                                navigate(`/renew-plan/${row.id}/${row.customerID}`)
                                                            }
                                                        >
                                                            Renew Plan
                                                            {/* <FiEdit3 size={15} /> */}
                                                        </Button>
                                                    }
                                                </TableCell>
                                            {/* )} */}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                                        No SEO Found
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
                title="SEO"
                deleteHandler={deleteHandler}
            />
        </>
    );
}

export default SEO;