import React from "react";
import { Controller } from "react-hook-form";
// import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
// import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import useAddEditLaundryReceiver from "./hook/useAddEditLaundryReceiver";

const AddEditLaundryReceiver = ({ tag }) => {
    const {
        control,
        fields,
        isSubmitting,
        laundryItemOption,
        laundryWasherOption,
        onSubmit,
        handleSubmit,
        cancelHandler,
    } = useAddEditLaundryReceiver(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="receiveDate"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                type="date"
                                                variant="outlined"
                                                label="Receiver Date"
                                                size="small"
                                                name="date"
                                                value={value || new Date()}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                                // InputProps={{ readOnly: true }}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0],
                                                }}
                                                disabled
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select Date'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="givenDate"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                type="date"
                                                variant="outlined"
                                                label="Given Date"
                                                size="small"
                                                name="date"
                                                value={value || new Date()}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0],
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select Date',
                                        max: 'Future date is not allowed'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="laundryWasherID"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <Autocomplete
                                            freeSolo
                                            size="small"
                                            id="laundryWasherID"
                                            options={laundryWasherOption || []}
                                            getOptionLabel={(option) => option.label || ''}
                                            isOptionEqualToValue={(option, value) => option?.value === value}
                                            value={laundryWasherOption?.find((option) => option.value === value) ?? ''}
                                            // onBlur={onBlur}
                                            onChange={(_event, value) => {
                                                if (value) {
                                                    onChange(value?.value)
                                                } else {
                                                    onChange(null);
                                                }
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.label}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Laundry Washer"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                    rules={{
                                        required: 'Please Select Laundry Washer'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle2" fontSize={18} fontWeight={600}>Laundry Items</Typography>
                                {fields.map((item, index) => (
                                    <Grid container spacing={2} key={item.id} style={{ padding: '10px 0px' }}>
                                        {/* <Grid item xs={12} sm={0.5}> */}
                                            {/* {isEdit ? null :
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text"
                                                    fontWeight="medium"
                                                    onClick={addLaundryItem}
                                                    style={{ cursor: "pointer", alignSelf: "center" }}
                                                >
                                                    {fields.length === (index + 1) ?
                                                        <FiPlusCircle size={26} style={{ marginTop: '8px' }} />
                                                        : null}
                                                </Typography>
                                            } */}
                                        {/* </Grid> */}
                                        <Grid item xs={12} sm={5}>
                                            <Controller
                                                name={`detail.${index}.laundryItemID`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        size="small"
                                                        id={`detail.${index}.laundryItemID`}
                                                        options={laundryItemOption || []}
                                                        getOptionLabel={(option) => option.label || ''}
                                                        isOptionEqualToValue={(option, value) => option?.value === value}
                                                        value={laundryItemOption?.find((option) => option.value === value) ?? ''}
                                                        onChange={(_event, value) => {
                                                            if (value) {
                                                                onChange(value?.value)
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.value}>
                                                                {option.label}
                                                            </li>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Laundry Item"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                                disabled
                                                            />
                                                        )}
                                                    />
                                                )}
                                                rules={{
                                                    required: 'Please Select Laundry Item'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Controller
                                                name={`detail.${index}.price`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl size="small" fullWidth>
                                                        <TextField
                                                            size="small"
                                                            label="Price"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Price',
                                                    pattern: {
                                                        value: /^\d+(\.\d{1,2})?$/,
                                                        message: 'Please enter a valid price'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <Controller
                                                name={`detail.${index}.givenQty`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl size="small" fullWidth>
                                                        <TextField
                                                            size="small"
                                                            label="Given Qty"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Quantity'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <Controller
                                                name={`detail.${index}.pendingQty`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl size="small" fullWidth>
                                                        <TextField
                                                            size="small"
                                                            label="Pending Qty"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Quantity'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Controller
                                                name={`detail.${index}.receiveQty`}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl size="small" fullWidth>
                                                        <TextField
                                                            size="small"
                                                            label="Receive Qty"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            disabled={fields[index].pendingQty === 0}
                                                        />
                                                    </FormControl>
                                                )}
                                                rules={{
                                                    required: 'Please Enter Quantity',
                                                    max: { 
                                                        value: parseFloat(fields[index].pendingQty) || 0,
                                                        message: `Receive Qty cannot be greater than ${fields[index].pendingQty} Qty`
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={12} sm={0.5}> */}
                                            {/* {isEdit ? null :
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text"
                                                    fontWeight="medium"
                                                    onClick={() => removeLaundryItem(index)}
                                                    style={{ cursor: "pointer", alignSelf: "center" }}
                                                >
                                                    {fields.length !== 1 ?
                                                        <FiMinusCircle size={26} style={{ marginTop: '8px' }} />
                                                        : null}
                                                </Typography>
                                            } */}
                                        {/* </Grid> */}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                        <Button disabled={isSubmitting} className="btn btn-tertiary" variant="contained" type="submit">
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default AddEditLaundryReceiver;
