import {
  Box,
  FormControl,
  Typography,
  InputBase,
  Button,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const CreateBill = () => {
  const { register, handleSubmit } = useForm();
  const [billData, setBillData] = useState("");

  return (
    <>
      <div className="page-wrapper">
        <Box className="card">
          <form
            onSubmit={handleSubmit((data) => setBillData(JSON.stringify(data)))}
          >
            <FormGroup className="form-field">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <TextField
                      id="standard-basic"
                      label="Bill No"
                      variant="standard"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <InputLabel id="type">Type</InputLabel>
                    <Select labelId="type" id="demo-select-small" label="Age">
                      <MenuItem value={10}>Type1</MenuItem>
                      <MenuItem value={20}>Type2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl
                    variant="standard"
                    className="form-control"
                  ></FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl variant="standard" className="form-control">
                    <InputLabel id="type">Customer</InputLabel>
                    <Select labelId="type" id="demo-select-small" label="Age">
                      <MenuItem value={10}>Type1</MenuItem>
                      <MenuItem value={20}>Type2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="standard" className="form-control">
                    <InputLabel id="type">Item</InputLabel>
                    <Select labelId="type" id="demo-select-small" label="Age">
                      <MenuItem value={10}>Type1</MenuItem>
                      <MenuItem value={20}>Type2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <TextField
                      id="standard-basic"
                      label="Quantity"
                      variant="standard"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <TextField
                      id="standard-basic"
                      label="Rate"
                      variant="standard"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <TextField
                      id="standard-basic"
                      label="Disc"
                      variant="standard"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <TextField
                      id="standard-basic"
                      label="Value"
                      variant="standard"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1.5}>
                  <Button className="btn btn-cancel">Add</Button>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl variant="standard" className="form-control">
                    <InputLabel id="type">Sales Person</InputLabel>
                    <Select labelId="type" id="demo-select-small" label="Age">
                      <MenuItem value={10}>Type1</MenuItem>
                      <MenuItem value={20}>Type2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormGroup>
          </form>
        </Box>
      </div>
    </>
  );
};

export default CreateBill;
