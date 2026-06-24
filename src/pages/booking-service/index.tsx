import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { Profile2User } from "iconsax-reactjs";

import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";
import MainCard from "components/MainCard";

import UseBookingService from "./hooks/useBookingService";

const BookingService = () => {
    const {
        list,
        page,
        rows,
        rights,
        Column,
        isAdmin,
        isVisible,
        totalCount,
        branchList,
        selectedBranchId,
        setSelectedBranchId,
        setPage,
        setRows,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        handleRequestSort,
        searchHandler
    } = UseBookingService();

    const title = "Booking Service";

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <Profile2User size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{title} Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View, manage, and configure all available {title.toLowerCase()}s.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {isAdmin && (
                <MainCard title="Filter" border={false} content={false}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, sm: 4 }} sx={{ p: 3 }}>
                            <Autocomplete
                                options={branchList}
                                getOptionLabel={(option) => option.lastName}
                                value={branchList?.find((branch: any) => branch.id === selectedBranchId) || null}
                                onChange={(event, newValue) => {
                                    setSelectedBranchId(newValue?.id || '');
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Branch" />}
                            />
                        </Grid>
                    </Grid>
                    {/* <Box>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Select Branch"
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                        >
                            <MenuItem value={''}>All Branches</MenuItem>
                            {branchList?.map((branch: any) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                    {branch.lastName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>*/}
                </MainCard>
            )}

            {/* ── Main Content Area ─────────────────────────────────────────────────── */}
            <MainCard content={false}>
                <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: 1, borderColor: 'divider' }}>
                    <SearchContainer
                        isSearchable={true}
                        handleSearchText={searchHandler}
                    // buttonTitle={rights.add ? `Add New` : ""}
                    // handleBtn={handleAdd}
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
        </Stack>
    )
}

export default BookingService;