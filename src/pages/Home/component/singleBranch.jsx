import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { Controller } from "react-hook-form";


import UseSingleBranch from "../hook/useSingleBranch";

const SingleBranch = () => {
    const {
        control,
        onSubmit,
        handleFile,
        handleSubmit
    } = UseSingleBranch();

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <Box className="activity-card-wrapper mb-24">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4} sm={6}>
                                <Controller
                                    name="titleName"
                                    control={control}
                                    render={({
                                    field: { value, onChange},
                                    fieldState: { error }
                                    }) => (
                                    <FormControl
                                    fullWidth
                                        size="small"
                                        variant="standard"
                                        className="form-control"
                                    >
                                        <TextField
                                        label="Title Name"
                                        size="small"
                                        name="titleName"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                        />
                                    </FormControl>
                                    )}
                                    rules={{
                                    required: 'Title Name is required'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} sm={6}>
                                <Controller
                                    name="gstNo"
                                    control={control}
                                    render={({
                                    field: { onBlur, onChange, value },
                                    fieldState: { error },
                                    }) => (
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        variant="standard"
                                        className="form-control"
                                    >
                                        <TextField
                                        label="Gst No"
                                        size="small"
                                        name="gst"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value.toUpperCase());
                                        }}
                                        onBlur={onBlur}
                                        error={!!error}
                                        helperText={error?.message}
                                        />
                                    </FormControl>
                                    )}
                                    rules={{
                                    required: "Please Enter Gst",
                                    pattern: {
                                        value:
                                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                        message: "Enter Invalid Gst Number",
                                    },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} sm={6}>
                                <Controller
                                    name="hsn"
                                    control={control}
                                    render={({
                                    field: { value, onChange},
                                    fieldState: { error }
                                    }) => (
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        variant="standard"
                                        className="form-control"
                                    >
                                        <TextField
                                        label="HSN Code"
                                        size="small"
                                        name="hsn"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                        />
                                    </FormControl>
                                    )}
                                    rules={{
                                    required: 'HSN is required'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} sm={6}></Grid>
                            <Grid item xs={12}>
                                <Box className="activity-card-wrapper mb-24">
                                    <Typography variant="subtitle2" sx={{ fontSize: 22 }}>Upload File</Typography>
                                    <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    <Button
                                        className="btn btn-tertiary"
                                        type="submit"
                                    >
                                        Generate
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </form>
        </>
    )
}

export default SingleBranch;