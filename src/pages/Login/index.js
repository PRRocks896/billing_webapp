// import {
//   Box,
//   Button,
//   FormControl,
//   Grid,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import { Controller } from "react-hook-form";
// import { useLogin } from "./hook/useLogin";
// import loginImage from "../../assets/images/login-cover.png";

// const Login = () => {
//   const { control, handleSubmit, onSubmit } = useLogin();

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Box>
//           <Grid container>
//             <Grid item xs={12} sm={6}>
//               <img src={loginImage} alt="login" width="100%" height="100%" />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Grid
//                   container
//                   spacing={2}
//                   sx={{
//                     padding: 2,
//                     height: "100%",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography variant="h4">Login</Typography>

//                   <Controller
//                     name="email"
//                     control={control}
//                     render={({
//                       field: { onBlur, onChange, value },
//                       fieldState: { error },
//                     }) => (
//                       <FormControl
//                         size="small"
//                         variant="standard"
//                         className="form-control"
//                       >
//                         <TextField
//                           label="Email"
//                           size="small"
//                           name="email"
//                           value={value}
//                           onChange={onChange}
//                           onBlur={onBlur}
//                           error={!!error}
//                           helperText={error?.message ? error.message : ""}
//                         />
//                       </FormControl>
//                     )}
//                     rules={{
//                       required: "Email required",
//                     }}
//                   />

//                   <Controller
//                     name="password"
//                     control={control}
//                     render={({
//                       field: { onBlur, onChange, value },
//                       fieldState: { error },
//                     }) => (
//                       <FormControl
//                         size="small"
//                         variant="standard"
//                         className="form-control"
//                       >
//                         <TextField
//                           label="Password"
//                           size="small"
//                           name="password"
//                           value={value}
//                           onChange={onChange}
//                           onBlur={onBlur}
//                           error={!!error}
//                           helperText={error?.message ? error.message : ""}
//                         />
//                       </FormControl>
//                     )}
//                     rules={{
//                       required: "Password required",
//                     }}
//                   />

//                   <Button type="submit" className="btn btn-tertiary">
//                     Login
//                   </Button>
//                 </Grid>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </form>
//     </>
//   );
// };

// export default Login;

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
import loginImage from "../../assets/images/login-cover.png";

const Login = () => {
  const { control, handleSubmit, onSubmit } = useLogin();

  return (
    <Grid container className="login">
      <Grid
        item
        xs={12}
        sm={6}
        display={{ xs: "none", sm: "block" }}
        className="image-box"
      >
        <img src={loginImage} alt="login" width="100%" height="100%" />
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
              <Typography className="login-heading" variant="h4" gutterBottom>
                Login
              </Typography>

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
                      type="password"
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
              <Typography className="login-heading" gutterBottom>
                <a href="/">Forgot Password?</a>
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                mt={2}
                width={"250px"}
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
