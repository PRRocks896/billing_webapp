import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { useLogin } from "./hook/useLogin";

const Login = () => {
  const { control, handleSubmit, onSubmit } = useLogin();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ height: "100vh" }}>
          <Grid container sx={{ height: "100%" }}>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                backgroundImage:
                  "url(https://source.unsplash.com/random?wallpapers)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  padding: 2,
                  height: "100%",
                }}
              >
                <Grid container spacing={2} sx={{ bgcolor: "ffffff" }}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Login</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl
                          size="small"
                          variant="standard"
                          className="form-control"
                        >
                          <TextField
                            label="Email"
                            size="small"
                            name="email"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message ? error.message : ""}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Email required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                          className="form-control"
                        >
                          <TextField
                            label="Password"
                            size="small"
                            name="password"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message ? error.message : ""}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Password required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" className="btn btn-tertiary">
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </>
  );
};

export default Login;
