import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddEditStaff } from "./hook/useAddEditStaff";

const AddEditStaff = ({ tag }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, onSubmit } = useAddEditStaff(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" className="form-control">
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
                </FormControl>
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
            <Button className="btn btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditStaff;
