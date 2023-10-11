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
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../redux/loader";
import { showToast } from "../utils/helper";
import { changePassword } from "../service/users";

const ChangePasswordModal = ({
  isChangePasswordOpen,
  setIsChangePasswordOpen,
  userId,
}) => {
  const dispatch = useDispatch();
  //   const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      if (data.newPassword !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "custom",
          message: "Confirm Password is miss match.",
        });
        return;
      }

      const response = await changePassword({
        id: +userId,
        newPassword: data.newPassword,
      });

      if (response?.statusCode === 200) {
        showToast(response?.messageCode, true);
        reset();
        setIsChangePasswordOpen(false);
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <>
      <Modal
        disableEscapeKeyDown
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isChangePasswordOpen}
        onClose={() => {
          reset();
          setIsChangePasswordOpen(false);
        }}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isChangePasswordOpen}>
          <Box className="modal-wrapper modal-bg">
            <Typography
              variant="h6"
              component="h6"
              className="text-black modal-title"
            >
              Change password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className="modal-body">
                <FormGroup className="form-field">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Controller
                        name="newPassword"
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
                              type="password"
                              label="New Password"
                              size="small"
                              name="newPassword"
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "New password field required",
                        }}
                      />
                    </Grid>
                    {/*  */}
                    <Grid item xs={6}>
                      <Controller
                        name="confirmPassword"
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
                              type="password"
                              label="Confirm Password"
                              size="small"
                              name="confirmPassword"
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "Confirm password field required",
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
                        setIsChangePasswordOpen(false);
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

export default ChangePasswordModal;
