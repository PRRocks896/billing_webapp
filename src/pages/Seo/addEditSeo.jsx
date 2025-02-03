import React from "react";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { generateSlug, generateUrl } from "../../utils/helper";
import ImageUpload from "../../components/ImageUpload";
import useAddEditSeoHook from "./hook/useAddEditSeo.hook"


const AddEditSeo = ({tag}) => {
    const {
        control,
        setValue,
        onSubmit,
        handleSubmit,
        cancelHandler,
    } = useAddEditSeoHook(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="title"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    variant="standard"
                                                    className="form-control"
                                                >
                                                    <TextField
                                                        label="Title"
                                                        size="small"
                                                        name="name"
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e.target.value.toUpperCase())
                                                            setValue("slug", generateSlug(e.target.value));
                                                            setValue("pagePath", generateUrl(e.target.value));
                                                        }}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Title field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="slug"
                                            control={control}
                                            render={({
                                                field: { value }
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    variant="standard"
                                                    className="form-control"
                                                >
                                                    <TextField
                                                        label="Slug"
                                                        size="small"
                                                        name="name"
                                                        value={value}
                                                        disabled
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="pagePath"
                                            control={control}
                                            render={({
                                                field: { value }
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    variant="standard"
                                                    className="form-control"
                                                >
                                                    <TextField
                                                        label="Page Path"
                                                        size="small"
                                                        name="name"
                                                        value={value}
                                                        disabled
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <ImageUpload
                                                    key={'img-upload'}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={error}
                                                />
                                            )}
                                            rules={{
                                                required: 'Please Upload File'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({
                                                field: { onBlur, onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl
                                                    size="small"
                                                    variant="standard"
                                                    className="form-control"
                                                >
                                                    <TextField
                                                        label="Description"
                                                        size="small"
                                                        name="name"
                                                        multiline
                                                        rows={6}
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Description field required",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
            </form>
        </>
    )
}

export default AddEditSeo;