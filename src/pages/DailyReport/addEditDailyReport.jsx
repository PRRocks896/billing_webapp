import React from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";

import { useAddEditDailyReportHook } from "./hooks/useAddEditDailyReport.hooks";

const AddEditDailyReport = ({ tag }) => {
    const {
        fields,
        isAdmin,
        control,
        branchList,
        isSubmitting,
        totalCashSalePlusOpeningBalance,
        onSubmit,
        handleSubmit,
        cancelHandler,
        handleAddField,
        handleRemoveField,
        handleTotalExpense
    } = useAddEditDailyReportHook(tag);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="card">
                <FormGroup className="form-field">
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6} xl={6} sm={12}>
                            <Grid container gap={2}>
                                <Grid item xs={12}>
                                    {isAdmin &&
                                        <Controller
                                            name="userID"
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <Autocomplete
                                                    freeSolo
                                                    size="small"
                                                    id="userID"
                                                    isOptionEqualToValue={(option, value) => option?.id === value}
                                                    getOptionLabel={(option) => option.branchName ? option.branchName : ''}
                                                    options={branchList || []}
                                                    value={branchList?.find((option) => option.id === value) ?? ''}
                                                    onChange={(_event, value) => {
                                                        if(value) {
                                                            onChange(value?.id)
                                                        } else {
                                                            onChange(null);
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
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                            rules={{
                                                required: 'Select Branch'
                                            }}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="dailyReportDate"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="date"
                                                    label="Date"
                                                    size="small"
                                                    name="date"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={!!error}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Select Date'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="managerName"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Manager Name"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Manager Name'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalStaffPresent"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Staff Present "
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Total Staff Present',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalCustomer"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Customer"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Total customer',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalMemberGuest"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Member Guest"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="openBalance"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Opening Balance"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Opening Balance',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="cashSale"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Cash Sale"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Cash Sale',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="cardSale"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Card Sale"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Card Sale',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="upiSale"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="UPI Payment"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter UPI Payment',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="dealsAppSale"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Deals App Sale"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Deals App Sale',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalSales"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Sales"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Total Sales',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <TextField
                                            type="text"
                                            label="Total Cash Sale + Opening Balance"
                                            size="small"
                                            value={totalCashSalePlusOpeningBalance || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="tipsCard"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Tips Card Amount"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Tips Card Amount',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalCard"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="After 25% Paid to Therapist"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Total Card',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="totalExpenses"
                                        control={control}
                                        render={({
                                            field: { value },
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Expense"
                                                    size="small"
                                                    value={value || ''}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="nextDayCash"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Next Day Cash"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => [onChange(e.target.value), handleTotalExpense()]}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Next Day Cash',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Controller
                                        name="totalCash"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Total Cash"
                                                    size="small"
                                                    value={value}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <Controller
                                        name="grandCash"
                                        control={control}
                                        render={({ field: {value}}) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Grand Total Cash"
                                                    size="small"
                                                    value={value}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="salonCustomerCash"
                                        control={control}
                                        render={({
                                            field: { onBlur, onChange, value },
                                            fieldState: { error }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Salon Customer Cash"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    error={Boolean(error)}
                                                    helperText={error?.message ? error.message : ""}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: 'Enter Salon Customer Cash',
                                            pattern: {
                                                value: /^[0-9]/,
                                                message: "Enter only digit",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="cashInCover"
                                        control={control}
                                        render={({
                                            field: { value }
                                        }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    type="text"
                                                    label="Cash In Cover"
                                                    size="small"
                                                    value={value}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
                                                />
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} xl={6} sm={12}>
                            <Typography variant="subtitle2" marginLeft={4} fontSize={22} fontWeight={600}>Expense List:</Typography>
                            <Box sx={{
                                marginLeft: 4,
                                height: '350px',
                                // maxHeight: "350px", 
                                overflowY: "scroll",
                                border: '1px solid #000',
                                padding: '8px',
                                borderRadius: '5px'
                            }}>
                                {fields.map((item, index) => (
                                    <Box id={item.id} key={item.id} sx={{paddingBottom: '8px', display: "grid", gridTemplateColumns: "1fr 14fr 1fr"}}>
                                        <Typography 
                                            component="span"
                                            variant="caption"
                                            color="text"
                                            fontWeight="medium"
                                            onClick={handleAddField}
                                            style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                        >
                                            {fields.length === (index+1) ?
                                                <FiPlusCircle size={26} />
                                            : null}
                                        </Typography>
                                        <Box sx={{
                                            paddingLeft: 2,
                                            paddingRight: 2
                                        }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={8}>
                                                    <Controller
                                                        name={`expense.${index}.description`}
                                                        control={control}
                                                        render={({ field: {onBlur, onChange, value }, fieldState: { error } }) => (
                                                            <FormControl size="small" fullWidth>
                                                                <TextField
                                                                    type="text"
                                                                    label="Description"
                                                                    size="small"
                                                                    value={value}
                                                                    onChange={(e) => onChange(e.target.value)}
                                                                    onBlur={onBlur}
                                                                    error={Boolean(error)}
                                                                    helperText={error?.message ? error.message : ""}
                                                                />
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Controller
                                                        name={`expense.${index}.amount`}
                                                        control={control}
                                                        render={({ field: {onBlur, onChange, value }, fieldState: { error } }) => (
                                                            <FormControl size="small" fullWidth>
                                                                <TextField
                                                                    type="text"
                                                                    label="Amount"
                                                                    size="small"
                                                                    value={value}
                                                                    onChange={(e) => [onChange(e.target.value), handleTotalExpense()]}
                                                                    onBlur={onBlur}
                                                                    error={Boolean(error)}
                                                                    helperText={error?.message ? error.message : ""}
                                                                />
                                                            </FormControl>
                                                        )}
                                                        rules={{
                                                            // required: 'Enter Amount',
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Typography 
                                            component="span"
                                            variant="caption"
                                            color="text"
                                            fontWeight="medium"
                                            onClick={() => handleRemoveField(index)}
                                            style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center", color: 'red' }}
                                        >
                                            {fields.length !== 1 ?
                                                <FiMinusCircle size={26} />
                                            : null}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Typography variant="subtitle2" marginLeft={4} fontSize={22} fontWeight={600}>Cash Detail:</Typography>
                            <TableContainer sx={{
                                marginLeft: 2,
                                marginTop: 2
                            }}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell width={'25px'}>
                                                <Typography variant="subtitle2" fontSize={26} fontWeight={600}>500</Typography>
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>X</span>
                                            </TableCell>
                                            <TableCell width={'50px'}>
                                                <Controller
                                                    name="fiveHundred"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                type="text"
                                                                label="Qty"
                                                                size="small"
                                                                value={value}
                                                                onChange={(e) => onChange(e.target.value)}
                                                                onBlur={onBlur}
                                                                error={Boolean(error)}
                                                                helperText={error?.message ? error.message : ""}
                                                            />
                                                        </FormControl>
                                                    )}
                                                    rules={{
                                                        required: 'Enter Count'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>=</span>
                                            </TableCell>
                                            <TableCell width={'100px'}>
                                                <Controller
                                                    name="fiveHundred"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small">
                                                            <TextField
                                                                type="text"
                                                                label="Total"
                                                                size="small"
                                                                value={500 * (parseInt(value) || 0)}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                fullWidth
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell width={'25px'}>
                                                <Typography variant="subtitle2" fontSize={26} fontWeight={600}>200</Typography>
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>X</span>
                                            </TableCell>
                                            <TableCell width={'50px'}>
                                                <Controller
                                                    name="twoHundred"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                type="text"
                                                                label="Qty"
                                                                size="small"
                                                                value={value}
                                                                onChange={(e) => onChange(e.target.value)}
                                                                onBlur={onBlur}
                                                                error={Boolean(error)}
                                                                helperText={error?.message ? error.message : ""}
                                                            />
                                                        </FormControl>
                                                    )}
                                                    rules={{
                                                        required: 'Enter Count'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>=</span>
                                            </TableCell>
                                            <TableCell width={'100px'}>
                                                <Controller
                                                    name="twoHundred"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small">
                                                            <TextField
                                                                type="text"
                                                                label="Total"
                                                                size="small"
                                                                value={200 * (parseInt(value) || 0)}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                fullWidth
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell width={'25px'}>
                                                <Typography variant="subtitle2" fontSize={26} fontWeight={600}>100</Typography>
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>X</span>
                                            </TableCell>
                                            <TableCell width={'50px'}>
                                                <Controller
                                                    name="oneHundred"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                type="text"
                                                                label="Qty"
                                                                size="small"
                                                                value={value}
                                                                onChange={(e) => onChange(e.target.value)}
                                                                onBlur={onBlur}
                                                                error={Boolean(error)}
                                                                helperText={error?.message ? error.message : ""}
                                                            />
                                                        </FormControl>
                                                    )}
                                                    rules={{
                                                        required: 'Enter Count'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>=</span>
                                            </TableCell>
                                            <TableCell width={'100px'}>
                                                <Controller
                                                    name="oneHundred"
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                    }) => (
                                                        <FormControl size="small">
                                                            <TextField
                                                                type="text"
                                                                label="Total"
                                                                size="small"
                                                                value={100 * (parseInt(value) || 0)}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                fullWidth
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell width={'25px'}>
                                                <Typography variant="subtitle2" fontSize={26} fontWeight={600}>50</Typography>
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>X</span>
                                            </TableCell>
                                            <TableCell width={'50px'}>
                                                <Controller
                                                    name="fifty"
                                                    control={control}
                                                    render={({
                                                        field: { onBlur, onChange, value },
                                                        fieldState: { error }
                                                    }) => (
                                                        <FormControl size="small" fullWidth>
                                                            <TextField
                                                                type="text"
                                                                label="Qty"
                                                                size="small"
                                                                value={value}
                                                                onChange={(e) => onChange(e.target.value)}
                                                                onBlur={onBlur}
                                                                error={Boolean(error)}
                                                                helperText={error?.message ? error.message : ""}
                                                            />
                                                        </FormControl>
                                                    )}
                                                    rules={{
                                                        required: 'Enter Count'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell width={'5px'}>
                                                <span>=</span>
                                            </TableCell>
                                            <TableCell width={'100px'}>
                                                <Controller
                                                    name="fifty"
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                    }) => (
                                                        <FormControl size="small">
                                                            <TextField
                                                                type="text"
                                                                label="Total"
                                                                size="small"
                                                                value={50 * (parseInt(value) || 0)}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                fullWidth
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </FormGroup>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'end',
                }}>
                    <Button sx={{ marginRight: '8px'}} disabled={isSubmitting} type="submit" className="btn btn-tertiary">
                        {tag === "add" ? "Save" : "Update"}
                    </Button>
                    <Button className="btn btn-cancel" onClick={cancelHandler}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </form>
    )
}

export default AddEditDailyReport;