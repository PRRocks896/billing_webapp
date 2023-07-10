import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useAddEditUser } from "./hook/useAddEditUser";

const AddEditUser = ({ tag }) => {
  const { control, roleOptions, handleSubmit, onSubmit, cancelHandler } =
    useAddEditUser(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          className="card"
          sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
        >
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Controller
                  name="firstName"
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
                        label="First Name*"
                        size="small"
                        name="firstName"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter First Name",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="lastName"
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
                        label="Last Name*"
                        size="small"
                        name="lastName"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Last Name",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="userName"
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
                        disabled
                        label="User Name*"
                        size="small"
                        name="userName"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter User Name",
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name={`roleID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Autocomplete
                        freeSolo
                        size="small"
                        id="roleID"
                        options={roleOptions}
                        value={value}
                        onBlur={onBlur}
                        onChange={(event, newValue) => onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Role"
                            error={!!error}
                            helperText={error?.message ? error.message : ""}
                          />
                        )}
                      />
                    </>
                  )}
                  rules={{
                    required: "Please Select Role",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="branchName"
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
                        disabled
                        label="Branch Name*"
                        size="small"
                        name="branchName"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Branch Name",
                  }}
                />
              </Grid>
              {tag === "add" && (
                <Grid item xs={4}>
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
                          label="Password*"
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
                      required: "Please Enter Password",
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
                        label="Email*"
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
                    required: "Please Enter Email",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="phoneNumber"
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
                        label="Phone*"
                        size="small"
                        name="phoneNumber"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Phone",
                  }}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="submit" className="btn btn-tertiary">
              {tag === "add" ? "Save" : "Update"}
            </Button>
          </Grid>
          <Grid item md={1.5}>
            <Button className="btn btn-cancel" onClick={cancelHandler}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditUser;
