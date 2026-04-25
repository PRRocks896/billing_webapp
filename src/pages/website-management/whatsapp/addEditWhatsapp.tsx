import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

// project components
import MainCard from 'components/MainCard';

import useAddEditWhatsapp from "./hooks/useAddEditWhatsapp";

const AddEditWhatsapp = () => {
    const {
        title,
        control,
        branchList,
        isSubmitting,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditWhatsapp();
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <MainCard title={title}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="userID"
                                    control={control}
                                    rules={{ required: 'Branch is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <Autocomplete
                                            fullWidth
                                            value={branchList?.find((branch: any) => branch.id === value) || null}
                                            onChange={(_, newValue) => {
                                                onChange(newValue ? newValue.id : null)
                                                setValue("number", newValue?.phoneNumber);
                                            }}
                                            onBlur={onBlur}
                                            options={branchList}
                                            getOptionLabel={(option: any) => option.lastName}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Assigned Branch" error={!!error} helperText={error?.message} />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="number"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Number"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <Controller
                                    name="link"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Link"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                                <Button variant="outlined" color="secondary" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </Stack>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </form>
    )
}

export default AddEditWhatsapp;