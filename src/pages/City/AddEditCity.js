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
import { Controller } from "react-hook-form";

import ImageUpload from "../../components/ImageUpload";
import { useAddEditCity } from "./hook/useAddEditCity";

const AddEditCity = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler, statesOptions } =
    useAddEditCity(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Controller
                      name="stateID"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <Autocomplete
                            freeSolo
                            size="small"
                            id="stateId"
                            options={statesOptions}
                            value={value}
                            onBlur={onBlur}
                            onChange={(event, newValue) => onChange(newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select State"
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </>
                      )}
                      rules={{
                        required: "Please Select State",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="name"
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
                        required: "Please Enter City Name",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="description"
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
                            label="Description"
                            size="small"
                            name="name"
                            multiline
                            rows={6}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Description field required",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Controller
                      name="image"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <ImageUpload
                          key={"img-upload"}
                          value={value}
                          onChange={onChange}
                          error={error}
                        />
                      )}
                      rules={{
                        required: "Please Upload File",
                      }}
                    />
                  </Grid>
                </Grid>
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
