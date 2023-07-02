import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useAddEditServiceCategory } from "./hook/useAddEditServiceCategory";

const AddServiceCategory = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditServiceCategory(tag);

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
                      !errors.service_category ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Service Category *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Enter Service category"
                      {...register("service_category", {
                        required: "Service category is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.service_category && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.service_category.message}
                    </span>
                  )}
                </FormControl> */}
                {/*  */}
                <Controller
                  name="service_category"
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
                        label="Service Category*"
                        size="small"
                        name="service_category"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Service category field required",
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

export default AddServiceCategory;
