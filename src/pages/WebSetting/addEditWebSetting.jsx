
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormHelpText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { generateSlug, generateUrl } from "../../utils/helper";
import ImageUpload from "../../components/ImageUpload";
import Editor from "../../components/Editor";
import useAddEditWebSetting from "./hook/useAddEditWebSetting.hook";

const AddEditWebSetting = ({ tag }) => {
    const {
        control,
        setValue,
        getValues,
        watch,
        onSubmit,
        handleSubmit,
        cancelHandler
    } = useAddEditWebSetting(tag);

    const valueWatch = watch("value");
    const imageWatch = watch("image");

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            name="identifier"
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
                                                        label="Identifier"
                                                        size="small"
                                                        name="identifier"
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e.target.value.toUpperCase())
                                                            setValue("slug", generateSlug(e.target.value))
                                                        }}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                required: "Identifier field required",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
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
                                                        name="slug"
                                                        value={value}
                                                        disabled
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Controller
                                            name="value"
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
                                                        label="Value"
                                                        size="small"
                                                        name="value"
                                                        value={value}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            onChange(val);
                                                            if (val) {
                                                                setValue("image", []);
                                                            }
                                                        }}
                                                        onBlur={onBlur}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{
                                                validate: (val) => {
                                                    const img = getValues("image");
                                                    if (!val && (!img || img.length === 0)) {
                                                        return "Either Value or Image is required";
                                                    }
                                                    return true;
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="image"
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
                                            <ImageUpload
                                                label="Image"
                                                value={value}
                                                onChange={(files) => {
                                                    onChange(files);
                                                    if (files && files.length > 0) {
                                                        setValue("value", "");
                                                    }
                                                }}
                                                multiple={false}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        validate: (val) => {
                                            const v = getValues("value");
                                            if (!v && (!val || val.length === 0)) {
                                                return "Either Value or Image is required";
                                            }
                                            return true;
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
                <Grid container spacing={3} sx={{ marginTop: "6px" }}>
                    <Grid item md={1.5}>
                        <Button type="submit" className="btn btn-tertiary">
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
    )
}

export default AddEditWebSetting;