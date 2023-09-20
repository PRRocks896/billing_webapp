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
import { styled } from "@mui/material/styles";
import React from "react";
import { Controller } from "react-hook-form";
import {
  FiMinusCircle,
  FiPlusCircle,
  FiPrinter,
  FiSave,
  // FiTrash2,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";
import { useAddEditCreateBill } from "./hook/useAddEditCreateBill";
import { Fade, Modal, Typography } from "@mui/material";
import AddCustomer from "./AddCustomer";
import AddStaff from "./AddStaff";
import CustomerBillData from "../../components/CustomerBillData";

const StyledTableCell = styled(TableCell)({
  padding: 0,
  margin: 0,
});

const AddEditBill = ({ tag }) => {
  const {
    fields,
    control,
    paymentTypeOptions,
    customersOptions,
    staffOptions,
    serviceOptions,
    // reset,
    addRow,
    onSubmit,
    navigate,
    removeRow,
    handleSubmit,
    calculateTotal,
    isSaveModalOpen,
    setIsSaveModalOpen,
    dontSaveHandler,

    isCustomerModalOpen,
    setIsCustomerModalOpen,
    fetchCustomersData,

    isStaffModalOpen,
    setIsStaffModalOpen,
    fetchStaffData,
    setQtyRateValuesHandler,
    printHandler,
    handlePaymentChange,
    isCardSelect,
    getValues,

    setStaffSelectedHandler,
    setCustomerSelectedHandler,
    changeCustomerPhoneHandler,

    isCustomerBillDataModalOpen,
    setIsCustomerBillDataModalOpen,
  } = useAddEditCreateBill(tag);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="card">
          {/* bill no, payment type, customer, sales person selection */}
          <FormGroup className="form-field">
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} sm={6}>
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
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3} sm={6}>
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
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please Select Date",
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} sm={6}>
                <Controller
                  name="roomNo"
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
                        label="Room No*"
                        size="small"
                        name="roomNo"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                  rules={{
                    required: "Please enter Room No",
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} sm={6}>
                <Controller
                  control={control}
                  name={`staffID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <Box
                        sx={{ display: "grid", gridTemplateColumns: "5fr 1fr" }}
                      >
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
                              label="Staff Person"
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                        <Button
                          type="button"
                          className="btn"
                          onClick={() => setIsStaffModalOpen(true)}
                        >
                          <FiPlusCircle />
                        </Button>
                      </Box>
                    );
                  }}
                  rules={{
                    required: "Please Select Staff Person",
                  }}
                />
              </Grid>
              {/* --------------------------------------------------- */}
              <Grid item xs={12} md={4} sm={6}>
                <Controller
                  control={control}
                  name={`customerID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "5fr 1fr 1fr",
                        }}
                      >
                        <Autocomplete
                          size="small"
                          disablePortal
                          id="customerID"
                          label="customerID"
                          options={customersOptions}
                          value={value}
                          onBlur={onBlur}
                          onChange={(event, newValue) => {
                            changeCustomerPhoneHandler(newValue);
                            onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Customer Ph No."
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                        <Button
                          sx={{ padding: "0px" }}
                          type="button"
                          className="btn"
                          onClick={() => setIsCustomerModalOpen(true)}
                        >
                          <FiPlusCircle />
                        </Button>
                        <Button
                          sx={{ padding: "0px" }}
                          type="button"
                          className="btn"
                          onClick={() => {
                            if (getValues("customerID")) {
                              setIsCustomerBillDataModalOpen(true);
                            }
                          }}
                        >
                          <FiSearch />
                        </Button>
                      </Box>
                    );
                  }}
                  rules={{
                    required: "Please Select Customer Ph No.",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3} sm={6}>
                <Controller
                  name="Phone"
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      className="form-control"
                    >
                      <TextField
                        disabled
                        label="Customer Name"
                        size="small"
                        name="Phone"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3} sm={6}>
                <Controller
                  control={control}
                  name={`paymentID`}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      disableClearable
                      size="small"
                      disablePortal
                      id="paymentID"
                      options={paymentTypeOptions}
                      value={value}
                      onBlur={onBlur}
                      onChange={(event, newValue) => [
                        onChange(newValue),
                        handlePaymentChange(newValue),
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                  rules={{
                    required: "Please Select Payment",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2} sm={6}>
                {isCardSelect ? (
                  <FormControl
                    size="small"
                    variant="standard"
                    className="form-control"
                  >
                    <TextField
                      type="text"
                      label={getValues("paymentID")?.label}
                      size="small"
                      name="cardNo"
                      disabled
                    />
                  </FormControl>
                ) : (
                  <Controller
                    name="cardNo"
                    control={control}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <FormControl
                          size="small"
                          variant="standard"
                          className="form-control"
                        >
                          <TextField
                            type="text"
                            label={isCardSelect ? value : "CardNo"}
                            size="small"
                            name="cardNo"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error?.message}
                            disabled={isCardSelect}
                          />
                        </FormControl>
                      );
                    }}
                    rules={{
                      required: "Please enter card no",
                      maxLength: {
                        value: 4,
                        message: "Enter last 4 digit of card",
                      },
                      minLength: {
                        value: 4,
                        message: "Enter last 4 digit of card",
                      },
                      pattern: { value: /^[0-9]+$/, message: "Only digit" },
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        {/* service table */}
        <Box sx={{ margin: "15px 0" }} className="card">
          <TableContainer className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell width={"3%"}></StyledTableCell>
                  <StyledTableCell width={"2%"}>Sl.</StyledTableCell>
                  <StyledTableCell width={"53%"}>Item Name</StyledTableCell>
                  <StyledTableCell width={"10%"}>Quantity</StyledTableCell>
                  <StyledTableCell width={"10%"}>Rate</StyledTableCell>
                  <StyledTableCell width={"10%"}>Dis %</StyledTableCell>
                  <StyledTableCell width={"10%"}>Value</StyledTableCell>
                  <StyledTableCell width={"2%"}></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields?.map((field, index) => (
                  <TableRow key={field.id}>
                    <StyledTableCell>
                      {fields.length === index + 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            addRow();
                            calculateTotal(index);
                          }}
                        >
                          <FiPlusCircle /> &nbsp;
                        </Button>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <TableCell>
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
                            value={value}
                            onBlur={onBlur}
                            onChange={(event, newValue) => [
                              onChange(newValue),
                              setQtyRateValuesHandler(newValue.value, index),
                            ]}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Item"
                                error={!!error}
                                helperText={error?.message}
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
                          <FormControl
                            size="small"
                            variant="standard"
                            className="form-control"
                          >
                            <TextField
                              size="small"
                              name="quantity"
                              className="text-center"
                              value={value}
                              onChange={(e) => [
                                onChange(e),
                                calculateTotal(index),
                              ]}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "Required Qty",
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
                            size="small"
                            variant="standard"
                            className="form-control"
                          >
                            <TextField
                              size="small"
                              name="rate"
                              className="text-center"
                              value={value}
                              onChange={(e) => [
                                onChange(e),
                                calculateTotal(index),
                              ]}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "Required Rate",
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
                          <FormControl size="small" variant="standard">
                            <TextField
                              size="small"
                              name="discount"
                              className="text-center"
                              value={value}
                              onChange={(e) => [
                                onChange(e),
                                calculateTotal(index),
                              ]}
                              onBlur={onBlur}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </FormControl>
                        )}
                        rules={{
                          required: "Required Discount",
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
                        render={({ field: { onBlur, onChange, value } }) => (
                          <FormControl size="small" variant="standard">
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
                          onClick={() => {
                            removeRow(index);
                          }}
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

        {/* discount and grand total */}
        <Box className="card">
          <FormGroup className="form-field" sx={{ marginTop: "12px" }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Controller
                  name="grandTotal"
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
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
          {/* {tag === "edit" ? (
            ""
          ) : (
            <Grid item xs={1.5}>
              <Button className="btn btn-tertiary" onClick={() => reset()}>
                <FiPlusCircle /> &nbsp;
                <p>New</p>
              </Button>
            </Grid>
          )} */}
          <Grid item xs={1.5}>
            <Button type="submit" className="btn btn-tertiary">
              <FiSave /> &nbsp; <p>Save</p>
            </Button>
          </Grid>
          {/* {tag === "edit" ? (
            ""
          ) : (
            <Grid item xs={1.5}>
              <Button onClick={reset} className="btn btn-tertiary">
                <FiTrash2 /> &nbsp; <p>Delete</p>
              </Button>
            </Grid>
          )} */}
          <Grid item xs={1.5}>
            <Button
              className="btn btn-tertiary"
              onClick={handleSubmit(printHandler)}
            >
              <FiPrinter /> &nbsp; <p>Print</p>
            </Button>
          </Grid>
          {/* <Grid item xs={1.5}>
            <Button
              size="large"
              className="btn btn-tertiary"
              sx={{ width: "max-content" }}
            >
              <FiPrinter /> &nbsp; <p>Re-Print</p>
            </Button>
          </Grid> */}
          <Grid item xs={1.5}>
            <Button
              onClick={() => navigate("/bill")}
              className="btn btn-tertiary"
            >
              <FiXCircle /> &nbsp; <p>Close</p>
            </Button>
          </Grid>
        </Grid>
      </form>

      <>
        <Modal
          disableEscapeKeyDown
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isSaveModalOpen}
          closeAfterTransition
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={isSaveModalOpen}>
            <Box className="modal-wrapper modal-bg">
              <Typography
                variant="h6"
                component="h6"
                className="text-black modal-title"
              >
                Save Bill
              </Typography>
              <Box className="modal-body">
                <Box className="confirmation-text">
                  <Typography paragraph>
                    Do you want to save the changes?
                  </Typography>
                </Box>
              </Box>
              <Box className="modal-footer">
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <Button className="btn btn-tertiary">Save</Button>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Button
                      className="btn btn-cancel"
                      onClick={() => dontSaveHandler(false)}
                    >
                      Don't Save
                    </Button>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Button
                      className="btn btn-cancel"
                      onClick={() => setIsSaveModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </>

      <AddCustomer
        isCustomerModalOpen={isCustomerModalOpen}
        setIsCustomerModalOpen={setIsCustomerModalOpen}
        fetchCustomersData={fetchCustomersData}
        setCustomerSelectedHandler={setCustomerSelectedHandler}
      />

      <AddStaff
        isStaffModalOpen={isStaffModalOpen}
        setIsStaffModalOpen={setIsStaffModalOpen}
        fetchStaffData={fetchStaffData}
        setStaffSelectedHandler={setStaffSelectedHandler}
      />

      {isCustomerBillDataModalOpen && (
        <CustomerBillData
          customerPhone={getValues("customerID")}
          isCustomerBillDataModalOpen={isCustomerBillDataModalOpen}
          setIsCustomerBillDataModalOpen={setIsCustomerBillDataModalOpen}
        />
      )}
    </>
  );
};

export default AddEditBill;
