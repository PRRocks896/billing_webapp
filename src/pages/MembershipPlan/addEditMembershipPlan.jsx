import React from "react";
import { Controller } from "react-hook-form";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";

import ImageUpload from "../../components/ImageUpload";

import { useAddEditMembershipPlan } from "./hook/useAddEditMembershipPlan.hooks";

const AddEditMembershipPlan = ({ tag }) => {
    const {
        fields,
        control,
        addRow,
        onSubmit,
        removeRow,
        handleSubmit,
        cancelHandler,
    } = useAddEditMembershipPlan(tag);
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="card">
                    <FormGroup className="form-field">
                        <Grid container spacing={1}>
                            {/* <Grid item xs={8}>
                                <Grid container spacing={1}> */}
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="planName"
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
                                                label="Plan name"
                                                size="small"
                                                name="name"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Plan name field required",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="price"
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
                                                label="Price"
                                                size="small"
                                                name="path"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Price field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name="hours"
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
                                                label="Hours"
                                                size="small"
                                                name="icon"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        </FormControl>
                                    )}
                                    rules={{
                                        required: "Hours field required",
                                        pattern: {
                                            value: /^\d*(\.\d{0,2})?$/i,
                                            message: "please enter digit only.",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name={`validity`}
                                    control={control}
                                    render={({
                                        field: { onBlur, onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <FormControl>
                                            <Typography variant="subtitle1" fontWeight={500} fontSize={16}>Validity:</Typography>
                                            <RadioGroup
                                                sx={{ display: 'block' }}
                                                name="radio-buttons-group"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={!!error}
                                            >
                                                <FormControlLabel
                                                    value="6"
                                                    control={<Radio checked={value === "6"}/>}
                                                    label="6 Months"
                                                />
                                                <FormControlLabel
                                                    value="12"
                                                    control={<Radio checked={value === "12"}/>}
                                                    label="12 Months"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Box>
                <br />
                <Box className="card">
                    <Controller
                        name="images"
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
                                multiple={true}
                            />
                        )}
                        rules={{
                            required: 'Please Upload File'
                        }}
                    />
                </Box>
                <br />
                <Box className="card">
                    <Typography variant="h6">Feature List</Typography>
                    <TableContainer className="table-wrapper">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={"2%"}></TableCell>
                                    <TableCell>Feature</TableCell>
                                    <TableCell width={"2%"}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id} id={field.id}>
                                        <TableCell>
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text"
                                                fontWeight="medium"
                                                onClick={addRow}
                                                style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                            >
                                                {fields.length === (index + 1) ? <FiPlusCircle size={26} /> : null}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name={`featureList.${index}.value`}
                                                control={control}
                                                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                                    <FormControl size="small" fullWidth>
                                                        <TextField
                                                            type="text"
                                                            label=""
                                                            size="small"
                                                            value={value || ""}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            onBlur={onBlur}
                                                            error={Boolean(error)}
                                                            helperText={error?.message ? error.message : ""}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text"
                                                fontWeight="medium"
                                                onClick={() => removeRow(index)}
                                                style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center", color: 'red' }}
                                            >
                                                {fields.length !== 1 ?
                                                    <FiMinusCircle size={26} />
                                                    : null}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
    );
};

export default AddEditMembershipPlan;
