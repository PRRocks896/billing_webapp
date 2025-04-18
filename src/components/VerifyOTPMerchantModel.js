import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Fade,
    FormControl,
    FormGroup,
    Grid,
    Modal,
    TextField,
    Typography,
} from "@mui/material";

const VerifyOtpMerchant = ({
    title = 'Verify by Merchant',
    isOpen,
    handleCancelVerifyPermission,
    resendOtp,
    handleEnterOtp
}) => {
    const [otp, setOtp] = useState(null);
    useEffect(() => {
        if(isOpen) {
            setOtp(null);
        }
    }, [isOpen]);
    return (
        <>
            <Modal
                disableEscapeKeyDown
                open={isOpen}
                onClose={() => {
                    setOtp(null)
                    handleCancelVerifyPermission()
                }}
                closeAfterTransition
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen}>
                    <Box className="modal-wrapper modal-bg">
                        <Typography variant="h6" component="h6" className="text-black modal-title">
                            {title}
                        </Typography>
                        <Box className="modal-body">
                            <FormGroup className="form-field">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Enter OTP"
                                                variant="outlined"
                                                size="small"
                                                name="otp"
                                                value={otp || ''}
                                                onChange={(e) => {
                                                    if(e.target.value.length < 7) {
                                                        setOtp(e.target.value)}
                                                    }
                                                }
                                            />
                                        </FormControl>
                                        <Box>
                                            <Typography variant="subtitle2" component={Button} onClick={resendOtp}>
                                                Resend Otp
                                            </Typography>
                                            {/* <a onClick={resendOtp}>
                                                Resend
                                            </a> */}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Box>
                        <Box className="modal-footer">
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <Button className="btn btn-tertiary" onClick={() => handleEnterOtp(otp)}>
                                        Verify
                                    </Button>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Button className="btn btn-cancel" onClick={handleCancelVerifyPermission}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default VerifyOtpMerchant;