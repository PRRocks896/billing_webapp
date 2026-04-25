import { Controller } from 'react-hook-form';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project-imports
import MainCard from 'components/MainCard';
import useAddEditRole from '../hooks/useAddEditRole';

const AddEditRole = () => {
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    } = useAddEditRole();

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }} >
                <MainCard title={title}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Role Name is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Role Name"
                                            placeholder="Enter Role Name"
                                            error={!!error}
                                            helperText={error?.message}
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
    );
}

export default AddEditRole;