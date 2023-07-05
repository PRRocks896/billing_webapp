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
import { useAddEditCity } from "./hook/useAddEditCity";
import { Controller } from "react-hook-form";

const AddEditCity = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler, statesOptions } =
    useAddEditCity(tag);
  console.log("*************", statesOptions);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="cityName"
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
                        label="City Name*"
                        size="small"
                        name="cityName"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter State Name",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name={`stateId`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      id="stateId"
                      options={statesOptions}
                      value={value}
                      onBlur={onBlur}
                      onChange={(event, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="State"
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                        />
                      )}
                    />
                  )}
                  rules={{
                    required: "Please Select State",
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

export default AddEditCity;
