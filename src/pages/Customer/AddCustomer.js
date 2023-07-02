import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  Radio,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const AddCustomer = ({ tag }) => {
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
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <div
                    className={
                      !errors.customer_name ? "input-field" : "border-error"
                    }
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Customer Name *
                    </Typography>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      {...register("customer_name", {
                        required: "Customer name is required",
                        maxLength: 100,
                      })}
                    />
                  </div>
                  {errors.customer_name && (
                    <span style={{ fontSize: "14px", color: "red" }}>
                      {errors.customer_name.message}
                    </span>
                  )}
                </FormControl>
              </Grid>
              {/*  */}
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
                      placeholder="Enter phone number"
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
              {/*  */}
              <Grid item xs={6}>
                <FormControl variant="standard" className="form-control">
                  <Typography
                    variant="body2"
                    component="span"
                    className="text-black input-label"
                  >
                    Gender *
                  </Typography>
                  <Grid container alignItems={"center"} gap={5}>
                    <span>
                      <Radio
                        checked={true}
                        value="male"
                        name="radio-buttons"
                        className="radio-field"
                        slotProps={{ input: { "aria-label": "A" } }}
                      />{" "}
                      Male
                    </span>
                    <span>
                      <Radio
                        checked={false}
                        value="male"
                        name="radio-buttons"
                        className="radio-field"
                        slotProps={{ input: { "aria-label": "A" } }}
                      />{" "}
                      Female
                    </span>
                  </Grid>
                </FormControl>
              </Grid>

              {/* <Grid item xs={6}>
                <FormControl variant="standard" className='form-control'>
                  <Typography variant="body2" component="span" className='text-black input-label'>
                    Status *
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Box className="mask-box">
                        <Box
                          className="mask"
                          style={{
                            transform: `translateX(${status === "active" ? 0 : "100px"})`
                          }}
                        />
                        <Button
                          disableRipple
                          variant="text"
                          onClick={() => changeStatusHandler('active')}
                          sx={{ color:status === "active" ? "#ffffff" : "var(--color-black)"  }}
                        >
                          Active
                        </Button>
                        <Button
                          disableRipple
                          variant="text"
                          onClick={() => changeStatusHandler('inactive')}
                          sx={{ color: status === "inactive" ? "#ffffff" : "var(--color-black)" }}
                        >
                          Inactive
                        </Button>
                    </Box>
                  </Box>
                </FormControl>
              </Grid> */}
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
            <Button className="btn btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddCustomer;
