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
        <input
          type="text"
          placeholder="Last name"
          {...register("Last name", { required: true, maxLength: 100 })}
        />
        {/* <input
          type="text"
          placeholder="First name"
          {...register("First name", { required: true, maxLength: 80 })}
        />
        <input
          type="text"
          placeholder="Email"
          {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        <input
          type="tel"
          placeholder="Mobile number"
          {...register("Mobile number", {
            required: true,
            minLength: 6,
            maxLength: 12,
          })}
        />
        <select {...register("Title", { required: true })}>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>

        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="Yes"
        />
        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="No"
        /> */}

        <input type="submit" />
      </form>
    </>
  );
};

export default AddUser;
