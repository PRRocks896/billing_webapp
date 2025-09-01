import React from "react";
import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";


import { useAddEditDailyTask } from "./hook/useAddEditDailyTask";

const AddEditDailyTask = ({ tag }) => {
  const {
    control,
    branchList,
    isEditByBranch,
    onSubmit,
    handleSubmit,
    cancelHandler,
  } = useAddEditDailyTask(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isEditByBranch &&
          <>
            <Box className="card">
              <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Basic Detail</Typography>
              <FormGroup className="form-field">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  
                      <Controller
                        name="userID"
                        control={control}
                        render={({
                          field: { onBlur, onChange, value },
                          fieldState: { error },
                        }) => (
                          <Autocomplete
                            size="small"
                            disablePortal
                            id="branchId"
                            label="Branch"
                            options={branchList}
                            getOptionLabel={(option) => option.branchName || ""}
                            isOptionEqualToValue={(option, value) => {
                              return value === option?.id;
                            }}
                            value={branchList.find((item) => item.id === value) || ''}
                            onBlur={onBlur}
                            onChange={(_event, newValue) => {
                              onChange(newValue?.id);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Branch"
                                error={!!error}
                                helperText={error?.message}
                                // onChange={(e) => searchCustomer(e.target.value)}
                              />
                            )}
                          />
                        )}
                      />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="note"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl size="small" fullWidth>
                          <TextField
                            id="note"
                            label="Original Name (As per ID)"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
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
          </>
        }
        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="sumit" className="btn btn-tertiary">
              {tag === "add" ? "Save" : "Update"}
            </Button>
          </Grid>
          <Grid item md={1.5}>
            <Button className="btn btn-cancel" onClick={cancelHandler}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditDailyTask;
