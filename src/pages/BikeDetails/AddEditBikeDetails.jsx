import React from "react";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from '@mui/material/Autocomplete';
import { useAddEditBikeDetails } from "./hook/useAddEditBikeDetails";
import ImageUpload from "../../components/ImageUpload";

const AddEditBikeDetails = ({ tag }) => {
    const {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
        cityOptions,
    } = useAddEditBikeDetails(tag);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                    <>
                        <Box className="card">
                            <Typography variant="subtitle1" fontWeight={700} fontSize={22}>Basic Detail</Typography>
                            <FormGroup className="form-field">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="bikeOwnerName"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        id="bikeOwnerName"
                                                        label="Bike Owner Name"
                                                        size="small"
                                                        name="nickName"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Nick name field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="cityID"
                                            control={control}
                                            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    size="small"
                                                    id="cityID"
                                                    options={cityOptions}
                                                    value={cityOptions.find((option) => option.value === value) || null}
                                                    onBlur={onBlur}
                                                    onChange={(event, newValue) => onChange(newValue ? Number(newValue.value) : "")}
                                                    getOptionLabel={(option) => option.label || ""}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select City"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                            rules={{
                                                required: "Please Select City",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="bikeName"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        id="bikeName"
                                                        label="Bike Name"
                                                        size="small"
                                                        name="bikeName"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Nick name field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="bikeNumber"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        id="bikeNumber"
                                                        label="Bike Number"
                                                        size="small"
                                                        name="bikeNumber"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Bike Number field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="registerNumber"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        id="registerNumber"
                                                        label="Register Number"
                                                        size="small"
                                                        name="registerNumber"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Register numbers field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="registerDate"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        type="date"
                                                        variant="outlined"
                                                        label="Register Date"
                                                        size="small"
                                                        name="registerdate"
                                                        value={value || new Date()}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Register Date'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="renewDate"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        type="date"
                                                        variant="outlined"
                                                        label="Renew Date"
                                                        size="small"
                                                        name="renewdate"
                                                        value={value || new Date()}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Renew Date'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="insuranceNumber"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        id="insuranceNumber"
                                                        label="Insurance Number"
                                                        size="small"
                                                        name="insuranceNumber"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Insurance Number field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="insuranceDate"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        type="date"
                                                        variant="outlined"
                                                        label="Insurance Date"
                                                        size="small"
                                                        name="date"
                                                        value={value || new Date()}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Insurance Date'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="insuranceRenewDate"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl size="small" fullWidth>
                                                    <TextField
                                                        type="date"
                                                        variant="outlined"
                                                        label="Insurance Renew Date"
                                                        size="small"
                                                        name="insuranceRenewDate"
                                                        value={value || new Date()}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: 'Please Select Insurance Renew Date'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="rcBookDoc"
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <ImageUpload
                                                    title="Rc Book Doc"
                                                    key={'img-upload'}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={error}
                                                    accept="image/*,application/pdf"
                                                />
                                            )}
                                            rules={{
                                                required: 'Please Rcbook Upload File'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="insurancePolicyDoc"
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <ImageUpload
                                                    title="Insurance Policy Doc"
                                                    key={'img-upload'}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={error}
                                                    accept="image/*,application/pdf"
                                                />
                                            )}
                                            rules={{
                                                required: 'Please Upload File'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Box>
                    </>
                <Grid container spacing={3} sx={{ marginTop: "6px" }}>
                    <Grid item md={1.5}>
                        <Button type="sumit" className="btn btn-tertiary">
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
};

export default AddEditBikeDetails;
