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
import Typography from "@mui/material/Typography";
import { Controller, set } from "react-hook-form";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import ImageUpload from "../../components/ImageUpload";
import { useAddEditUser } from "./hook/useAddEditUser";
import { generateSlug } from "../../utils/helper";

const AddEditUser = ({ tag }) => {
  const {
    control,
    companyOptions,
    roleOptions,
    cityOptions,
    handleSubmit,
    onSubmit,
    cancelHandler,
    role,
    isNotAdmin,
    setValue,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    userId,
  } = useAddEditUser(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          className="card"
          // sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
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
                          onChange(e.target.value);
                          setValue("slug", generateSlug('massage-spa-in-' + value));
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
                  name="slug"
                  control={control}
                  render={({
                    field: { value }
                  }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      className="form-control"
                    >
                      <TextField
                        label="Slug"
                        size="small"
                        name="name"
                        value={value}
                        disabled
                      />
                    </FormControl>
                  )}
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
              <Grid item xs={4}>
                <Controller
                  name={`cityID`}
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Autocomplete
                        freeSolo
                        size="small"
                        id="cityID"
                        options={cityOptions}
                        value={value}
                        onBlur={onBlur}
                        onChange={(event, newValue) => onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select City"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </>
                  )}
                  rules={{
                    required: "Please Select Company",
                  }}
                />
              </Grid>
              {/* </Grid>
            <Grid container spacing={2}> */}
              <Grid item xs={4}>
                <Controller
                  name={`companyID`}
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Autocomplete
                        freeSolo
                        size="small"
                        id="companyID"
                        options={companyOptions}
                        value={value}
                        onBlur={onBlur}
                        onChange={(event, newValue) => onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Company"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </>
                  )}
                  rules={{
                    required: "Please Select Company",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`roleID`}
                  control={control}
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
              {/* </Grid>
            <Grid container spacing={2}> */}
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
              {/* </Grid>
              <Grid container spacing={2}> */}
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
                  name="feedbackUrl"
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
                    required: "Please Enter Feedback URL",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="reviewUrl"
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
                    required: "Please Enter Review URL",
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
              {/* </Grid>
            <Grid container spacing={2}> */}
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
                  name="gstNo"
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
                      value:
                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Enter Invalid Gst Number",
                    },
                  }}
                />
                <Controller
                  name="isShowGst"
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
                      <FormControlLabel
                        control={
                          <Switch
                            checked={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        }
                        label="Show Gst"
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        <br />
        <Box className="card">
          <Typography variant="h6">Website Detail</Typography>
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="areaName"
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
                        label="Area Name*"
                        size="small"
                        name="areaName"
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
                    required: "Please Enter Area Name",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}></Grid>
              <Grid item xs={12}>
                <Controller
                  name="mapUrl"
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
                        label="Map URL*"
                        size="small"
                        name="mapUrl"
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
                    required: "Please Enter Map URL",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="iFrameMap"
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
                        label="Iframe Map*"
                        size="small"
                        name="iFrameMap"
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
                    required: "Please Enter Iframe Map",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="images"
                  control={control}
                  render={({
                      field: { onChange, value },
                      fieldState: { error },
                  }) => (
                      <ImageUpload
                          key={'img-upload'}
                          value={value}
                          onChange={onChange}
                          error={error}
                          multiple={true}
                          accept={'image/*'}
                      />
                  )}
                  rules={{
                      required: 'Please Upload File'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="thumbnilImage"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <ImageUpload
                      key={'img-upload'}
                      title="Thumbnail Image Upload"
                      value={value}
                      onChange={onChange}
                      error={error}
                      accept={'image/*'}
                    />
                  )}
                  rules={{
                    required: 'Please Upload File'
                  }}
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
