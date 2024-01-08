import {
  Box,
  Button,
  Fade,
  FormControl,
  FormGroup,
  Grid,
  Modal,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { useAddCustomer } from "./hook/useAddCustomer";

const AddCustomer = ({
  isCustomerModalOpen,
  setIsCustomerModalOpen,
  setCustomerSelectedHandler,
}) => {
  const { control, handleSubmit, onSubmit, reset } = useAddCustomer(
    setIsCustomerModalOpen,
    setCustomerSelectedHandler
  );

  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isCustomerModalOpen}
        onClose={() => {
          reset();
          setIsCustomerModalOpen(false);
        }}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isCustomerModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              New Customer
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className="modal-body">
                <FormGroup className="form-field">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Controller
                        name="customer_name"
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
                              label="Customer name"
                              size="small"
                              name="customer_name"
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
                          required: "Customer name field required",
                        }}
                      />
                    </Grid>
                    {/*  */}
                    <Grid item xs={6}>
                      <Controller
                        name="phone"
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
                              label="Phone"
                              size="small"
                              name="phone"
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "Phone number is required",
                          maxLength: {
                            value: 10,
                            message: "Phone number must be 10 digit",
                          },
                          minLength: {
                            value: 10,
                            message: "Phone number must be 10 digit",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name="dob"
                        control={control}
                        render={({
                          field: { onBlur, onChange, value }
                        }) => (
                          <FormControl
                            size="small"
                            variant="standard"
                            className="form-control"
                          >
                            <TextField
                              type="date"
                              label="DOB"
                              size="small"
                              name="name"
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              onBlur={onBlur}
                            />
                          </FormControl>
                        )}
                      />
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
                          <Controller
                            name="gender"
                            control={control}
                            defaultValue="male"
                            render={({
                              field: { onBlur, onChange, value },
                              fieldState: { error },
                            }) => (
                              <>
                                <span>
                                  <Radio
                                    value="male"
                                    checked={value === "male"}
                                    className="radio-field"
                                    inputProps={{ "aria-label": "Male" }}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={onBlur}
                                    error={!!error}
                                  />
                                  Male
                                </span>
                                <span>
                                  <Radio
                                    value="female"
                                    checked={value === "female"}
                                    className="radio-field"
                                    inputProps={{ "aria-label": "Female" }}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={onBlur}
                                    error={!!error}
                                  />
                                  Female
                                </span>
                                {error?.message}
                              </>
                            )}
                            rules={{ required: "Please select a gender" }}
                          />
                        </Grid>
                      </FormControl>
                    </Grid>
                  </Grid>
                </FormGroup>
              </Box>
              <Box className="modal-footer">
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Button type="submit" className="btn btn-tertiary">
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Button
                      className="btn btn-cancel"
                      onClick={() => {
                        reset();
                        setIsCustomerModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddCustomer;
