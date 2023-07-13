import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import React from "react";
import { Controller } from "react-hook-form";
import {
  FiMinusCircle,
  FiPlusCircle,
  FiPrinter,
  FiSave,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { useCreateBill } from "./hook/useCreateBill";

const CreateBill = () => {
  const {
    fields,
    control,
    paymentTypeOptions,
    customersOptions,
    staffOptions,
    serviceOptions,
    reset,
    addRow,
    onSubmit,
    navigate,
    removeRow,
    handleSubmit,
    calculateTotal,
  } = useCreateBill();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          {/* bill no, payment type, customer, sales person selection */}
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Controller
                  name="billNo"
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
                        disabled
                        label="Bill No*"
                        size="small"
                        name="billNo"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Enter Bill No",
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  control={control}
                  name={`paymentID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="paymentID"
                      options={paymentTypeOptions}
                      value={value}
                      onBlur={onBlur}
                      onChange={(event, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                        />
                      )}
                    />
                  )}
                  rules={{
                    required: "Please Select Payment",
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name="date"
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
                        disabled
                        type="date"
                        label="Date"
                        size="small"
                        name="date"
                        pattern="\d{2}-\d{2}-\d{4}"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message ? error.message : ""}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Select Date",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name={`customerID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="customerID"
                      label="customerID"
                      options={customersOptions}
                      value={value}
                      onBlur={onBlur}
                      onChange={(event, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer"
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                        />
                      )}
                    />
                  )}
                  rules={{
                    required: "Please Select Customer",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name={`staffID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="staffID"
                      options={staffOptions}
                      value={value}
                      onBlur={onBlur}
                      onChange={(event, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Person"
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                        />
                      )}
                    />
                  )}
                  rules={{
                    required: "Please Select Sales Person",
                  }}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        {/* service table */}
        <Box sx={{ margin: "15px 0" }} className="card">
          <Box className="">
            <TableContainer className="table-wrapper">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Sl.</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Dis %</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields?.map((field, index) => (
                    <TableRow key={field.id} id={field.id}>
                      <TableCell>
                        {fields.length === index + 1 && (
                          <Button type="button" onClick={addRow}>
                            <FiPlusCircle /> &nbsp;
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        <Controller
                          control={control}
                          name={`detail.${index}.serviceID`}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <Autocomplete
                              size="small"
                              disablePortal
                              id="serivce"
                              options={serviceOptions}
                              sx={{ width: 300 }}
                              value={value}
                              onBlur={onBlur}
                              onChange={(event, newValue) => onChange(newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Item"
                                  error={!!error}
                                  helperText={
                                    error?.message ? error.message : ""
                                  }
                                />
                              )}
                            />
                          )}
                          rules={{
                            required: "Item Required",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`detail.${index}.quantity`}
                          control={control}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl style={{ width: "60px" }}>
                              <TextField
                                size="small"
                                name="quantity"
                                value={value}
                                onChange={(e) => [
                                  onChange(e),
                                  calculateTotal(index),
                                ]}
                                onBlur={onBlur}
                                error={!!error}
                                helperText={error?.message ? error.message : ""}
                              />
                            </FormControl>
                          )}
                          rules={{
                            required: "Required",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`detail.${index}.rate`}
                          control={control}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              style={{ width: "60px" }}
                              size="small"
                              variant="standard"
                            >
                              <TextField
                                size="small"
                                name="rate"
                                value={value}
                                // onChange={onChange}
                                onChange={(e) => [
                                  onChange(e),
                                  calculateTotal(index),
                                ]}
                                onBlur={onBlur}
                                error={!!error}
                                helperText={error?.message ? error.message : ""}
                              />
                            </FormControl>
                          )}
                          rules={{
                            required: "Required",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`detail.${index}.discount`}
                          control={control}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              style={{ width: "60px" }}
                              size="small"
                              variant="standard"
                            >
                              <TextField
                                size="small"
                                name="discount"
                                value={value}
                                onChange={(e) => [
                                  onChange(e),
                                  calculateTotal(index),
                                ]}
                                onBlur={onBlur}
                                error={!!error}
                                helperText={error?.message ? error.message : ""}
                              />
                            </FormControl>
                          )}
                          rules={{
                            required: "Required",
                            min: {
                              value: 0,
                              message: "",
                            },
                            max: {
                              value: 100,
                              message: "",
                            },
                            pattern: {
                              value: /^[0-9]/,
                              message: "Enter only digit",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`detail.${index}.total`}
                          control={control}
                          render={({
                            field: { onBlur, onChange, value },
                            fieldState: { error },
                          }) => (
                            <FormControl
                              style={{ width: "100px" }}
                              size="small"
                              variant="standard"
                            >
                              <TextField
                                size="small"
                                name="total"
                                value={value}
                                disabled
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {fields.length !== 1 && (
                          <Button
                            type="button"
                            onClick={() => removeRow(index)}
                          >
                            <FiMinusCircle /> &nbsp;
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* discount and grand total */}
        <Box className="card">
          <FormGroup className="form-field" sx={{ marginTop: "12px" }}>
            <Grid container spacing={2}>
              {/* <Grid item xs={2}>
                <Controller
                  name="discount"
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
                        label="Discount %"
                        size="small"
                        name="discount"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name="discountAmount"
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
                        label="Discount Amount"
                        size="small"
                        name="discountAmount"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name="exchange"
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
                        label="Exchange"
                        size="small"
                        name="exchange"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Grid> */}
              <Grid item xs={2}>
                <Controller
                  name="grandTotal"
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
                        disabled
                        label="Grand Total"
                        size="small"
                        name="grandTotal"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        {/* footer button */}
        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item xs={1.5}>
            <Button className="btn btn-tertiary">
              <FiPlusCircle /> &nbsp;
              <p>New</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button type="submit" className="btn btn-tertiary">
              <FiSave /> &nbsp; <p>Save</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button onClick={reset} className="btn btn-tertiary">
              <FiTrash2 /> &nbsp; <p>Delete</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button className="btn btn-tertiary">
              <FiPrinter /> &nbsp; <p>Print</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button size="large" className="btn btn-tertiary">
              <FiPrinter /> &nbsp; <p>Re-Print</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button onClick={() => navigate(-1)} className="btn btn-tertiary">
              <FiXCircle /> &nbsp; <p>Close</p>
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CreateBill;
