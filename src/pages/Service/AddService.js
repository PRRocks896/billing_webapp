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
// const customStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     border: `1px solid ${
//       state.isFocused || state.hover
//         ? "var(--color-black)"
//         : "var(--color-grey)"
//     }`,
//     borderRadius: 6,
//     // padding: "7px 0px",
//   }),
// };

const AddService = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditService();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/* <FormControl variant="standard" className="form-control">
                <Typography
                  variant="body2"
                  component="span"
                  className="text-black input-label"
                >
                  Service Name *
                </Typography>
                <InputBase
                  name="service-name"
                  placeholder="Enter service name"
                  className={"input-field"}
                />
                </FormControl> */}
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
                {/* <FormControl variant="standard" className="form-control">
                  <Typography
                    variant="body2"
                    component="span"
                    className="text-black input-label"
                  >
                    Amount *
                  </Typography>
                  <InputBase
                    name="amount"
                    placeholder="Amount"
                    className={"input-field"}
                  />
                </FormControl> */}
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
                {/* <FormControl variant="standard" className="form-control">
                  <Typography
                    variant="body2"
                    component="span"
                    className="text-black input-label"
                  >
                    Select Category *
                  </Typography>
                  <Select
                    placeholder="Select category"
                    options={options}
                    styles={customStyles}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "#364865",
                      },
                    })}
                  />
                </FormControl> */}
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

export default AddService;
