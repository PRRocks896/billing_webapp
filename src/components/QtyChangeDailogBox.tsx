import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { CloseCircle, Hashtag, InfoCircle, Minus } from "iconsax-reactjs";

type QtyChangeDailogBoxProps = {
    open: boolean;
    title?: string;
    currentQty: number | string;
    onClose: () => void;
    handleSubmit: (value: number) => void;
};

const QtyChangeDailogBox: React.FC<QtyChangeDailogBoxProps> = ({
    open,
    title = "Remove Stock Quantity",
    currentQty,
    onClose,
    handleSubmit,
}) => {
    const [qty, setQty] = useState<string>("");
    const [error, setError] = useState<string>("");

    const maxQty = Number(currentQty) || 0;

    // Reset input and error state when dialog opens
    useEffect(() => {
        if (open) {
            setQty("");
            setError("");
        }
    }, [open]);

    const validate = (val: string): boolean => {
        if (!val || val.trim() === "") {
            setError("Quantity to remove is required.");
            return false;
        }

        const num = Number(val);

        if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
            setError("Please enter a valid positive integer quantity.");
            return false;
        }

        if (num > maxQty) {
            setError(`Quantity to remove cannot be more than current stock quantity (${maxQty}).`);
            return false;
        }

        setError("");
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQty(val);
        if (error) {
            validate(val);
        }
    };

    const onSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (validate(qty)) {
            handleSubmit(Number(qty));
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                },
            }}
            aria-labelledby="qty-change-dialog-title"
        >
            <DialogTitle id="qty-change-dialog-title" sx={{ pb: 1, pt: 2, px: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: "error.lighter",
                                color: "error.main",
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Minus size={22} />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                            {title}
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={onSubmit}>
                <DialogContent sx={{ py: 2, px: 3 }}>
                    <Stack spacing={2.5}>
                        {/* Current Available Quantity Banner */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "primary.lighter",
                                border: 1,
                                borderColor: "primary.light",
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <InfoCircle size={18} />
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    Current Available Stock:
                                </Typography>
                            </Stack>
                            <Chip
                                label={maxQty}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 700, px: 1, fontSize: "0.875rem" }}
                            />
                        </Box>

                        {/* Quantity Input Field */}
                        <TextField
                            fullWidth
                            autoFocus
                            label="Remove Quantity"
                            placeholder={`Enter quantity (1 to ${maxQty})`}
                            type="number"
                            value={qty}
                            onChange={handleChange}
                            error={Boolean(error)}
                            helperText={error}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Hashtag size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            inputProps={{
                                min: 1,
                                max: maxQty,
                                step: 1,
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" type="submit" disabled={Boolean(error) || !qty}>
                        Confirm Remove
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default QtyChangeDailogBox;