import React from "react";
import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import VerifyOtp from "../../components/VerifyOTPModel";

import { useAddEditStaff } from "./hook/useAddEditStaff";

const AddEditStaff = ({ tag }) => {
  const {
    control,
    isAdmin,
    branchList,
    verifiedOtp,
    isEditByBranch,
    isShowBankDetail,
    employeeTypeList,
    openVerifyOtpModal,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
    handleSendOtp,
    handleVerifyOtp,
    setIsShowBankDetail,
    setOpenVerifyOtpModal,
  } = useAddEditStaff(tag);

  return (
    <>
      <form onSubmit={handleSubmit(verifiedOtp || (isAdmin || isEditByBranch) ? onSubmit : handleSendOtp)}>
        {!isEditByBranch &&
          <>
            <Box className="card">
              <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Basic Detail</Typography>
              <FormGroup className="form-field">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="employeeTypeID"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <FormControl>
                          <Typography variant="subtitle1" fontWeight={500} fontSize={16}>Employee Type:</Typography>
                            <RadioGroup
                              sx={{ display: 'block'}}
                              name="radio-buttons-group"
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!error}
                            >
                              {employeeTypeList && employeeTypeList?.map((item, index) => (
                                <FormControlLabel
                                  key={`emp_type_${index}`}
                                  value={item.id}
                                  control={<Radio />}
                                  label={item.name}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                          { error && error.message &&
                            <FormHelperText error={true} >{error.message}</FormHelperText>
                          }
                        </>
                      )}
                      rules={{
                        required: "Employee Type field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {isAdmin &&
                      <Controller
                        name="userID"
                        control={control}
                        render={({
                          field: { onBlur, onChange, value },
                          fieldState: { error },
                        }) => (
                          <Autocomplete
                            size="small"
                            disablePortal
                            id="branchId"
                            label="Branch"
                            options={branchList}
                            getOptionLabel={(option) => option.branchName || ""}
                            isOptionEqualToValue={(option, value) => {
                              return value === option?.id;
                            }}
                            value={branchList.find((item) => item.id === value) || ''}
                            onBlur={onBlur}
                            onChange={(_event, newValue) => {
                              onChange(newValue?.id);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Branch"
                                error={!!error}
                                helperText={error?.message}
                                // onChange={(e) => searchCustomer(e.target.value)}
                              />
                            )}
                          />
                        )}
                      />
                    }
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="name"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Original Name (As per ID)"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Staff name field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="nickName"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Nick name"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Nick name field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            type="number"
                            label="Phone"
                            size="small"
                            name="phoneNumber"
                            value={value}
                            onChange={(e) => {
                              if(e.target.value.length < 11) {
                                onChange(e)
                              }
                            }}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Phone number is required",
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="fatherName"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Father name"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Father name field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="fatherPhone"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            type="number"
                            label="Father Phone No"
                            size="small"
                            name="phoneNumber"
                            value={value}
                            onChange={(e) => {
                              if(e.target.value.length < 11) {
                                onChange(e)
                              }
                            }}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Father Phone no is required",
                        maxLength: {
                          value: 10,
                          message: "Father Phone no must be 10 digit",
                        },
                        minLength: {
                          value: 10,
                          message: "Father Phone no must be 10 digit",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="salary"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            type="number"
                            label="Salary"
                            size="small"
                            name="salary"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Salary no is required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="pastWorking"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Past Working"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Past Working field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="experience"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Experience"
                            size="small"
                            name="experience"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Experience field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="localAddress"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            multiline
                            rows={3}
                            label="Local Address"
                            size="small"
                            name="localAddress"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Local Address field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="permanentAddress"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            multiline
                            rows={3}
                            label="Permanent Address"
                            size="small"
                            name="permanentAddress"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Permanent Address field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="refName"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            label="Reference name"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            onBlur={onBlur}
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="refPhone"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            type="number"
                            label="Reference Phone No"
                            size="small"
                            name="refPhone"
                            value={value}
                            onChange={(e) => {
                              if(e.target.value.length < 11) {
                                onChange(e)
                              }
                            }}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        maxLength: {
                          value: 10,
                          message: "Reference Phone no must be 10 digit",
                        },
                        minLength: {
                          value: 10,
                          message: "Reference Phone no must be 10 digit",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Box>
            <br/>
            <Box className="card">
              Is Enter Bank Detail 
              <Switch
                checked={isShowBankDetail}
                onChange={(e) => setIsShowBankDetail(e.target.checked)}
              />
            </Box>
            <br/>
          </>
        }
        {isShowBankDetail &&
        <Box className="card">
          <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Bank Detail</Typography>
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="accountType"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <FormControl>
                      <Typography variant="subtitle1" fontWeight={500} fontSize={16}>Account Type:</Typography>
                        <RadioGroup
                          sx={{ display: 'block'}}
                          name="radio-buttons-group"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!error}
                        >
                          <FormControlLabel
                            value="saving"
                            control={<Radio/>}
                            label="Saving"
                          />
                          <FormControlLabel
                            value="current"
                            control={<Radio/>}
                            label="Current"
                          />
                        </RadioGroup>
                      </FormControl>
                      { error && error.message &&
                        <FormHelperText error={true} >{error.message}</FormHelperText>
                      }
                    </>
                  )}
                  rules={{
                    required: "Account Type field required",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <TextField
                        type="password"
                        label="Account Number"
                        size="small"
                        name="accountNumber"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Account Number field required",
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="reEnterAccountNumber"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <TextField
                        type="number"
                        label="Re Enter Account Number"
                        size="small"
                        name="name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Re Enter Account Number field required",
                    validate: (value) => {
                      if(value !== getValues('accountNumber')) {
                        return "Please Enter Correct Account Number"
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="ifscCode"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <TextField
                        label="IFSC Code"
                        size="small"
                        name="ifscCode"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "IFSC Code field required",
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: 'Please Enter Valid IFSC Code'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="accountHolderName"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <TextField
                        label="Account Holder Name"
                        size="small"
                        name="name"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Account Holder Name field required",
                  }}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        }
        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="sumit" className="btn btn-tertiary">
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
      {openVerifyOtpModal &&
        <VerifyOtp
          title="Verify Staff Add Permission OTP"
          isOpen={openVerifyOtpModal}
          setOpen={setOpenVerifyOtpModal}
          handleEnterOtp={handleVerifyOtp}
        />
      }
    </>
  );
};

export default AddEditStaff;
