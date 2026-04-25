import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { CloseCircle } from "iconsax-reactjs";
import OtpInput from "react-otp-input";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type OtpModalProps = {
    title: string;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    isShowResend?: boolean;
    resendOtp: () => void;
    handleCancelVerifyPermission: () => void;
    handleEnterOtp: (otp: string) => void;
    maxAttempts?: number;
    okTitle?: string;
    cancelTitle?: string;
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const OtpModal = ({
    title,
    isOpen,
    setOpen,
    isShowResend = true,
    resendOtp,
    handleCancelVerifyPermission,
    handleEnterOtp,
    maxAttempts = 3,
    okTitle = "Verify OTP",
    cancelTitle = "Cencel",
}: OtpModalProps) => {
    const theme = useTheme();
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [attempts, setAttempts] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp("");
            setTimeLeft(60);
            setAttempts(0);
        }
    }, [isOpen]);

    // Timer countdown
    useEffect(() => {
        if (!isOpen) return;
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isOpen]);

    const handleClose = () => {
        setOpen(false);
        handleCancelVerifyPermission();
    };

    const handleVerify = () => {
        if (otp.length !== 6) return;
        if (attempts >= maxAttempts) return;

        setAttempts((prev) => prev + 1);
        handleEnterOtp(otp);
    };

    const handleResend = () => {
        setOtp("");
        setTimeLeft(60);
        setAttempts(0);
        resendOtp();
    };

    const isMaxAttemptsReached = attempts >= maxAttempts;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="xs"
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
                    <Typography variant="h4" fontWeight={600}>
                        {title}
                    </Typography>
                    <IconButton size="small" onClick={handleClose} aria-label="close">
                        <CloseCircle size={20} />
                    </IconButton>
                </Stack>
                <Divider />
            </DialogTitle>

            {/* ── Content ────────────────────────────────────────────────── */}
            <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Please enter the 6-digit OTP sent to your registered contact.
                    </Typography>

                    <Box
                        sx={{
                            direction: "ltr",
                            "& input": {
                                width: "45px !important",
                                height: "45px",
                                fontSize: "1.25rem",
                                fontWeight: 600,
                                borderRadius: "8px",
                                border: `1px solid ${isMaxAttemptsReached ? theme.palette.error.main : theme.palette.divider
                                    }`,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                outline: "none",
                                textAlign: "center",
                                transition: "all 0.2s",
                            },
                            "& input:focus": {
                                border: `2px solid ${isMaxAttemptsReached ? theme.palette.error.main : theme.palette.primary.main
                                    }`,
                            },
                            "& input:disabled": {
                                opacity: 0.6,
                                cursor: "not-allowed",
                            },
                        }}
                    >
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span style={{ margin: "0 4px" }}></span>}
                            renderInput={(props) => (
                                <input {...props} disabled={isMaxAttemptsReached} />
                            )}
                        />
                    </Box>

                    {/* {isMaxAttemptsReached ? (
                        <Typography variant="body2" color="error" textAlign="center">
                            Max attempts reached. Please request a new OTP.
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Attempts: {attempts} / {maxAttempts}
                        </Typography>
                    )} */}

                    {isShowResend && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                Didn't receive code?
                            </Typography>
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleResend}
                                disabled={timeLeft > 0}
                                sx={{ minWidth: "auto", p: 0, fontWeight: 600 }}
                            >
                                {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </DialogContent>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    {cancelTitle}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleVerify}
                    disabled={otp.length !== 6 || isMaxAttemptsReached}
                >
                    {okTitle}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OtpModal;
