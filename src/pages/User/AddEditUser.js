import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useAddEditUser } from "./hook/useAddEditUser";
import ChangePasswordModal from "../../components/ChangePasswordModal";

const AddEditUser = ({ tag }) => {
  const {
    control,
    roleOptions,
    handleSubmit,
    onSubmit,
    cancelHandler,
    role,
    isNotAdmin,

    isChangePasswordOpen,
    setIsChangePasswordOpen,
    userId,
  } = useAddEditUser(tag);

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
                          onChange(e.target.value.toUpperCase());
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
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
                        onChange={(e) => {
                          onChange(e.target.value.toUpperCase());
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
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
                        // error={!!error}
                        // helperText={error?.message}
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
                            helperText={error?.message}
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
                        disabled={role === "admin" ? false : true}
                        label="Branch Name*"
                        size="small"
                        name="branchName"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value.toUpperCase());
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
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
                          helperText={error?.message}
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
              <Grid item xs={4}>
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
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Email",
                  }}
                />
              </Grid>
              {isNotAdmin && (
                <>
                  <Grid item xs={4}>
                    <Controller
                      name="billCode"
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
                            label="Bill Code*"
                            size="small"
                            name="billCode"
                            value={value}
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Please Enter Bill Code",
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="billName"
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
                            label="Bill Name*"
                            size="small"
                            name="billName"
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value.toUpperCase());
                            }}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Please Enter Bill Name",
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
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
                        type="number"
                        label="Phone*"
                        size="small"
                        name="phoneNumber"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Phone",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "please enter at leats 10 digits.",
                    },
                  }}
                />
              </Grid>
              {isNotAdmin && (
                <Grid item xs={4}>
                  <Controller
                    name="phoneNumberSecond"
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
                          type="number"
                          label="Phone 2*"
                          size="small"
                          name="phoneNumberSecond"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                    rules={{
                      // required: "Please Enter Phone 2",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "please enter at leats 10 digits.",
                      },
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="feedbackUrl"
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
                        label="Feedback URL*"
                        size="small"
                        name="gst"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Feedback URL"
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="reviewUrl"
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
                        label="Review URL*"
                        size="small"
                        name="reviewUrl"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Review URL"
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {isNotAdmin && (
                <Grid item xs={6}>
                  <Controller
                    name="address"
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
                          label="Address*"
                          size="small"
                          name="address"
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value.toUpperCase());
                          }}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                          multiline
                          rows={4}
                        />
                      </FormControl>
                    )}
                    rules={{
                      required: "Please Enter Address",
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="gstNo"
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
                        label="Gst*"
                        size="small"
                        name="gst"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value.toUpperCase());
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Gst",
                    pattern: {
                      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: 'Enter Invalid Gst Number'
                    }
                  }}
                />
                <Controller
                  control={control}
                  name="isShowGst"
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      className="form-control"
                    >
                      <FormControlLabel control={<Switch checked={value} onChange={onChange} onBlur={onBlur} />} label="Show Gst" />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          {tag === "edit" && role === "admin" && (
            <Grid item md={3}>
              <Button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change password
              </Button>
            </Grid>
          )}
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

      {isChangePasswordOpen && role === "admin" && (
        <ChangePasswordModal
          isChangePasswordOpen={isChangePasswordOpen}
          setIsChangePasswordOpen={setIsChangePasswordOpen}
          userId={userId}
        />
      )}
    </>
  );
};

export default AddEditUser;
