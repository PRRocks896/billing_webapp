import Grid from "@mui/material/Grid";
import UseAddEditCustomer from "../hooks/useAddEditCustomer";
import MainCard from "components/MainCard";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { PHONE_REGEX } from "utils/constant";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";

const AddEditCustomer = () => {
    const {
        mode,
        title,
        control,
        isSubmitting,
        countryCodeList,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    } = UseAddEditCustomer();
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <MainCard title={title}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            label="Name"
                                            variant="outlined"
                                            fullWidth
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='countryCode'
                                            control={control}
                                            rules={{ required: 'Country Code is required' }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                                return (
                                                    <Autocomplete
                                                        fullWidth
                                                        value={countryCodeList.find((countryCode: any) => countryCode.value === value) || null}
                                                        onChange={(_, newValue: any) => {
                                                            onChange(newValue ? newValue.value : null);
                                                        }}
                                                        onBlur={onBlur}
                                                        options={countryCodeList}
                                                        getOptionLabel={(option: any) => option.label}
                                                        isOptionEqualToValue={(option: any, value: any) => option.value === value}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Country Code*"
                                                                variant="outlined"
                                                                error={!!error}
                                                                helperText={error?.message}
                                                            />
                                                        )}
                                                    />
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='phoneNumber'
                                            control={control}
                                            rules={{
                                                required: 'Phone is required',
                                                pattern: {
                                                    value: PHONE_REGEX,
                                                    message: 'Invalid phone number'
                                                }
                                            }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                                return (
                                                    <TextField
                                                        fullWidth
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        label="Phone*"
                                                        variant="outlined"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{ required: 'Date of Birth is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                        return (
                                            <>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        format="dd/MM/yyyy"
                                                        value={value}
                                                        onChange={onChange}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                label: 'Date of Birth',
                                                                error: !!error,
                                                                helperText: error?.message,
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    control={control}
                                    name="gender"
                                    rules={{ required: 'Gender is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                        return (
                                            <>
                                                <FormLabel>Gender:</FormLabel>
                                                <RadioGroup
                                                    row
                                                    value={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    name="gender"
                                                >
                                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                </RadioGroup>
                                                <FormHelperText sx={{ color: 'error.main' }}>{error?.message}</FormHelperText>
                                            </>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Stack direction="row" sx={{ mt: 2 }} spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" color="secondary" onClick={handleBack}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {mode === 'add' ? isSubmitting ? 'Adding...' : 'Add' : isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </Stack>
                    </form>
                </MainCard>
            </Grid>
        </Grid>
    )
}

export default AddEditCustomer