import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import SearchContainer from "components/SearchContainer";
import DynamicTable from "components/DynamicTable";
import CustomDailogBox from "components/CustomDailogBox";
import MainCard from "components/MainCard";
import { NoteText, DocumentDownload } from "iconsax-reactjs";

import UseDailyReport from "./hooks/useDailyReport";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

const DailyReport = () => {
    const {
        list,
        page,
        rows,
        rights,
        Column,
        isAdmin,
        isVisible,
        totalCount,
        dateRange,
        branchList,
        sectionRights,
        selectedBranch,
        setSelectedBranch,
        setDateRange,
        setPage,
        setRows,
        order,
        orderBy,
        handleRequestSort,
        handleAdd,
        searchHandler,
        onDeleteHandler,
        closeConfirmModal,
        downloadReport
    } = UseDailyReport();

    const title = 'Daily Report';

    if (!isAdmin) {
        handleAdd();
    }

    return (
        <Stack spacing={3}>
            {/* ── Page Header ───────────────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', color: 'primary.main' }}>
                        <NoteText size={28} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{title} Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View, manage, and configure all available daily reports.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {/* ── Admin Export Controls ─────────────────────────────────────────────── */}
            {sectionRights.view && (
                <MainCard sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 'max-content' }}>
                            <Box sx={{ p: 1.25, bgcolor: 'primary.lighter', color: 'primary.main', borderRadius: 1.5, display: 'flex' }}>
                                <DocumentDownload size={22} variant="Bulk" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                    Export Daily Reports
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Generate branch summaries
                                </Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2} sx={{ width: { xs: '100%', md: 'auto' }, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                                <FormControl fullWidth>
                                    <TextField
                                        type="date"
                                        label="Select Date"
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 5 }}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    id="branchID"
                                    getOptionLabel={(option) => option.lastName || option.branchName || ''}
                                    options={branchList || []}
                                    onChange={(_event, value) => setSelectedBranch(value || null)}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.lastName || option.branchName}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Branch" />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4, md: 'auto' }}>
                                {sectionRights.download &&
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={downloadReport}
                                        sx={{ minWidth: 120, height: 50, px: 3, boxShadow: 'none' }}
                                    >
                                        Export PDF
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Stack>
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
    );
};

export default DailyReport;