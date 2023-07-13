import {
  Box,
  Button,
  Table,
  Checkbox,
  TableContainer,
  FormControl,
  FormGroup,
  Grid,
  TextField,
  Autocomplete,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useRights } from "./hook/useRights";
import { Controller } from "react-hook-form";

const Rights = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    roleOptions,
    moduleList,
  } = useRights();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name={`roleID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={roleOptions}
                        id="roleID"
                        value={value}
                        onChange={(event, newValue) => onChange(newValue)}
                        onBlur={onBlur}
                        label="role"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Role"
                            error={!!error}
                            helperText={error?.message ? error.message : ""}
                          />
                        )}
                      />
                    </>
                  )}
                  rules={{
                    required: "Please Select Role",
                  }}
                />
                <FormControl size="small" fullWidth></FormControl>
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        <br />
        <Box className="card">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer className="table-wrapper">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Module Name</TableCell>
                      <TableCell>View</TableCell>
                      <TableCell>Add</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moduleList.length > 0 ? (
                      moduleList.map((row, index) => {
                        return (
                          <TableRow key={row.id} id={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`modules.${index}.view`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <Checkbox
                                      value={value}
                                      onChange={(event, newValue) =>
                                        onChange(newValue)
                                      }
                                      onBlur={onBlur}
                                    />
                                  </>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`modules.${index}.add`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <Checkbox
                                      value={value}
                                      onChange={(event, newValue) =>
                                        onChange(newValue)
                                      }
                                      onBlur={onBlur}
                                    />
                                  </>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`modules.${index}.edit`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <Checkbox
                                      value={value}
                                      onChange={(event, newValue) =>
                                        onChange(newValue)
                                      }
                                      onBlur={onBlur}
                                    />
                                  </>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`modules.${index}.delete`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <Checkbox
                                      value={value}
                                      onChange={(event, newValue) =>
                                        onChange(newValue)
                                      }
                                      onBlur={onBlur}
                                    />
                                  </>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                          No Modules Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="submit" className="btn btn-tertiary">
              Save
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

export default Rights;
