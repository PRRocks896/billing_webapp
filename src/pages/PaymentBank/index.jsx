import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

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

import TopBar from "../../components/TopBar";
import ConfirmationModal from "../../components/ConfirmationModal";

import UsePaymentBank from "./hooks/usePaymentBank";

const switchStyles = {
    color: "var(--color-black)",
    "&.MuiChecked": {
        color: "green",
    },
    "&.MuiChecked + .MuiSwitchTrack": {
        backgroundColor: "lightgreen",
    },
};

const PaymentBank = () => {
    const {
        page,
        count,
        rights,
        isAdmin,
        visibleRows,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        deleteBtnClickHandler,
        searchPaymentBankHandler,
    } = UsePaymentBank();

    const navigate = useNavigate();
    let index = page * 10;

    return (
        <>
            <TopBar
                btnTitle={"Add Payment Bank"}
                inputName="Payment Bank"
                navigatePath="/add-payment-bank"
                callAPI={searchPaymentBankHandler}
                addPermission={rights.add}
            />
            <Box className="card">
                <TableContainer className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Bank Name</TableCell>
                                <TableCell>Company</TableCell>
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
                                        <TableRow key={"paymentBank" + row.id}>
                                            <TableCell width={10}>{(index += 1)}</TableCell>
                                            <TableCell width={125}>{row.bankName}</TableCell>
                                            <TableCell width={300}>{row.px_company?.companyName}</TableCell>
                                            {rights.edit && (
                                                <TableCell width={100}>
                                                    <Switch
                                                        checked={row.isActive}
                                                        onChange={(e) => changeStatusHandler(e, row.id)}
                                                        sx={switchStyles}
                                                    />
                                                </TableCell>
                                            )}
                                            {(rights.edit || rights.delete) && (
                                                <TableCell width={100}>
                                                    <Box className="table-action-btn">
                                                        {rights.edit && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    navigate(`/edit-payment-bank/${row.id}`)
                                                                }
                                                            >
                                                                <FiEdit3 size={15} />
                                                            </Button>
                                                        )}
                                                        {rights.delete && (
                                                            <Button
                                                                className="btn btn-primary"
                                                                onClick={() => deleteBtnClickHandler(row.id)}
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
                                    <TableCell colSpan={5} align="center">
                                        No Payment Bank Found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default PaymentBank;