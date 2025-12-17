import React, {useMemo} from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ActivityCard from "../../components/ActivityCard";
import TextField from "@mui/material/TextField";
import { PiUsersThree } from "react-icons/pi";
import { FaRegHandshake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { useHome } from "./hook/useHome";
import { TbFileInvoice } from "react-icons/tb";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import SalesExpense from "./component/saleExpense";
import LowSale from "./component/lowSale";
import ManagerSales from "./component/managerSales";
import AttendanceList from "./component/attendanceList"
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import { Controller } from "react-hook-form";


const Home = () => {
  const {
    fields,
    control,
    billList,
    isAdmin,
    details,
    dateRange,
    branchOptions,
    addRow,
    onSubmit,
    removeRow,
    handleFile,
    handleSubmit,
    handleFileUpload,
    handleDateChange,
    fetchDailyReport,
    handleBranchChange
  } = useHome();
  
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="card">
        {/* activity card */}
        <Box className="activity-card-wrapper mb-24">
          <Grid container spacing={3}>
            {/* <ActivityCard
              ActivityTitle={"Customer"}
              ActivityNumber={details?.counts?.customerCount}
              ActivityIcon={<PiUsersThree />}
              path="add-customer"
            />
            <ActivityCard
              ActivityTitle={"Staff"}
              ActivityNumber={details?.counts?.staffCount}
              ActivityIcon={<FaRegHandshake />}
              path="add-staff"
            />
            <ActivityCard
              ActivityTitle={"Service"}
              ActivityNumber={details?.counts?.serviceCount}
              ActivityIcon={<SlSettings />}
              path="add-service"
            /> */}
            {/* <ActivityCard
              ActivityTitle={"Bill"}
              ActivityNumber={0}
              ActivityIcon={<TbFileInvoice />}
              path="create-bill"
            /> */}
            <Grid item xs={12} md={4} sm={6}>
              <Controller
                name="titleName"
                control={control}
                render={({
                  field: { value, onChange},
                  fieldState: { error }
                }) => (
                  <FormControl
                  fullWidth
                    size="small"
                    variant="standard"
                    className="form-control"
                  >
                    <TextField
                      label="Title Name"
                      size="small"
                      name="titleName"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
                rules={{
                  required: 'Title Name is required'
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} sm={6}>
              <Controller
                name="gstNo"
                control={control}
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    variant="standard"
                    className="form-control"
                  >
                    <TextField
                      label="Gst No"
                      size="small"
                      name="gst"
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value.toUpperCase());
                      }}
                      onBlur={onBlur}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
                rules={{
                  required: "Please Enter Gst",
                  pattern: {
                    value:
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: "Enter Invalid Gst Number",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <Controller
                name="hsn"
                control={control}
                render={({
                  field: { value, onChange},
                  fieldState: { error }
                }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    variant="standard"
                    className="form-control"
                  >
                    <TextField
                      label="HSN Code"
                      size="small"
                      name="hsn"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
                rules={{
                  required: 'HSN is required'
                }}
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              {/* <Controller
                name="cashBillCount"
                control={control}
                render={({
                  field: { value, onChange},
                  fieldState: { error }
                }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    variant="standard"
                    className="form-control"
                  >
                    <TextField
                      label="Cash Bill Count"
                      size="small"
                      name="cashBillCount"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
                rules={{
                  required: 'Value is required'
                }}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <TableContainer className="table-wrapper">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={'3%'}></TableCell>
                      <TableCell width={'15%'}>Phone No.</TableCell>
                      <TableCell width={'35%'}>Address</TableCell>
                      <TableCell width={'10%'}>Cash Bill Count</TableCell>
                      <TableCell width={'10%'}>Bill Count</TableCell>
                      <TableCell width={'3%'}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Typography 
                            component="span"
                            variant="caption"
                            color="text"
                            fontWeight="medium"
                            onClick={addRow}
                            style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                          >
                            {fields.length === (index+1) ?
                              <FiPlusCircle size={26} />
                            : null}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`detail.${index}.phoneNumber`}
                            control={control}
                            render={({
                              field: { onBlur, onChange, value },
                              fieldState: { error },
                            }) => (
                              <FormControl
                              fullWidth
                                size="small"
                                variant="standard"
                                className="form-control"
                              >
                                <TextField
                                  type="number"
                                  label="Phone"
                                  size="small"
                                  name="phone"
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              </FormControl>
                            )}
                            rules={{
                              required: "Phone number is required",
                              maxLength: {
                                value: 10,
                                message: "Phone number must be 10 digit",
                              },
                              minLength: {
                                value: 10,
                                message: "Phone number must be 10 digit",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`detail.${index}.address`}
                            control={control}
                            render={({
                              field: { onBlur, onChange, value },
                              fieldState: { error },
                            }) => (
                              <FormControl size="small" fullWidth>
                                <TextField
                                  id="address"
                                  multiline
                                  rows={2}
                                  label="Address"
                                  size="small"
                                  name="Address"
                                  value={value}
                                  onChange={(e) =>
                                    onChange(e.target.value.toUpperCase())
                                  }
                                  onBlur={onBlur}
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              </FormControl>
                            )}
                            rules={{
                              required: "Address field required",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`detail.${index}.cashBillCount`}
                            control={control}
                            render={({
                              field: { onBlur, onChange, value },
                              fieldState: { error },
                            }) => (
                              <FormControl
                              fullWidth
                                size="small"
                                variant="standard"
                                className="form-control"
                              >
                                <TextField
                                  type="number"
                                  label="Cash Bill Count"
                                  size="small"
                                  name="cashBillCount"
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              </FormControl>
                            )}
                            rules={{
                              required: "Cash Bill Count is required",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`detail.${index}.billCount`}
                            control={control}
                            render={({
                              field: { onBlur, onChange, value },
                              fieldState: { error },
                            }) => (
                              <FormControl
                              fullWidth
                                size="small"
                                variant="standard"
                                className="form-control"
                              >
                                <TextField
                                  type="number"
                                  label="Total Bill Count"
                                  size="small"
                                  name="billCount"
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              </FormControl>
                            )}
                            rules={{
                              required: "Total Bill Count is required",
                            }}
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
            </Grid>
          </Grid>
        </Box>
      </Box>
      <br />
      <Box className="card">
        <Box className="activity-card-wrapper mb-24">
          <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Upload File</Typography>
          <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
        </Box>
      </Box>
      <br/>
      <Box className="card">
        <Box className="activity-card-wrapper mb-24">
          <Box>
            <Button
              className="btn btn-tertiary"
              type="submit"
            >
              Generate
            </Button>
          </Box>
        </Box>
      </Box>
      </form>
      {/* {isAdmin &&
        <>
          <Box className="card">
            <Box className="activity-card-wrapper mb-24">
              <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Top Sales Report</Typography>
              <br />
              <SalesExpense />
            </Box>
          </Box>
          <br />
          <Box className="card">
            <Box className="activity-card-wrapper mb-24">
              <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Low Sales Report</Typography>
              <br />
              <LowSale />
            </Box>
          </Box>
          <br />
          <Box className="card">
            <Box className="activity-card-wrapper mb-24">
              <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Manager Sales Report</Typography>
              <br />
              <ManagerSales />
            </Box>
          </Box>
          <br />
          <Box className="card">
            <Box className="activity-card-wrapper mb-24">
              <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Attendance</Typography>
              <br />
              <AttendanceList />
            </Box>
          </Box>

        </>
      }
      <br />
      {isAdmin &&
        <Box className="card">
          <Box className="activity-card-wrapper mb-24">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <DateRangePicker value={dateRange} onChange={handleDateChange} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  freeSolo
                  size="small"
                  disablePortal
                  multiple
                  id="Branch"
                  options={branchOptions || []}
                  getOptionLabel={(option) => option.label}
                  // value={branch}
                  onChange={(event, newValue) => handleBranchChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Branch" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button className="btn btn-tertiary" onClick={fetchDailyReport}>Search</Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <br />
              <TableContainer className="table-wrapper">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Branch Name</TableCell>
                      <TableCell>Total Customer</TableCell>
                      <TableCell>Total Member</TableCell>
                      <TableCell>Cash Sales</TableCell>
                      <TableCell>UPI Sales</TableCell>
                      <TableCell>Card Sales</TableCell>
                      <TableCell>Total Sales</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billList && billList.map((bill, index) => (
                      <TableRow key={"bill_report" + index}>
                        <TableCell>{(index + 1)}</TableCell>
                        <TableCell>{bill?.user?.lastName}</TableCell>
                        <TableCell>{bill?.totalCustomer}</TableCell>
                        <TableCell>{bill?.membershipCustomerCount}</TableCell>
                        <TableCell>({bill?.cashCustomerCount}) {bill?.totalCash}/-</TableCell>
                        <TableCell>({bill?.upiCustomerCount}) {bill?.totalUPI}/-</TableCell>
                        <TableCell>({bill?.cardCustomerCount}) {bill?.totalCard}/-</TableCell>
                        <TableCell>{(bill?.totalCash) + (bill?.totalUPI) + (bill?.totalCard)}/-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </Grid>
          </Box>
        </Box>
      } */}


    </>
  );
};

export default Home;
