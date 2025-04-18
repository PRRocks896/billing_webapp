import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { useAddEditStates } from "./hook/useAddEditStates";
import { Controller } from "react-hook-form";

const AddEditStates = ({ tag }) => {
  const { control, handleSubmit, onSubmit, cancelHandler } =
    useAddEditStates(tag);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
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
                        label="State Name*"
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
                    required: "Please Enter State Name",
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

export default AddEditStates;
