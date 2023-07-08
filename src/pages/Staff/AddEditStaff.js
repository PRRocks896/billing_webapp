import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { useAddEditStaff } from "./hook/useAddEditStaff";
import { Controller } from "react-hook-form";

const AddEditStaff = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditStaff(tag);

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
                      !errors.staff_name ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Staff Name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Enter staff name"
                      {...register("staff_name", {
                        required: "Staff name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.staff_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.staff_name.message}
                    </span>
                  )}
                </FormControl> */}
                <Controller
                  name="staff_name"
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
                        label="Staff name"
                        size="small"
                        name="staff_name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Staff name field required",
                  }}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
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

export default AddEditStaff;
