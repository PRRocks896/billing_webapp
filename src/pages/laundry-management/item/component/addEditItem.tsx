import { Controller } from 'react-hook-form';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import MainCard from 'components/MainCard';

import UseAddEditItem from '../hooks/useAddEditItem';

const AddEditItem = () => {
    const {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    } = UseAddEditItem();
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }} >
                <MainCard title={title}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <Controller
                                    name="itemName"
                                    control={control}
                                    rules={{ required: 'Item Name is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            value={value}
                                            onChange={(e) => onChange(e.target.value.trim().replaceAll(/\s+/g, ' ').toUpperCase())}
                                            onBlur={onBlur}
                                            fullWidth
                                            label="Item Name"
                                            placeholder="Enter Item Name"
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
    )
}

export default AddEditItem;