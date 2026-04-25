import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import MainCard from "components/MainCard";
import {
    Calendar,
    Shop,
    Archive,
    Box1,
    DocumentDownload,
    Filter,
    User,
    Status
} from "iconsax-reactjs";

import useLaudryReport from "./hooks/useLaudryReport";

const LaundryReport = () => {
    const theme = useTheme();
    const {
        year,
        month,
        yearReceiver,
        monthReceiver,
        selectedUser,
        selectedUserReceiver,
        userList,
        setYear,
        setMonth,
        setYearReceiver,
        setMonthReceiver,
        setSelectedUser,
        setSelectedUserReceiver,
        handleFetchReportLaundryManagement,
        handleFetchReportLaundryReceiver
    } = useLaudryReport();

    // Helper to render filter row
    const FilterRow = ({
        m, sM, y, sY, u, sU, onFetch, fetchLabel, type
    }: any) => (
        <Grid container spacing={3} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id={`month-label-${type}`}>Month</InputLabel>
                    <Select
                        labelId={`month-label-${type}`}
                        label="Month"
                        value={m || ''}
                        onChange={(e) => sM(Number(e.target.value))}
                        startAdornment={
                            <InputAdornment position="start">
                                <Calendar size={20} color={theme.palette.text.disabled} />
                            </InputAdornment>
                        }
                    >
                        {[
                            "Jan", "Feb", "March", "Apr", "May", "June",
                            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
                        ].map((monthName, i) => (
                            <MenuItem key={monthName} value={i + 1}>{monthName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id={`year-label-${type}`}>Year</InputLabel>
                    <Select
                        labelId={`year-label-${type}`}
                        label="Year"
                        value={y || ''}
                        onChange={(e) => sY(Number(e.target.value))}
                        startAdornment={
                            <InputAdornment position="start">
                                <Status size={20} color={theme.palette.text.disabled} />
                            </InputAdornment>
                        }
                    >
                        {[...Array(10)].map((_, i) => {
                            const yearVal = new Date().getFullYear() - i;
                            return <MenuItem key={yearVal} value={yearVal}>{yearVal}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Autocomplete
                    fullWidth
                    options={userList || []}
                    getOptionLabel={(option) => option?.lastName || ''}
                    value={userList.find((user) => user.id === u) || null}
                    onChange={(_, newValue) => sU(newValue?.id || null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Branch / Manager"
                            placeholder="Select personnel"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start" sx={{ ml: 1 }}>
                                            <Shop size={20} color={theme.palette.text.disabled} />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                )
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <User size={18} variant="Bulk" color={theme.palette.primary.main} />
                                <Typography>{option.lastName}</Typography>
                            </Stack>
                        </li>
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onFetch}
                    startIcon={<DocumentDownload size={20} variant="Bold" />}
                    sx={{
                        borderRadius: '10px',
                        py: 1.25,
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                >
                    Get Report
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <Stack spacing={4}>
            {/* ── Laundry Management Report ────────────────────────── */}
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <Archive size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>Laundry Management Report</Typography>
                            <Typography variant="caption" color="text.secondary">Operational handover and tracking records.</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                    <FilterRow
                        m={month} sM={setMonth}
                        y={year} sY={setYear}
                        u={selectedUser} sU={setSelectedUser}
                        onFetch={handleFetchReportLaundryManagement}
                        type="management"
                    />
                </Box>
            </MainCard>

            {/* ── Laundry Receiver Report ──────────────────────────── */}
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <Box1 size={28} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>Laundry Receiver Report</Typography>
                            <Typography variant="caption" color="text.primary">Detailed logs for processed and received items.</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                    <FilterRow
                        m={monthReceiver} sM={setMonthReceiver}
                        y={yearReceiver} sY={setYearReceiver}
                        u={selectedUserReceiver} sU={setSelectedUserReceiver}
                        onFetch={handleFetchReportLaundryReceiver}
                        type="receiver"
                    />
                </Box>
            </MainCard>
        </Stack>
    );
};

export default LaundryReport;