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
    Link,
} from "@mui/material";

const VerifyOtp = ({
    title = "Verify Membership",
    isOpen,
    setOpen,
    isShowResend = false,
    resendOtp,
    handleEnterOtp,
}) => {
    const [otp, setOtp] = useState(null);
    const [seconds, setSeconds] = useState(30); // Initial countdown time
    const [canResend, setCanResend] = useState(false);
    const [attempt, setAttempt] = useState(3);

    useEffect(() => {
        let timer;
    
        if (seconds > 0 && !canResend) {
          timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }, 1000);
        } else {
          clearInterval(timer);
          setCanResend(true);
        }
    
        return () => clearInterval(timer);
      }, [seconds, canResend]);

    useEffect(() => {
        if(isOpen) {
            setOtp(null);
            setAttempt(3);
        }
    }, [isOpen]);
    return (
        <>
            <Modal
                disableEscapeKeyDown
                open={isOpen}
                // onClose={(e, reason) => {
                //     console.log(reason);
                //     setOtp(null)
                //     setOpen(false)
                // }}
                disableEnforceFocus={true}
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
                                    </Grid>
                                </Grid>
                                {isShowResend &&
                                <Box>
                                    {canResend ? (
                                        <Typography
                                            component={Link}
                                            onClick={() => {
                                                if(attempt !== 0) {
                                                    const att = attempt - 1;
                                                    setAttempt(att);
                                                    resendOtp()
                                                    setCanResend(false);
                                                    setSeconds(30);
                                                }
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {attempt !== 0 ?
                                                'Resend OTP'
                                            :
                                                'Please Try After Sometime'
                                            }
                                        </Typography>
                                    ) : (
                                        <Typography>
                                            did't not receive OTP Try after 00:{seconds}
                                        </Typography>
                                    )}
                                </Box>}
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
                                    <Button className="btn btn-cancel" onClick={() => setOpen(false)}>
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

export default VerifyOtp;