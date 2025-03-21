import React from "react";
import { Controller } from "react-hook-form";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";

import ImageUpload from "../../components/ImageUpload";
import { useAddEditService } from "./hook/useAddEditService";
import { generateSlug } from "../../utils/helper";

const AddEditService = ({ tag }) => {
  const {
    fields,
    control,
    categoryOptions,
    addRow,
    onSubmit,
    setValue,
    removeRow,
    handleSubmit,
    cancelHandler,
  } = useAddEditService(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="name"
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
                        label="Service name*"
                        size="small"
                        name="name"
                        value={value}
                        onChange={(e) => {
                          onChange(e.target.value)
                          setValue('slug', generateSlug(e.target.value));
                          setValue('displayName', e.target.value.toUpperCase());
                        }}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Service name field required.",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="slug"
                  control={control}
                  render={({
                    field: { value }
                  }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      className="form-control"
                    >
                      <TextField
                        label="Slug"
                        size="small"
                        name="name"
                        value={value}
                        disabled
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="displayName"
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
                        label="Display name*"
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
                    required: "Display name field required.",
                  }}
                />
              </Grid>
              {/*  */}
              <Grid item xs={12} sm={3}>
                <Controller
                  name="category"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl size="small" fullWidth>
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={categoryOptions}
                        id="category"
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        value={value}
                        onChange={(event, newValue) => onChange(newValue)}
                        onBlur={onBlur}
                        label="category"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select category"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please select service category",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="amount"
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
                        label="Amount*"
                        size="small"
                        name="amount"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Amount field required.",
                    pattern: {
                      value: /^\d*(\.\d{0,2})?$/i,
                      message: "please enter digit only.",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="webPrice"
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
                        label="Website Price*"
                        size="small"
                        name="webPrice"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Website Price field required.",
                    pattern: {
                      value: /^\d*(\.\d{0,2})?$/i,
                      message: "please enter digit only.",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="minutes"
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
                        label="Minutes"
                        size="small"
                        name="minutes"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Minutes field required.",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
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
                        label="Description"
                        size="small"
                        name="description"
                        multiline
                        rows={6}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>
        <br/>
        <Box className="card">
          <Controller
            name="thumbnilImage"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
              <ImageUpload
                key={'img-upload'}
                title="Thumbnail Image Upload"
                value={value}
                onChange={onChange}
                error={error}
                accept={'image/*'}
              />
            )}
            rules={{
              required: 'Please Upload File'
            }}
          />
        </Box>
        <br/>
        <Box className="card">
          <Controller
            name="images"
            control={control}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <ImageUpload
                    key={'img-upload'}
                    value={value}
                    onChange={onChange}
                    error={error}
                    multiple={true}
                    accept={'image/*'}
                />
            )}
            rules={{
                required: 'Please Upload File'
            }}
          />
        </Box>
        <br/>
        <Box className="card">
          <Controller
            name="backgrandImage"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
              <ImageUpload
                key={'img-upload'}
                title="Background Image Upload"
                value={value}
                onChange={onChange}
                error={error}
                accept={'image/*'}
              />
            )}
            rules={{
              required: 'Please Upload File'
            }}
          />
        </Box>
        <br/>
        <Box className="card">
          <Controller
            name="video"
            control={control}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <ImageUpload
                    key={'video-upload'}
                    title="Video Upload"
                    value={value}
                    onChange={onChange}
                    error={error}
                    accept={"video/mp4,video/x-m4v,video/*"}
                />
            )}
            rules={{
                required: 'Please Upload File'
            }}
          />
        </Box>
        <br/>
        <Box className="card">
          <Typography variant="h6">Feature List</Typography>
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"2%"}></TableCell>
                  <TableCell>Feature</TableCell>
                  <TableCell width={"2%"}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id} id={field.id}>
                    <TableCell>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        onClick={addRow}
                        style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                      >
                        {fields.length === (index + 1) ? <FiPlusCircle size={26} /> : null}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`featureList.${index}.value`}
                        control={control}
                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                            <FormControl size="small" fullWidth>
                                <TextField
                                    type="text"
                                    label=""
                                    size="small"
                                    value={value || ""}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={onBlur}
                                    error={Boolean(error)}
                                    helperText={error?.message ? error.message : ""}
                                />
                            </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                          component="span"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          onClick={() => removeRow(index)}
                          style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center", color: 'red' }}
                      >
                          {fields.length !== 1 ?
                              <FiMinusCircle size={26} />
                              : null}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item md={1.5}>
            <Button type="submit" className="btn btn-tertiary">
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

export default AddEditService;
