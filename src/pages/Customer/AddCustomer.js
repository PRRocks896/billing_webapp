import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";

import { useAddEditCustomer } from "./hook/useAddEditCustomer";
import { Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const AddCustomer = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditCustomer();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/* <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.customer_name ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Customer Name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      {...register("customer_name", {
                        required: "Customer name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.customer_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.customer_name.message}
                    </span>
                  )}
                </FormControl> */}
                <Controller
                  name="customer_name"
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
                        label="Customer name"
                        size="small"
                        name="customer_name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Customer name field required",
                  }}
                />
              </Grid>
              {/*  */}
              <Grid item xs={6}>
                {/* <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.phone ? "input-field" : "border-error"}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Phone *
                    </Typography>
                    <input
                      type="number"
                      placeholder="Enter phone number"
                      {...register("phone", {
                        required: "Phone number is required",
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.phone.message}
                    </span>
                  )}
                </FormControl> */}
                <Controller
                  name="phone"
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
                        label="Phone"
                        size="small"
                        name="phone"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
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
              {/*  */}
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <Typography
                    variant="body2"
                    component="span"
                    className="text-black input-label"
                  >
                    Gender *
                  </Typography>
                  <Grid container alignItems={"center"} gap={5}>
                    <Controller
                      name="gender"
                      control={control}
                      defaultValue="male"
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <span>
                            <Radio
                              value="male"
                              checked={value === "male"}
                              className="radio-field"
                              inputProps={{ "aria-label": "Male" }}
                              onChange={(e) => onChange(e.target.value)}
                              onBlur={onBlur}
                              error={!!error}
                            />
                            Male
                          </span>
                          <span>
                            <Radio
                              value="female"
                              checked={value === "female"}
                              className="radio-field"
                              inputProps={{ "aria-label": "Female" }}
                              onChange={(e) => onChange(e.target.value)}
                              onBlur={onBlur}
                              error={!!error}
                            />
                            Female
                          </span>
                          {error?.message ? error.message : ""}
                        </>
                      )}
                      rules={{ required: "Please select a gender" }}
                    />
                  </Grid>
                </FormControl>
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

export default AddCustomer;
