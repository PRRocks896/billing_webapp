import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/MainCard';
import FileUpload, { FileUploadValue } from 'components/FileUpload';

interface FormData {
    singleFile: FileUploadValue | null;
    multipleFiles: FileUploadValue[] | null;
    images: FileUploadValue[] | null;
}

const FileUploadExample = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            singleFile: null,
            multipleFiles: null,
            images: null,
        },
    });

    const onSubmit = (data: FormData) => {
        console.log('Form submitted:', data);
        // Handle form submission
    };

    return (
        <MainCard title="File Upload Component Example">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Single File Upload */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="singleFile"
                            control={control}
                            rules={{ required: 'Please upload a file' }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <FileUpload
                                    value={value || undefined}
                                    onChange={onChange}
                                    label="Single File Upload"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Multiple Files Upload */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="multipleFiles"
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <FileUpload
                                    value={value || undefined}
                                    onChange={onChange}
                                    multiple
                                    label="Multiple Files Upload"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Images Only Upload */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="images"
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <FileUpload
                                    value={value || undefined}
                                    onChange={onChange}
                                    multiple
                                    accept="image/*"
                                    maxSize={2097152} // 2MB
                                    label="Images Only (Max 2MB each)"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
};

export default FileUploadExample;
