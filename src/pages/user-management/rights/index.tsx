import { Controller } from "react-hook-form";

import MainCard from "components/MainCard";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";

import UseRights from "./hooks/useRights";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";

const Rights = () => {
    const {
        roles,
        fields,
        control,
        isSubmitting,
        reset,
        onSubmit,
        setValue,
        getValues,
        handleSubmit,
        cancelHandler,
        onChangeAllHandler,
        fetchRightsModuleData,
    } = UseRights();

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <MainCard
                    title="Rights"
                >
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Controller
                                name="roleID"
                                control={control}
                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                    <Autocomplete
                                        value={roles.find((role: any) => role.id === value)}
                                        onChange={(_, value: any) => {
                                            if (value.id) {
                                                onChange(value.id);
                                                fetchRightsModuleData(value.id);
                                            }
                                        }}
                                        onBlur={onBlur}
                                        options={roles}
                                        getOptionLabel={(option: any) => option.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Role"
                                                variant="outlined"
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid sx={{ mt: 2 }} container spacing={2}>
                        <Grid size={12}>
                            <TableContainer sx={{ maxHeight: 350, overflowY: 'auto' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Module Name</TableCell>
                                            <TableCell>All</TableCell>
                                            <TableCell>View</TableCell>
                                            <TableCell>Add</TableCell>
                                            <TableCell>Edit</TableCell>
                                            <TableCell>Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields?.map((field, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{field.moduleName}</TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`modules.${index}.all`}
                                                        render={({
                                                            field: { onBlur, onChange, value },
                                                        }) => (
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(_, newValue) => [
                                                                    onChange(newValue),
                                                                    onChangeAllHandler("all", index, newValue),
                                                                ]}
                                                                onBlur={onBlur}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`modules.${index}.view`}
                                                        render={({
                                                            field: { onBlur, onChange, value },
                                                        }) => (
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(_, newValue) => [
                                                                    onChange(newValue),
                                                                    onChangeAllHandler("view", index, newValue),
                                                                ]}
                                                                onBlur={onBlur}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`modules.${index}.add`}
                                                        render={({
                                                            field: { onBlur, onChange, value },
                                                        }) => (
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(_, newValue) => [
                                                                    onChange(newValue),
                                                                    onChangeAllHandler("add", index, newValue),
                                                                ]}
                                                                onBlur={onBlur}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`modules.${index}.edit`}
                                                        render={({
                                                            field: { onBlur, onChange, value },
                                                        }) => (
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(_, newValue) => [
                                                                    onChange(newValue),
                                                                    onChangeAllHandler("edit", index, newValue),
                                                                ]}
                                                                onBlur={onBlur}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`modules.${index}.delete`}
                                                        render={({
                                                            field: { onBlur, onChange, value },
                                                        }) => (
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(_, newValue) => [
                                                                    onChange(newValue),
                                                                    onChangeAllHandler("delete", index, newValue),
                                                                ]}
                                                                onBlur={onBlur}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Stack direction="row" sx={{ mt: 2 }} spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="secondary" onClick={cancelHandler}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Assigning...' : 'Assign'}
                        </Button>
                    </Stack>
                </MainCard>
            </form>
        </>
    )
}

export default Rights;