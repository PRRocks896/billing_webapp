import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CloseCircle } from "iconsax-reactjs";

import { getBranch } from "service/user";

type MarkAttendanceModalProps = {
    isOpen: boolean;
    staff: any;
    onClose: () => void;
    onSubmit: (data: { branchID: number | null; dateTime: Date }) => void;
};

const MarkAttendanceModal = ({ isOpen, staff, onClose, onSubmit }: MarkAttendanceModalProps) => {
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [branch, setBranch] = useState<any>(null);
    const [dateTime, setDateTime] = useState<Date | null>(new Date());

    // Reset state and load branches when modal opens
    useEffect(() => {
        if (!isOpen) return;
        setDateTime(new Date());
        setBranch(null);
        (async () => {
            try {
                const response: any = await getBranch({ isActive: true, isDeleted: false });
                const branches = (response?.data ?? []).filter(
                    (item: any) => item?.px_role?.name?.toLowerCase() === 'branch'
                );
                setBranchOptions(branches);
                setBranch(branches.find((item: any) => item.id === staff?.userID) || null);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [isOpen, staff]);

    const handleSubmit = () => {
        if (!dateTime) return;
        onSubmit({ branchID: branch?.id ?? null, dateTime });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ p: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
                    <Typography variant="h4">Mark Attendance</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseCircle />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>
            <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                <Stack spacing={3} sx={{ pt: 1 }}>
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={branchOptions}
                        getOptionLabel={(option: any) => option.lastName || option.branchName || ""}
                        isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                        value={branch}
                        onChange={(_, value) => setBranch(value)}
                        renderInput={(params) => <TextField {...params} label="Branch" />}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Date & Time"
                            format="dd/MM/yyyy hh:mm a"
                            value={dateTime}
                            onChange={(val: Date | null) => setDateTime(val)}
                            slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                    </LocalizationProvider>
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!dateTime || isNaN(dateTime.getTime())}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MarkAttendanceModal;
