import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// third-party
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { openSnackbar } from 'api/snackbar';

// ============================|| AUTH - PHONE LOGIN ||============================ //

export default function AuthPhoneLogin() {
    const { sendOtp, verifyOtp } = useAuth();
    const scriptedRef = useScriptRef();

    const [step, setStep] = useState<1 | 2>(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [step, timeLeft]);

    const handleResendOtp = async () => {
        try {
            const res = await sendOtp(phoneNumber);
            if (res?.success) {
                setTimeLeft(30);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const {
        control,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isSubmitting, touchedFields }
    } = useForm({
        defaultValues: {
            phone: '',
            otp: ''
        },
        resolver: yupResolver(
            Yup.object().shape({
                phone: Yup.string().required('Phone number is required'),
                otp: step === 2 ? Yup.string().required('OTP is required') : Yup.string()
            })
        )
    });

    const onSubmit = async (values: any) => {
        try {
            if (step === 1) {
                const res = await sendOtp(values.phone);
                if (res && res.success) {
                    setPhoneNumber(values.phone);
                    setStep(2);
                    setTimeLeft(30);
                }
            } else {
                await verifyOtp(phoneNumber, values.otp);
                if (scriptedRef.current) {
                    // setStatus({ success: true }); // Not directly supported, handle locally or via context if needed
                }
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || err?.messageCode || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        }
    };

    return (
        <>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {step === 1 && (
                        <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel htmlFor="phone-login">Phone Number</InputLabel>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            id="phone-login"
                                            type="tel"
                                            placeholder="Enter phone number"
                                            fullWidth
                                            inputProps={{
                                                maxLength: 10
                                            }}
                                            error={Boolean(errors.phone)}
                                        />
                                    )}
                                />
                            </Stack>
                            {errors.phone && (
                                <FormHelperText error id="standard-weight-helper-text-phone-login">
                                    {errors.phone?.message}
                                </FormHelperText>
                            )}
                        </Grid>
                    )}

                    {step === 2 && (
                        <Grid size={12}>
                            <Stack sx={{ gap: 1 }}>
                                <InputLabel htmlFor="otp-login">OTP</InputLabel>
                                <Controller
                                    name="otp"
                                    control={control}
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            id="otp-login"
                                            type="text"
                                            placeholder="Enter OTP"
                                            fullWidth
                                            inputProps={{
                                                maxLength: 6
                                            }}
                                            error={Boolean(errors.otp)}
                                        />
                                    )}
                                />
                            </Stack>
                            {errors.otp && (
                                <FormHelperText error id="standard-weight-helper-text-otp-login">
                                    {errors.otp?.message}
                                </FormHelperText>
                            )}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Sent to {phoneNumber}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Link
                                        component="button"
                                        variant="body2"
                                        color={timeLeft > 0 ? 'text.secondary' : 'primary'}
                                        onClick={handleResendOtp}
                                        disabled={timeLeft > 0}
                                        sx={{
                                            textDecoration: 'none',
                                            cursor: timeLeft > 0 ? 'default' : 'pointer',
                                            '&:hover': {
                                                textDecoration: timeLeft > 0 ? 'none' : 'underline'
                                            }
                                        }}
                                    >
                                        {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
                                    </Link>
                                    <Typography variant="body2" color="textSecondary">
                                        |
                                    </Typography>
                                    <Link
                                        component="button"
                                        variant="body2"
                                        type="button"
                                        onClick={() => setStep(1)}
                                    >
                                        Change Number
                                    </Link>
                                </Stack>
                            </Stack>
                        </Grid>
                    )}

                    <Grid size={12}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                {step === 1 ? 'Send OTP' : 'Verify & Login'}
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
        </>
    );
}
