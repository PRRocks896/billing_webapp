import React, { useEffect, useRef} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Controller } from "react-hook-form";
import { useLogin } from "./hook/useLogin";
import Edit from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import Sidecover from "../../assets/images/login-sidecover.png";
import SiteLogo from "../../assets/images/logo.png";

const Login = () => {
  const { 
    control,
    showOTP,
    seconds,
    canResend,
    onSubmit,
    resendOtp,
    handleSubmit,
    toggleShowOTP
  } = useLogin();

  const otpInputRef = useRef(null);

  useEffect(() => {
    if(showOTP) {
      if(otpInputRef.current) {
        otpInputRef.current.focus();
      }
    } else {
      if(otpInputRef.current) {
        otpInputRef.current.blur();
      }
    }
    // eslint-disable-next-line
  }, [showOTP])

  return (
    <Grid container className="login">
      <Grid
        item
        xs={12}
        sm={6}
        display={{ xs: "none", sm: "block" }}
        className="image-box"
      >
        <img src={Sidecover} alt="background" className="background-img" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box width="100%" px={2} className="login-box">
              <Box>
                <img src={SiteLogo} alt="logo" />
                <Typography className="login-heading" variant="h4" gutterBottom>
                  Login
                </Typography>
              </Box>

              <Box sx={{display: "flex", flexDirection: "column", gap: "18px", width: "90%", justifyContent: "center", alignItems: "center" }} className="field-box">
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error }
                  }) => (
                    <FormControl size="small" fullWidth variant="standard" className="login-form-control">
                      {showOTP ? (
                        <TextField
                          type="number"
                          label="Phone Number"
                          size="small"
                          fullWidth
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                          disabled={showOTP}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={toggleShowOTP}
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                  }}
                                  edge="end"
                                >
                                  <Edit />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ) : (
                        <TextField
                          type="number"
                          label="Phone number"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={value}
                          onChange={(e) => {
                            if (e.target.value.length <= 10) {
                              onChange(e.target.value);
                            }
                          }}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                          // InputLabelProps={{
                          //   style: {
                          //     color: theme.palette.primary.main
                          //   }
                          // }}
                        />
                      )}
                    </FormControl>
                  )}
                  rules={{
                    required: 'Phone number is required',
                    minLength: {
                      value: 10,
                      message: 'Please enter minimum 10 digit'
                    },
                    maxLength: {
                      value: 10,
                      message: 'Please enter maximum 10 digit'
                    },
                    pattern: {
                      value: /^\d{10}$/i,
                      message: 'Please enter valid Phone Number'
                    }
                  }}
                />
                {showOTP ? (
                  <Controller
                    name="otp"
                    control={control}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error }
                    }) => (
                      <FormControl size="small" className="login-form-control" fullWidth variant="standard">
                        <TextField
                          type="number"
                          label="OTP"
                          placeholder="Enter OTP"
                          size="small"
                          name="OTP"
                          inputRef={otpInputRef}
                          focused={true}
                          value={value}
                          onChange={(e) => {
                            if (e.target.value.length <= 6) {
                              onChange(e.target.value);
                            }
                          }}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                    rules={{
                      required: 'OTP required',
                      minLength: {
                        value: 6,
                        message: 'Please enter minimum 6 digit'
                      },
                      maxLength: {
                        value: 6,
                        message: 'Please enter maximum 6 digit'
                      },
                      pattern: {
                        value: /^\d{6}$/i,
                        message: 'Please enter valid OTP'
                      }
                    }}
                  />
                ) : null}
                {showOTP ? (
                  <Box>
                    {canResend ? (
                      <Typography
                        component={Link}
                        onClick={resendOtp}
                        sx={{ cursor: 'pointer' }}
                      >
                        Resend OTP
                      </Typography>
                    ) : (
                      <Typography>
                        did't not receive OTP Try after 00:{seconds}
                      </Typography>
                    )}
                  </Box>
                ) : null}
                <br />
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                width={"250px"}
                className="login-action-box"
              >
                <Button
                  type="submit"
                  className="btn btn-tertiary"
                  size="large"
                  fullWidth
                >
                  {showOTP ? 'Verify OTP' : 'Get OTP'}
                </Button>
              </Box>

              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="field-box"
              >
                <Controller
                  sx={{
                    margin: "20px",
                  }}
                  name="login_key"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      fullWidth
                      className="login-form-control"
                    >
                      <TextField
                        label="Username or Email"
                        size="small"
                        name="login_key"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Username or Email is required",
                  }}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      fullWidth
                      className="login-form-control"
                    >
                      <TextField
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        size="small"
                        name="password"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Password required",
                  }}
                />
                <Link className="forgot-heading">
                  <Typography>Forgot Password?</Typography>
                </Link>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                width={"250px"}
                className="login-action-box"
              >
                <Button type="submit" className="btn btn-tertiary">
                  Login
                </Button>
              </Box> */}
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
