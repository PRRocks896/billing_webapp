import {
  Box,
  Button,
  Table,
  Checkbox,
  TableContainer,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";
import { useRights } from "./hook/useRights";
import { Controller } from "react-hook-form";

const Rights = () => {
  const {
    fields,
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    roleOptions,
    fetchRightsModuleData,
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
                    <FormControl fullWidth size="small">
                      <InputLabel id="role">Role</InputLabel>
                      <Select
                        labelId="role"
                        id="role-select"
                        value={value}
                        label="Role"
                        onChange={(e) => [
                          onChange(e),
                          fetchRightsModuleData(e.target.value),
                        ]}
                      >
                        {roleOptions?.map((res, ind) => (
                          <MenuItem
                            style={{ textTransform: "capitalize" }}
                            key={`role_${ind}`}
                            value={res.value}
                          >
                            {res.label}
                          </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                    </FormControl>
                    // <>
                    //   <Autocomplete
                    //     freeSolo
                    //     size="small"
                    //     options={roleOptions}
                    //     id="roleID"
                    //     value={value}
                    //     onChange={(event, newValue) => onChange(newValue)}
                    //     onBlur={onBlur}
                    //     label="role"
                    //     renderInput={(params) => (
                    //       <TextField
                    //         {...params}
                    //         label="Select Role"
                    //         error={!!error}
                    //         helperText={error?.message ? error.message : ""}
                    //       />
                    //     )}
                    //   />
                    // </>
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
        <Box className="card ">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer className="table-wrapper right-table-wrapper">
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
                    {fields.length > 0 ? (
                      fields?.map((res, index) => (
                        <TableRow key={`rights_${index}`} id={res.id}>
                          <TableCell>{res.moduleName}</TableCell>
                          <TableCell>
                            <Controller
                              control={control}
                              name={`modules.${index}.view`}
                              render={({
                                field: { onBlur, onChange, value },
                              }) => (
                                <Checkbox
                                  // value={value}
                                  checked={value}
                                  onChange={(event, newValue) =>
                                    onChange(newValue)
                                  }
                                  onBlur={onBlur}
                                />
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
                                <Checkbox
                                  // value={value}
                                  checked={value}
                                  onChange={(event, newValue) =>
                                    onChange(newValue)
                                  }
                                  onBlur={onBlur}
                                />
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
                                <Checkbox
                                  // value={value}
                                  checked={value}
                                  onChange={(event, newValue) =>
                                    onChange(newValue)
                                  }
                                  onBlur={onBlur}
                                />
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
                                <Checkbox
                                  // value={value}
                                  checked={value}
                                  onChange={(event, newValue) =>
                                    onChange(newValue)
                                  }
                                  onBlur={onBlur}
                                />
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                          No Modules Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {/* <TableBody>
                    {moduleList.length > 0 ? (
                      moduleList.map((row, index) => {
                        return (
                          <TableRow key={"rights_" + row.id} id={row.id}>
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
                  </TableBody> */}
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
