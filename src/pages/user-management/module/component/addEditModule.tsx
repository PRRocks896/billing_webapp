import { Controller } from 'react-hook-form';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import useAddEditModule from "../hooks/useAddEditModule";
import MainCard from 'components/MainCard';

const AddEditModule = () => {
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditModule();
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
                                    rules={{ required: 'Module Name is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Module Name"
                                            placeholder="Enter Module Name"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="path"
                                    control={control}
                                    rules={{ required: 'Path is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Path"
                                            placeholder="Enter Path"
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="icon"
                                    control={control}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Icon"
                                            placeholder="Enter Icon"
                                        />
                                    )}
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

export default AddEditModule;