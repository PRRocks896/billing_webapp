import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { CloseCircle } from "iconsax-reactjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { getBillListPayload } from "service/bill";

type IProps = {
    open: boolean;
    customerPhone: string;
    handleClose: () => void;
}

const CustomerBillData = ({
    open,
    customerPhone,
    handleClose
}: IProps) => {
    const { user, isAdmin, isBranch, startLoading, stopLoading } = useAuth();
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        setList([]);
        if (open && user) {
            (async () => {
                try {
                    startLoading();
                    let whereCondition: any = {
                        isDeleted: false,
                        customerID: customerPhone,
                    };
                    if (isBranch) {
                        whereCondition = {
                            ...whereCondition,
                            userID: user?.id
                        }
                    }
                    const { success, message, data }: any = await getBillListPayload(whereCondition);
                    if (!success) {
                        openSnackbar({
                            open: true,
                            message,
                            variant: 'alert',
                            severity: 'error',
                            alert: { color: 'error' }
                        });
                    }
                    if (data && Array.isArray(data) && data.length > 0) {
                        setList(data);
                    } else {
                        setList([]);
                    }
                } catch (error) {
                    openSnackbar({
                        open: true,
                        message: (error as Error).message || "Something went wrong",
                        variant: "alert",
                        severity: 'error',
                        alert: { color: "error" },
                    });
                } finally {
                    stopLoading();
                }
            })();
        }
    }, [open, user, isBranch]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <DialogTitle sx={{ p: 0 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3, py: 2 }}
                >
                    <Typography variant="h4" fontWeight={600}>Previous Bill History</Typography>
                    <IconButton size="small" onClick={handleClose} aria-label="close">
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>

            {/* ── Content ────────────────────────────────────────────────── */}
            <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                {isAdmin &&
                                    <TableCell>Branch</TableCell>
                                }
                                <TableCell>Staff</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{moment(item?.createdAt).format('DD-MM-YYYY')}</TableCell>
                                    {isAdmin &&
                                        <TableCell>{item?.px_user?.lastName}</TableCell>
                                    }
                                    <TableCell>{item?.px_staff?.nickName}</TableCell>
                                    <TableCell>{item?.detail[0]?.service?.name}</TableCell>
                                    <TableCell align="right">{item?.grandTotal}/-</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomerBillData;