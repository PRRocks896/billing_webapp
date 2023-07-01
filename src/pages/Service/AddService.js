import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

// select option
const options = [
  { value: "Category1", label: "Category 1" },
  { value: "Category2", label: "Category 2" },
  { value: "Category3", label: "Category 3" },
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
    padding: "7px 0px",
  }),
};

const AddService = ({ tag }) => {
  const navigate = useNavigate();

  return (
    <>
      <Box className="card">
        {/* top page action with text */}
        {/* <Box className="top-bar">
          <Grid container justifyContent={"end"}>
            <Grid item md={0.7}>
              <Button className="btn-close" onClick={() => navigate(-1)}>
                <FiX size={25} color="var(--color-grey)" />
              </Button>
            </Grid>
          </Grid>
        </Box> */}
        <FormGroup className="form-field">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="standard" className="form-control">
                <Typography
                  variant="body2"
                  component="span"
                  className="text-black input-label"
                >
                  Service Name *
                </Typography>
                <InputBase
                  name="service-name"
                  placeholder="Enter service name"
                  className={"input-field"}
                />
              </FormControl>
            </Grid>
            {/*  */}
            <Grid item xs={6}>
              <FormControl variant="standard" className="form-control">
                <Typography
                  variant="body2"
                  component="span"
                  className="text-black input-label"
                >
                  Amount *
                </Typography>
                <InputBase
                  name="amount"
                  placeholder="Amount"
                  className={"input-field"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" className="form-control">
                <Typography
                  variant="body2"
                  component="span"
                  className="text-black input-label"
                >
                  Select Category *
                </Typography>
                <Select
                  placeholder="Select category"
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
      </Box>
      <Grid container spacing={3} sx={{ marginTop: "6px" }}>
        <Grid item md={1.5}>
          <Button className="btn btn-tertiary">
            {tag === "add" ? "Save" : "Update"}
          </Button>
        </Grid>
        <Grid item md={1.5}>
          <Button className="btn btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddService;
