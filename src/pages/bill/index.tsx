import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Receipt2 } from "iconsax-reactjs";

import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";
import CustomDailogBox from "components/CustomDailogBox";
import MainCard from "components/MainCard";
import Grid from "@mui/material/Grid";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import UseBill from "./hooks/useBill";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

const Bill = () => {
    const {
        list,
        page,
        rows,
        rights,
        Column,
        control,
        userList,
        isAdmin,
        isVisible,
        totalCount,
        order,
        orderBy,
        companyList,
        billNoMappingForm,
        handleRequestSort,
        setPage,
        setRows,
        handleAdd,
        onSubmit,
        searchHandler,
        resetFormValue,
        onDeleteHandler,
        closeConfirmModal
    } = UseBill();

    const title = "Bill"

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <Receipt2 size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{title} Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View, manage, and track all generated billing records.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {/* ── Admin Filters Area ─────────────────────────────────────────────────── */}
            {isAdmin && (
                <form onSubmit={billNoMappingForm.handleSubmit(onSubmit)}>
                    <MainCard title="Bill No Mapping" border={false} shadow="0 2px 14px 0 rgb(32 40 45 / 8%)">
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            This will change the sequence of bill no so do change wisely
                        </Typography>
                        <Grid container spacing={3} alignItems="center">
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="startDate"
                                    control={billNoMappingForm.control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Start Date"
                                                    format="dd/MM/yyyy"
                                                    value={value}
                                                    onChange={onChange}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="endDate"
                                    control={billNoMappingForm.control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="End Date"
                                                    format="dd/MM/yyyy"
                                                    value={value}
                                                    onChange={onChange}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="upiNo"
                                    control={billNoMappingForm.control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Card/UPI Start No"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="cashNo"
                                    control={billNoMappingForm.control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Cash Start No"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="companyID"
                                    control={billNoMappingForm.control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                fullWidth
                                                value={companyList.find((item) => item.id === value) || null}
                                                onChange={(_, newValue: any) => {
                                                    onChange(newValue ? newValue.id : null);
                                                }}
                                                options={companyList}
                                                getOptionLabel={(option: any) => option.companyName}
                                                isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Company"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Button variant="contained" type="submit">
                                    Generate Bill No Mapping
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </form>
            )}
            {isAdmin && (
                <MainCard title="Filters" border={false} shadow="0 2px 14px 0 rgb(32 40 45 / 8%)">
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Date"
                                                format="dd/MM/yyyy"
                                                value={value}
                                                onChange={onChange}
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="selectedUser"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Autocomplete
                                        fullWidth
                                        value={userList.find((item) => item.id === value) || null}
                                        onChange={(_, newValue: any) => {
                                            onChange(newValue ? newValue.id : null);
                                        }}
                                        options={userList}
                                        getOptionLabel={(option: any) => option.lastName}
                                        isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Branch"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <Button
                                size="large"
                                variant="outlined"
                                color="secondary"
                                onClick={resetFormValue}
                                fullWidth
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </MainCard>
            )}

            {/* ── Main Content Area ─────────────────────────────────────────────────── */}
            <MainCard content={false}>
                <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: 1, borderColor: 'divider' }}>
                    <SearchContainer
                        isSearchable={true}
                        handleSearchText={searchHandler}
                        buttonTitle={rights.add ? `Add New` : ""}
                        handleBtn={handleAdd}
                    />
                </Box>

                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DynamicTable
                        title=""
                        data={list}
                        columns={Column}
                        totalCount={totalCount}
                        page={page}
                        rowsPerPage={rows}
                        order={order}
                        orderBy={orderBy}
                        handleRequestSort={handleRequestSort}
                        handleChangePage={(_, newPage) => setPage(newPage)}
                        handleChangeRowsPerPage={(e) => setRows(Number(e.target.value))}
                    />
                </Box>
            </MainCard>

            {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
            {isVisible && (
                <CustomDailogBox
                    open={isVisible}
                    title={`Delete ${title}`}
                    description={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
                    btnText1="Cancel"
                    btnText2="Delete"
                    isError={true}
                    handleClose={closeConfirmModal}
                    handleSubmit={onDeleteHandler}
                />
            )}
        </Stack>
    )
}

export default Bill;