import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2, FiPrinter } from "react-icons/fi";
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

import useMembershipHooks from "./hook/useMembership.hook";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen", // Customize the track color when checked
    },
};

const MembershipPlan = () => {
    const navigate = useNavigate();
    const {
        page,
        count,
        rights,
        isAdmin,
        visibleRows,
        isDeleteModalOpen,
        handlePrint,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchMembershipHandler,
    } = useMembershipHooks();

    // let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add MemberShip"}
                inputName="membership"
                navigatePath="/add-membership"
                callAPI={searchMembershipHandler}
                addPermission={rights.add}
            />

            {/* state listing */}
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Bill No</TableCell>
                                <TableCell>Branch Name</TableCell>
                                <TableCell>Customer Name</TableCell>
                                {isAdmin &&
                                    <TableCell>Phone No</TableCell>
                                }
                                <TableCell>Plan</TableCell>
                                <TableCell>Minutes</TableCell>
                                <TableCell>Paid By</TableCell>
                                <TableCell>Manager</TableCell>
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
                                            <TableCell align="left">{row.billNo}</TableCell>
                                            <TableCell align="left">{row?.px_user?.branchName}</TableCell>
                                            <TableCell align="left">{row?.px_customer?.name}</TableCell>
                                            {isAdmin &&
                                                <TableCell align="left">{row?.px_customer?.phoneNumber}</TableCell>
                                            }
                                            <TableCell align="left">{row?.px_membership_plan?.planName}</TableCell>
                                            <TableCell align="left">{row?.minutes}</TableCell>
                                            <TableCell align="left">{row?.px_payment_type?.name}</TableCell>
                                            <TableCell align="left">{row.managerName}</TableCell>
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
                                                                    navigate(`/edit-membership/${row.id}`)
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
                                                        <Button
                                                            className="btn btn-primary"
                                                            onClick={() => handlePrint(row.id)}
                                                        >
                                                            <FiPrinter size={15} />
                                                        </Button>
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
                                        No Membership Found
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
                title="Membership"
                deleteHandler={deleteHandler}
            />
        </>
    )
}

export default MembershipPlan;