import {
  Box,
  FormControl,
  Typography,
  InputBase,
  Button,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "react-select";

const options = [
  { value: "Option1", label: "Option 1" },
  { value: "Option2", label: "Option 2" },
  { value: "Option3", label: "Option 3" },
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
    padding: "4px 0px",
  }),
};

const CreateBill = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <>
      <div className="page-wrapper">
        <Box className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="form-field">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={
                        !errors.bill_no ? "input-field" : "border-error"
                      }
                    >
                      <label>Bill No *</label>
                      <input
                        type="text"
                        placeholder="Bill No"
                        {...register("bill_no", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.bill_no && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Bill No Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Type *
                    </Typography>

                    <Select
                      placeholder="Type"
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
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <label>Date *</label>
                      <input
                        type="date"
                        placeholder="Date"
                        {...register("date", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.date && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Bill No Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl variant="standard" className="form-control">
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Customer *
                    </Typography>
                    <Select
                      placeholder="Customer"
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
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Item *
                    </Typography>
                    <Select
                      placeholder="Item"
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
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={
                        !errors.quantity ? "input-field" : "border-error"
                      }
                    >
                      <label>Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        {...register("quantity", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.quantity && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Quantity Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.rate ? "input-field" : "border-error"}
                    >
                      <label>Rate *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Rate"
                        {...register("rate", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.rate && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Rate Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <div className={"input-field"}>
                      <label>Disc</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Disc"
                        {...register("disc", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div className={"input-field"}>
                      <label>Value</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Value"
                        {...register("value", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <Button type="submit" className="btn btn-tertiary">
                    <p>Add</p>
                  </Button>
                  <Button className="btn btn-cancel">
                    <p>Cancel</p>
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl variant="standard" className="form-control">
                    <Typography
                      variant="body2"
                      component="span"
                      className="text-black input-label"
                    >
                      Sales Person *
                    </Typography>
                    <Select
                      placeholder="Sales Person"
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
                  </FormControl>
                </Grid>
              </Grid>
            </FormGroup>
          </form>

          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Discount %</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("discount", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Discount Amount</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("discount", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Exchange</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("exchange", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Net</label>
                    <Typography variant="h4" component="h2">
                      0.00
                    </Typography>
                  </div>
                </FormControl>
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
      </div>
    </>
  );
};

export default CreateBill;
