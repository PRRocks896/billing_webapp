import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";

// select option
const options = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
  { value: "Manager", label: "Manager" },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: `1px solid ${
      state.isFocused || state.hover
        ? "var(--color-black)"
        : "var(--color-grey)"
    }`,
    borderRadius: 6,
    padding: "7px 0px",
  }),
};

const AddUser = ({ tag }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const changeRoleHandler = (selectedOption) => {
    console.log(selectedOption);
    setRole(selectedOption);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    console.log(errors);
    console.log(role);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          className="card"
          sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
        >
          {/* <Box className="top-bar">
            <Grid container justifyContent={"end"}>
              <Grid item md={0.7}>
                <Button className="btn-close" onClick={() => navigate(-1)}>
                  <FiX size={25} color="var(--color-grey)" />
                </Button>
              </Grid>
            </Grid>
          </Box> */}

          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.first_name ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      First name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="First name"
                      {...register("first_name", {
                        required: "First name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.first_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.first_name.message}
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
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Last name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Last name"
                      {...register("last_name", {
                        required: "Last name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.last_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.last_name.message}
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
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Username *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        required: "Username is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.username && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.username.message}
                    </span>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Role *
                    </Typography>
                    <Select
                      placeholder="Select role"
                      options={options}
                      styles={customStyles}
                      name="role"
                      value={role}
                      onChange={changeRoleHandler}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "#364865",
                        },
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.branch ? "input-field" : "border-error"}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Branch name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Branch name"
                      {...register("branch", {
                        required: "Branch name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.branch && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.branch.message}
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
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Email *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Email address"
                      {...register("email", {
                        required: "Email is required",
                        maxLength: 100,
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.email.message}
                    </span>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={!errors.phone ? "input-field" : "border-error"}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Phone *
                    </Typography>
                    <input
                      type="number"
                      placeholder="+91"
                      {...register("phone", {
                        required: "Phone number is required",
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be 10 digit",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.phone.message}
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
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Address *
                    </Typography>
                    <textarea
                      type="text"
                      rows={3}
                      placeholder="Address"
                      {...register("address", {
                        required: "Address is required",
                        maxLength: {
                          value: 250,
                          message: "250 character limit",
                        },
                      })}
                    />
                  </div>
                  {errors.address && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.address.message}
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
              {tag === "add" ? "Save" : "Update"}
            </Button>
            {/* <input type="submit" value={"Save"} className="btn btn-tertiary" /> */}
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

export default AddUser;
