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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import ImageUpload from "../../components/ImageUpload";


import { useAddEditDailyTask } from "./hook/useAddEditDailyTask";

const AddEditDailyTask = ({ tag }) => {
  const {
    control,
    branchList,
    onSubmit,
    handleSubmit,
    cancelHandler,
    staffOption,
  } = useAddEditDailyTask(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {!isEditByBranch && */}
        <>
          <Box className="card">
            <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Daily Task</Typography>
            <FormGroup className="form-field">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {/* {isAdmin && */}
                  <Controller
                    name="branchID"
                    control={control}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        size="small"
                        disablePortal
                        id="branchID"
                        label=" Branch"
                        options={branchList || []}
                        getOptionLabel={(option) => option.branchName || ""}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        value={branchList?.find((item) => item.id === value) ?? ''}
                        onBlur={onBlur}
                        onChange={(_event, newValue) => {
                          onChange(newValue?.id);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Branch Name"
                            error={!!error}
                            helperText={error?.message}
                          // onChange={(e) => searchCustomer(e.target.value)}
                          />
                        )}
                      />
                    )}
                  />
                  {/* } */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="supervisorID"
                    control={control}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        freeSolo
                        size="small"
                        id="supervisorID"
                        options={staffOption || []}
                        getOptionLabel={(option) => option.nickName || ''}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        value={staffOption?.find((option) => option.id === value) ?? ''}
                        // onBlur={onBlur}
                        onChange={(_event, value) => {
                          if (value) {
                            onChange(value?.id)
                          } else {
                            onChange(null);
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.nickName}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                    rules={{
                      required: "Please Select Supervisor",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        size="small"
                        id="status"
                        options={["Assign", "Pending", "Working", "Completed"]}
                        value={value || null}
                        onChange={(_event, newValue) => {
                          onChange(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Status"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                    rules={{ required: "Add status" }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
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
                          multiline
                          rows={4}
                          label="Note"
                          size="small"
                          name="note"
                          value={value}
                          onChange={(e) => onChange(e.target.value.toUpperCase())}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                    rules={{
                      required: "Add Note",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="photo"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <ImageUpload
                        title="Photo"
                        key={'img-upload'}
                        value={value}
                        onChange={onChange}
                        error={error}

                      />
                    )}
                    rules={{
                      required: 'Please Upload File'
                    }}
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </Box>
        </>
        {/* } */}
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
