import React from "react";
import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { useAddEditLaundryWasher } from "./hook/useAddEditLaundryWasher";

const AddEditLaundryWasher = ({ tag }) => {
  const {
    control,
    countryCodeList,
    isEditByBranch,
    onSubmit,
    handleSubmit,
    cancelHandler,
  } = useAddEditLaundryWasher(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isEditByBranch && (
          <>
            <Box className="card">
              <FormGroup className="form-field">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="name"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            id="name"
                            label="Name"
                            size="small"
                            name="name"
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
                        required: "Name field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Controller
                          name="countryCode"
                          control={control}
                          render={({
                            field: { value, onChange },
                            fieldState: { error }
                          }) => (
                            <Autocomplete
                              freeSolo
                              size="small"
                              id="countryCode"
                              options={countryCodeList}
                              value={countryCodeList.find((country) => country.value === value)?.value || null}
                              disableClearable
                              onChange={(event, newValue) => onChange(newValue.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Country Code"
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                              renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                  {option.label}
                                </li>
                              )}
                            />
                          )}
                          rules={{
                            required: "Please Select County Code",
                          }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Controller
                          name="phoneNumber"
                          control={control}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl size="small" fullWidth>
                              <TextField
                                id="phoneNumber"
                                type="number"
                                label="Phone Number"
                                size="small"
                                name="phoneNumber"
                                value={value}
                                onChange={(e) => {
                                  if (e.target.value.length < 11) {
                                    onChange(e);
                                  }
                                }}
                                onBlur={onBlur}
                                error={!!error}
                                helperText={error?.message}
                              />
                            </FormControl>
                          )}
                          rules={{
                            required: "Phone Number is required",
                            pattern: {
                              value: /^\+?[1-9]\d{1,14}$/,
                              message: "please enter valid number",
                            },
                            maxLength: {
                              value: 10,
                              message: "Phone Number must be 10 digit",
                            },
                            // minLength: {
                            //   value: 10,
                            //   message: "Phone Number must be 10 digit",
                            // },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="address"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            id="address"
                            multiline
                            rows={3}
                            label="Address"
                            size="small"
                            name="Address"
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
                        required: "Address field required",
                      }}
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Box>
          </>
        )}
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
    </>
  );
};

export default AddEditLaundryWasher;
