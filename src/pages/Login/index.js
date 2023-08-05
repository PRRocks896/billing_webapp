import React from "react";
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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import Sidecover from "../../assets/images/login-sidecover.png";
import SiteLogo from "../../assets/images/logo.png";

const Login = () => {
  const { control, handleSubmit, onSubmit } = useLogin();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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

              <Box
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
                  name="email"
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
                        name="email"
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
              </Box>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
