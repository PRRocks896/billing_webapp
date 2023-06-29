import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const AddUser = () => {
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
      {/* <Box className="card">
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
                <Typography
                  variant="body2"
                  component="span"
                  className="text-black input-label"
                >
                  Staff Name *
                </Typography>
                <InputBase
                  name="staff-name"
                  placeholder="Enter staff name"
                  className={"input-field"}
                />
              </FormControl>
            </Grid>
          </Grid>
        </FormGroup>
      </Box>
      <Grid container spacing={3} sx={{ marginTop: "6px" }}>
        <Grid item md={1.5}>
          <Button className="btn btn-tertiary">Save</Button>
        </Grid>
        <Grid item md={1.5}>
          <Button className="btn btn-cancel">Cancel</Button>
        </Grid>
      </Grid> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
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
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.first_name ? "input-field" : "border-error"
                    }
                  >
                    <input
                      type="text"
                      placeholder="First name"
                      {...register("first_name", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.first_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.last_name ? "input-field" : "border-error"
                    }
                  >
                    <input
                      type="text"
                      placeholder="Last name"
                      {...register("last_name", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.last_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.username ? "input-field" : "border-error"
                    }
                  >
                    <input
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.username && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.role ? "input-field" : "border-error"}
                  >
                    <select
                      {...register("role", {
                        required: true,
                        maxLength: 100,
                      })}
                    >
                      <option value="">Select Role</option>
                      <option value="1">Role 1</option>
                      <option value="2">Role 2</option>
                      <option value="3">Role 3</option>
                    </select>
                  </div>
                  {errors.role && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.branch ? "input-field" : "border-error"}
                  >
                    <input
                      type="text"
                      placeholder="Branch name"
                      {...register("branch", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.branch && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.email ? "input-field" : "border-error"}
                  >
                    <input
                      type="text"
                      placeholder="Email address"
                      {...register("email", {
                        required: true,
                        maxLength: 100,
                        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.phone ? "input-field" : "border-error"}
                  >
                    <input
                      type="number"
                      placeholder="+91"
                      {...register("phone", {
                        required: true,
                        maxLength: 10,
                        minLength: 10,
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.address ? "input-field" : "border-error"}
                  >
                    <textarea
                      type="text"
                      rows={3}
                      placeholder="Address"
                      {...register("address", {
                        required: true,
                        maxLength: 250,
                      })}
                    />
                  </div>
                  {errors.address && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="submit" className="btn btn-tertiary">
              Save
            </Button>
            {/* <input type="submit" value={"Save"} className="btn btn-tertiary" /> */}
          </Grid>
          <Grid item md={1.5}>
            <Button className="btn btn-cancel">Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddUser;
