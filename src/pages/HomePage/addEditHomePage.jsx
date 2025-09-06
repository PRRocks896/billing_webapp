import React from "react";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormHelpText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { generateSlug, generateUrl } from "../../utils/helper";
import ImageUpload from "../../components/ImageUpload";
import Editor from "../../components/Editor";
import useAddEditHomePageHook from "./hook/useAddEditHomePage.hook";


const AddEditHomePage = ({ tag }) => {
  const {
    control,
    setValue,
    onSubmit,
    handleSubmit,
    cancelHandler,
  } = useAddEditHomePageHook(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          <FormGroup className="form-field">
            <Grid container spacing={1}>
              <Grid item xs={8}>
               
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="title"
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
                            label="Title"
                            size="small"
                            name="name"
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value.toUpperCase())
                              setValue("slug", generateSlug(e.target.value));
                            }}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Title field required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="tag"
                      control={control}
                      render={({
                        field: { onBlur, onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel id="tag">Tag</InputLabel>
                          <Select
                            size="small"
                            labelId="tag"
                            id="tag-select"
                            value={value}
                            label="Tag"
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            <MenuItem style={{ textTransform: "capitalize" }} value="banner">Banner</MenuItem>
                            <MenuItem style={{ textTransform: "capitalize" }} value="service">Service</MenuItem>
                            <MenuItem style={{ textTransform: "capitalize" }} value="aboutUs">About Us</MenuItem>
                            <MenuItem style={{ textTransform: "capitalize" }} value="membershipPlan">Membership Plan</MenuItem>
                            <MenuItem style={{ textTransform: "capitalize" }} value="testimony">Testimony</MenuItem>
                          </Select>
                          {error && error.message &&
                            <FormHelpText error={true}>{error.message}</FormHelpText>
                          }
                        </FormControl>
                      )}
                      rules={{
                        required: 'Please Select Paid By'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="detail"
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
                            label="Detail"
                            size="small"
                            name="name"
                            multiline
                            rows={4}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </FormControl>
                      )}
                      rules={{
                        required: "Detail field required",
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
                          <Editor
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                          {error && error.message &&
                            <FormHelpText error={true}>{error.message}</FormHelpText>
                          }
                        </FormControl>
                      )}
                      rules={{
                        required: "Description field required",
                      }}
                    />
                  </Grid>

              </Grid>
              <Grid item xs={4}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Controller
                      name="image"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <ImageUpload
                          title="Image"
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
                  <Grid item xs={12}>
                    <Controller
                      name="video"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <ImageUpload
                          title="Video"
                          key={'video-upload'}
                          value={value}
                          onChange={onChange}
                          error={error}
                        />
                      )}
                    // rules={{
                    //   required: 'Please Upload File'
                    // }}
                    />
                  </Grid>
                </Grid>
              </Grid>
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
            <Button className="btn btn-cancel" onClick={cancelHandler}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
export default AddEditHomePage;