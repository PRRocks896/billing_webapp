import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const AddStaff = ({ tag }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          {/* top page action with text */}
          <Box className="top-bar">
            <Grid container justifyContent={"end"}>
              <Grid item md={0.7}>
                <Button className="btn-close" onClick={() => navigate(-1)}>
                  <FiX size={25} color="var(--color-grey)" />
                </Button>
              </Grid>
            </Grid>
          </Box>
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
            <Button className="btn btn-cancel">Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddStaff;
