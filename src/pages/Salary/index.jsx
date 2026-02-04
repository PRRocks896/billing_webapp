import { Controller } from "react-hook-form";

import { FiTrash2 } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";

import useSalaryHooks from "./hooks/useSalary.hook";

const Salary = () => {
    const {
        page,
        year,
        count,
        rights,
        month,
        fields,
        control,
        isAdmin,
        branchList,
        companyList,
        visibleRows,
        isSubmitting,
        isDeleteModalOpen,
        setYear,
        setMonth,
        download,
        onSubmit,
        getValues,
        resetForm,
        searchList,
        handleRemove,
        handleSubmit,
        deleteHandler,
        handleChangePage,
        handleCalculation,
        setSelectedBranch,
        setSelectedCompany,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        handleValidateIfscCode,
        handleLeaveCalculation,
        handleCheckAdvanceMoreThenSalary
    } = useSalaryHooks();

    return (
        <>
            <Box className="card">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="month">Select Month</InputLabel>
                            <Select
                                size="small"
                                label="Select Month"
                                labelId="month"
                                value={month || ''}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <MenuItem value={1}>Jan</MenuItem>
                                <MenuItem value={2}>Feb</MenuItem>
                                <MenuItem value={3}>March</MenuItem>
                                <MenuItem value={4}>Apr</MenuItem>
                                <MenuItem value={5}>May</MenuItem>
                                <MenuItem value={6}>June</MenuItem>
                                <MenuItem value={7}>July</MenuItem>
                                <MenuItem value={8}>Aug</MenuItem>
                                <MenuItem value={9}>Sept</MenuItem>
                                <MenuItem value={10}>Oct</MenuItem>
                                <MenuItem value={11}>Nov</MenuItem>
                                <MenuItem value={12}>Dec</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <FormControl size="small" fullWidth>
                            <TextField
                                variant="outlined"
                                label="Year"
                                size="small"
                                name="year"
                                value={year}
                                onChange={(e) => {
                                    if (e.target.value.length < 5) {
                                        setYear(e.target.value);
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            id="companyID"
                            disablePortal
                            // multiple
                            // isOptionEqualToValue={(option, value) => option?.id === value}
                            getOptionLabel={(option) => option.companyName ? option.companyName : ''}
                            options={companyList || []}
                            // value={branchList?.find((option) => option.id === selectedBranch) ?? ''}
                            onChange={(_event, value) => {
                                if (value && typeof value === 'object') {
                                    setSelectedCompany(value.id);
                                    // fetchBranch();
                                } else {
                                    setSelectedCompany(null);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.companyName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Company"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            id="userID"
                            disablePortal
                            // isOptionEqualToValue={(option, value) => option?.id === value}
                            getOptionLabel={(option) => option.branchName ? option.branchName : ''}
                            options={branchList || []}
                            // value={branchList?.find((option) => option.id === selectedBranch) ?? ''}
                            onChange={(_event, value) => {
                                if (value) {
                                    setSelectedBranch(value?.id)
                                } else {
                                    setSelectedBranch(null);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.branchName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Branch"
                                />
                            )}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={2}>
                        <Button fullWidth className="btn btn-tertiary" onClick={download}>Export</Button>
                    </Grid> */}
                </Grid>
                <br />
                <Button className="btn btn-tertiary" style={{ width: '100%' }} onClick={searchList}>Get Staff Detail</Button>
            </Box>
            <br />
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}>
                <Box className="card">
                    <TableContainer className="table-wrapper">
                        <Table style={{ width: '100%' }}>
                            <TableHead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <TableRow>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Pet Name</TableCell>
                                    <TableCell sx={{ width: '50px', minWidth: '50px' }}>Left</TableCell>
                                    <TableCell sx={{ width: '50px', minWidth: '50px' }}>Paid</TableCell>
                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Staff Type</TableCell>
                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Total Days</TableCell>
                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Working Days</TableCell>
                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Week Off</TableCell>
                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Leave</TableCell>
                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Salary</TableCell>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Expense Cut</TableCell>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Advance Taken</TableCell>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Advance Given</TableCell>
                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Leave Cut</TableCell>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Sub Salary</TableCell>
                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Tax</TableCell>
                                    <TableCell sx={{ width: '150px', minWidth: '150px' }}>Payable Salary</TableCell>
                                    <TableCell sx={{ width: '250px', minWidth: '350px' }}>Acc. Holder Name</TableCell>
                                    <TableCell sx={{ width: '200px', minWidth: '250px' }}>Acc. Number</TableCell>
                                    <TableCell sx={{ width: '175px', minWidth: '250px' }}>IFSC Code</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields?.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            {item.staffName}
                                        </TableCell>
                                        <TableCell sx={{ width: '50px', minWidth: '50px' }}>
                                            <Controller
                                                name={`staff.${index}.isLeft`}
                                                control={control}
                                                render={({ field: {value, onChange}, fieldState: { error }}) => (
                                                    <Switch
                                                        // style={switchStyles}
                                                        checked={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '50px', minWidth: '50px' }}>
                                            <Controller
                                                name={`staff.${index}.isPaid`}
                                                control={control}
                                                render={({ field: {value, onChange}, fieldState: { error }}) => (
                                                    <Switch
                                                        // style={switchStyles}
                                                        checked={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '120px', minWidth: '120px' }}>{item.employeeType}</TableCell>
                                        <TableCell sx={{ width: '100px', minWidth: '100px' }}>{item.totalDays}</TableCell>
                                        <TableCell sx={{ width: '120px', minWidth: '120px' }}>
                                            {/* {item.workingDays} */}
                                            <Controller
                                                name={`staff.${index}.workingDays`}
                                                control={control}
                                                render={({ field: { value }}) => (
                                                    <>{value}</>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '120px', minWidth: '120px' }}>
                                            <Controller
                                                name={`staff.${index}.weekOff`}
                                                control={control}
                                                render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            size="small"
                                                            labelId="weekOff"
                                                            value={value || ''}
                                                            onChange={onChange}
                                                            onBlur={onBlur}
                                                        >
                                                            <MenuItem value={0} selected={parseInt(value) === 0}>0</MenuItem>
                                                            <MenuItem value={1} selected={parseInt(value) === 1}>1</MenuItem>
                                                            <MenuItem value={2} selected={parseInt(value) === 2}>2</MenuItem>
                                                            <MenuItem value={3} selected={parseInt(value) === 3}>3</MenuItem>
                                                            <MenuItem value={4} selected={parseInt(value) === 4}>4</MenuItem>
                                                        </Select>
                                                        {error && error.message &&
                                                            <FormHelperText error={true}>{error.message}</FormHelperText>
                                                        }
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '100px', minWidth: '100px' }}>
                                            <Controller
                                                name={`staff.${index}.leave`}
                                                control={control}
                                                rules={{
                                                    required: "Leave is required",
                                                    validate: (value) => {
                                                        const regex = /^[0-9]*$/;
                                                        return regex.test(value) || 'Invalid Leave';
                                                    }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            value={value}
                                                            id={`staff.${index}.leave`}
                                                            onChange={(e) => {
                                                                onChange(e.target.value);
                                                                handleCalculation(index);
                                                            }}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '120px', minWidth: '120px' }}>{item.salary}</TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            <Controller
                                                name={`staff.${index}.expense`}
                                                control={control}
                                                rules={{
                                                    required: "Expense cut is required",
                                                    validate: (value) => {
                                                        const regex = /^[0-9]*$/;
                                                        return regex.test(value) || 'Invalid expense cut';
                                                    }
                                                }}
                                                render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            value={value}
                                                            id={`staff.${index}.expense`}
                                                            onChange={(e) => {
                                                                onChange(e.target.value)
                                                                handleCalculation(index)
                                                            }}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>{item.takenAdvance}</TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            <Controller
                                                name={`staff.${index}.advance`}
                                                control={control}
                                                rules={{
                                                    required: "Advance is required",
                                                    pattern: {
                                                        value: /^[0-9]*$/,
                                                        message: "Invalid advance"
                                                    },
                                                    validate: (value) => {
                                                        return handleCheckAdvanceMoreThenSalary(value, index)
                                                    }
                                                }}
                                                render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            value={value}
                                                            id={`staff.${index}.advance`}
                                                            onChange={(e) => {
                                                                onChange(e.target.value)
                                                                handleCalculation(index)
                                                            }}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '120px', minWidth: '120px' }}>
                                            {/* {item.leaveCut} */}
                                            <Controller
                                                name={`staff.${index}.leaveCut`}
                                                control={control}
                                                render={({ field: { value }}) => (
                                                    <>{value}</>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            <Controller
                                                name={`staff.${index}.subSalary`}
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            value={value}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '100px', minWidth: '100px' }}>{item.tax}</TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            <Controller
                                                name={`staff.${index}.payableSalary`}
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            value={value}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '250px', minWidth: '350px' }}>
                                            <Controller
                                                name={`staff.${index}.accountHolderName`}
                                                control={control}
                                                rules={{ required: 'Account holder name is required' }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            error={!!error}
                                                            onChange={onChange}
                                                            value={value || ''}
                                                            placeholder="Enter Account Holder Name"
                                                            helperText={error ? error.message : null}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '200px', minWidth: '250px' }}>
                                            <Controller
                                                name={`staff.${index}.accountNumber`}
                                                control={control}
                                                rules={{ required: 'Account number is required' }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            error={!!error}
                                                            onChange={onChange}
                                                            value={value || ''}
                                                            placeholder="Enter Account Number"
                                                            helperText={error ? error.message : null}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '150px', minWidth: '150px' }}>
                                            <Controller
                                                name={`staff.${index}.ifscCode`}
                                                control={control}
                                                rules={{
                                                    required: 'IFSC code is required',
                                                    validate: async (value) => {
                                                        if (!value) return true; // Skip validation if empty (required will handle it)
                                                        return await handleValidateIfscCode(value);
                                                    }
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <FormControl fullWidth size="small">
                                                        <TextField
                                                            size="small"
                                                            error={!!error}
                                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                            value={value || ''}
                                                            placeholder="Enter IFSC Code"
                                                            helperText={error ? error.message : null}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemove(index)}
                                            >
                                                <FiTrash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <br />
                <Box className="card">
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item xs={12} sm={2}>
                            <Button fullWidth disabled={isSubmitting} className="btn btn-primary" onClick={resetForm}>Reset</Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button fullWidth disabled={isSubmitting} className="btn btn-tertiary" type="submit">
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </>
    )
}

export default Salary;