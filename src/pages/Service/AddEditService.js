import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useAddEditService } from "./hook/useAddEditService";

const categoryOptions = [
  { label: "Category 1" },
  { label: "Category 2" },
  { label: "Category 3" },
  { label: "Category 4" },
  { label: "Category 5" },
  { label: "Category 6" },
  { label: "Category 7" },
];

const AddEditService = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditService();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="service_name"
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
                        label="Service name*"
                        size="small"
                        name="service_name"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Service name field required.",
                  }}
                />
              </Grid>
              {/*  */}
              <Grid item xs={6}>
                <Controller
                  name="amount"
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
                        label="Amount"
                        size="small"
                        name="amount"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Amount field required.",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="category"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <Autocomplete
                        size="small"
                        options={categoryOptions}
                        id="category"
                        value={value}
                        onChange={(event, newValue) => onChange(newValue)}
                        onBlur={onBlur}
                        label="category"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select category"
                            error={!!error}
                            helperText={error?.message ? error.message : ""}
                          />
                        )}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please select service category",
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

export default AddEditService;
