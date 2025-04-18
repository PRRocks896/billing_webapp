import {
  Box,
  Button,
  Fade,
  FormControl,
  FormGroup,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { useAddStaff } from "./hook/useAddStaff";

const AddStaff = ({
  isStaffModalOpen,
  setIsStaffModalOpen,
  fetchStaffData,
  setStaffSelectedHandler,
}) => {
  const { control, handleSubmit, onSubmit, reset } = useAddStaff(
    setIsStaffModalOpen,
    fetchStaffData,
    setStaffSelectedHandler
  );

  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isStaffModalOpen}
        onClose={() => {
          reset();
          setIsStaffModalOpen(false);
        }}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isStaffModalOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              New Staff
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className="modal-body">
                <FormGroup className="form-field">
                  <Grid container>
                    <Grid item xs={12}>
                      <Controller
                        name="staff_name"
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
                              label="Staff name"
                              size="small"
                              name="staff_name"
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
                          required: "Staff name field required",
                        }}
                      />
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
                        setIsStaffModalOpen(false);
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

export default AddStaff;
