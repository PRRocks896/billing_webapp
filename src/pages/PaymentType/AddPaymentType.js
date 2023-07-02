import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useAddEditPaymentType } from "./hook/useAddEditPaymentType";

const AddPaymentType = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditPaymentType();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.payment_type ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Payment Type *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Enter payment type"
                      {...register("payment_type", {
                        required: "Payment type is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.payment_type && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.payment_type.message}
                    </span>
                  )}
                </FormControl> */}
                <Controller
                  name="payment_type"
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
                        label="Payment Type"
                        size="small"
                        name="payment_type"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Payment type field required",
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

export default AddPaymentType;
