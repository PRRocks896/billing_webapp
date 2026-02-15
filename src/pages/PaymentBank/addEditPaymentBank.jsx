
import { Controller } from "react-hook-form";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import UseAddEditPaymentBank from "./hooks/useAddEditPaymentBank";

const AddEditPaymentBank = ({ tag }) => {
    const {
        fields,
        control,
        companyList,
        isSubmitting,
        reset,
        setValue,
        onSubmit,
        getValues,
        handleAdd,
        handleSubmit,
        handleRemove,
        cancelHandler
    } = UseAddEditPaymentBank(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="bankName"
                                    control={control}
                                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                id="bankName"
                                                label="Bank Name"
                                                size="small"
                                                name="bankName"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Bank Name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="companyID"
                                    control={control}
                                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                        <FormControl size="small" fullWidth>
                                            <Autocomplete
                                                freeSolo
                                                size="small"
                                                id="companyID"
                                                options={companyList}
                                                value={companyList.find((company) => company.id === value) || null}
                                                getOptionLabel={(option) => option.companyName}
                                                disableClearable
                                                onChange={(event, newValue) => onChange(newValue.id)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Company Name"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <li {...props} key={option.id}>
                                                        {option.companyName}
                                                    </li>
                                                )}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Company Name field required",
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Typography>Value:</Typography>
                        {fields.map((item, index) => (
                            <Grid container spacing={2} key={item.id} style={{ padding: "10px 0px" }}>
                                <Grid item xs={12} sm={0.5}>
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        color="text"
                                        fontWeight="medium"
                                        onClick={handleAdd}
                                        sx={{ cursor: "pointer", alignSelf: "center" }}
                                    >
                                        {fields.length === index + 1 ? (
                                            <FiPlusCircle
                                                size={26}
                                                style={{ marginTop: "8px" }}
                                            />
                                        ) : null}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Controller
                                        name={`value.${index}.key`}
                                        control={control}
                                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    size="small"
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    label="Key"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: "Key field required",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name={`value.${index}.value`}
                                        control={control}
                                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    size="small"
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    label="Value"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            </FormControl>
                                        )}
                                        rules={{
                                            required: "Value field required",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={0.5}>
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        color="text"
                                        fontWeight="medium"
                                        onClick={() => handleRemove(index)}
                                        sx={{ cursor: "pointer", alignSelf: "center" }}
                                    >
                                        {fields.length > 1 ? (
                                            <FiMinusCircle
                                                size={26}
                                                style={{ marginTop: "8px" }}
                                            />
                                        ) : null}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </FormGroup>
                </Box>
                <Grid container spacing={3} sx={{ marginTop: "6px" }}>
                    <Grid item md={1.5}>
                        <Button type="sumit" className="btn btn-tertiary">
                            {tag === "add" ? isSubmitting ? "Saving..." : "Save" : isSubmitting ? "Updating..." : "Update"}
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

export default AddEditPaymentBank;