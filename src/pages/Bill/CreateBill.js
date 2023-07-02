import {
  Autocomplete,
  Box,
  FormControl,
  TextField,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Button,
  FormGroup,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React from "react";
// import Select from "react-select";
import { Controller } from "react-hook-form";
import {
  FiMinusCircle,
  FiPlusCircle,
  FiPrinter,
  FiSave,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { useCreateBill } from "./CreateBill.hooks";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: `1px solid ${
      state.isFocused || state.hover
        ? "var(--color-black)"
        : "var(--color-grey)"
    }`,
    borderRadius: 6,
    // padding: "2px 0px",
  }),
};

const CreateBill = () => {
  const {
    fields,
    control,
    addRow,
    onSubmit,
    navigate,
    removeRow,
    handleSubmit,
    calculateTotal,
  } = useCreateBill();
  return (
    <>
      <div className="page-wrapper">
        <Box className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                          label="Bill No*"
                          size="small"
                          name="billNo"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          disabled
                        />
                      </FormControl>
                    )}
                    rules={{
                      required: "Please enter Bill No",
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="billNo"
                    control={control}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormControl size="small" fullWidth>
                        <InputLabel id="paymentType">Payment Type</InputLabel>
                        <Select
                          labelId="paymentType"
                          id="paymentType"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          label="Payment Type"
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    rules={{
                      required: "Please Select Payment Type",
                    }}
                  />
                </Grid>
              </Grid>
              {/* <Grid container spacing={2}>
                <Grid item xs={2}>
                      <FormControl size="small" variant="standard" className="form-control">
                        <div
                          className={
                            !errors.bill_no ? "input-field" : "border-error"
                          }
                        >
                          <label>Bill No *</label>
                          <input
                            disabled
                            type="text"
                            placeholder="Bill No"
                            {...register("bill_no", {
                              required: true,
                              maxLength: 100,
                            })}
                          />
                        </div>
                        {errors.bill_no && (
                          <span style={{ fontSize: "14px", color: "red" }}>
                            Bill No Required
                          </span>
                        )}
                      </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <lable>Type *</lable>
                      <Select
                        placeholder="Type"
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
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <label>Date *</label>
                      <input
                        type="date"
                        placeholder="Date"
                        {...register("date", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.date && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Date No Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <lable>Customer *</lable>
                      <Select
                        placeholder="Customer"
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
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <lable>Sales Person *</lable>
                      <Select
                        placeholder="Sales Person"
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
                    </div>
                  </FormControl>
                </Grid>
              </Grid> */}

              {/* <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.date ? "input-field" : "border-error"}
                    >
                      <label>Item *</label>
                      <Select
                        placeholder="Item"
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
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={
                        !errors.quantity ? "input-field" : "border-error"
                      }
                    >
                      <label>Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("quantity", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.quantity && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Quantity Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div
                      className={!errors.rate ? "input-field" : "border-error"}
                    >
                      <label>Rate *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("rate", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                    {errors.rate && (
                      <span style={{ fontSize: "14px", color: "red" }}>
                        Rate Required
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <FormControl variant="standard" className="form-control">
                    <div className={"input-field"}>
                      <label>Disc</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("disc", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="standard" className="form-control">
                    <div className={"input-field"}>
                      <label>Value</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("value", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    sx={{ margin: "20px 0" }}
                    type="submit"
                    className="btn btn-tertiary"
                  >
                    <p>Add</p>
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <Button sx={{ margin: "20px 0" }} className="btn btn-cancel">
                    <p>Cancel</p>
                  </Button>
                </Grid>
              </Grid> */}
            </FormGroup>
          </form>
        </Box>
        <Box sx={{ margin: "15px 0" }} className="card">
          <Box className="">
            {/* <Grid container spacing={2}>
              <Grid item xs={1}>
                <Button
                  sx={{ margin: "0 0 20px 0" }}
                  type="submit"
                  className="btn btn-tertiary"
                  onClick={addRow}
                >
                  <FiPlusCircle /> &nbsp;
                  <p>Add</p>
                </Button>
              </Grid>
            </Grid> */}
            <TableContainer className="table-wrapper">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Sl.</TableCell>
                    {/* <TableCell>Item ID</TableCell> */}
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Dis %</TableCell>
                    {/* <TableCell>Tax %</TableCell> */}
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
                              options={["spa", "foot spa"]}
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Service"
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  // error={!!error}
                                  // helperText={error?.message ? error.message : ""}
                                />
                              )}
                            />
                          )}
                          rules={{
                            required: "Please Enter Service",
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
                            <FormControl
                              style={{ width: "60px" }}
                              size="small"
                              variant="standard"
                            >
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
                            required: "Please enter Quantity",
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
                            required: "Please enter Rate",
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
                            required: "Please enter Discount",
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
                              style={{ width: "80px" }}
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
                  {/* {rows.length ? (
                    rows.map((row, index) => {
                      return (
                        <>
                          <TableRow key={row.id}>
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.itemId}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].itemId = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.itemName}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].itemName = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.discount}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].discount = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.tax}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].tax = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.quantity}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].quantity = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.rate}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].rate = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <input
                                style={{ width: "120px" }}
                                type="text"
                                placeholder=""
                                value={row.value}
                                onChange={(e) => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].value = e.target.value;
                                  setRows(updatedRows);
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="danger"
                                size="small"
                                onClick={() => removeRow(row.id)}
                              >
                                <FiMinusCircle />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }} colSpan={7}>
                        No Entry Found
                      </TableCell>
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Box className="card">
          <FormGroup className="form-field" sx={{ marginTop: "12px" }}>
            {/* <Grid container spacing={2}>
              <Grid item xs={1}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Discount %</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("discount", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Discount Amount</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("discount", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Exchange</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("exchange", {
                        required: true,
                        maxLength: 100,
                      })}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="standard" className="form-control">
                  <div className={"input-field"}>
                    <label>Net</label>
                    <Typography variant="h4" component="h2">
                      0.00
                    </Typography>
                  </div>
                </FormControl>
              </Grid>
            </Grid> */}
          </FormGroup>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "6px" }}>
          <Grid item xs={1}>
            <Button className="btn btn-tertiary">
              <FiPlusCircle /> &nbsp;
              <p>New</p>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button className="btn btn-tertiary">
              <FiSave /> &nbsp; <p>Save</p>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button className="btn btn-tertiary">
              <FiTrash2 /> &nbsp; <p>Delete</p>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button className="btn btn-tertiary">
              <FiPrinter /> &nbsp; <p>Print</p>
            </Button>
          </Grid>
          <Grid item xs={1.5}>
            <Button size="large" className="btn btn-tertiary">
              <FiPrinter /> &nbsp; <p>Re-Print</p>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button onClick={() => navigate(-1)} className="btn btn-tertiary">
              <FiXCircle /> &nbsp; <p>Close</p>
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CreateBill;
