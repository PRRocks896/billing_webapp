import React from "react";
import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormHelpText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import useAddEditMaterial from "./hook/useAddEditMaterial";

const AddEditMaterial = ({ tag }) => {
    const {
        control,
        isSubmitting,
        handleSubmit,
        onSubmit,
        cancelHandler,
        listPayload
    } = useAddEditMaterial(tag);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                label="Name"
                                                variant="outlined"
                                                size="small"
                                                name="name"
                                                value={value || ""}
                                                onChange={(e) => onChange(e.target.value)}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Please Enter Name",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="uom"
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="uom">UOM</InputLabel>
                                            <Select
                                                labelId="uom"
                                                id="uom-select"
                                                value={value}
                                                label="UOM"
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            >
                                                <MenuItem value="NOS">Nos</MenuItem>
                                                <MenuItem value="KG">KG</MenuItem>
                                                <MenuItem value="GRAM">GRAM</MenuItem>
                                            </Select>
                                            {error && error.message &&
                                                <FormHelpText error={true}>{error.message}</FormHelpText>
                                            }
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: 'Please Select UOM'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button className="btn btn-tertiary" variant="contained" type="button" onClick={cancelHandler}>Back</Button>
                        <Button disabled={isSubmitting} className="btn btn-tertiary" variant="contained" type="submit">
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default AddEditMaterial;