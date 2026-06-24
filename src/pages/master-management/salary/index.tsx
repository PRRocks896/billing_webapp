import { Controller } from 'react-hook-form';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    Box,
    Divider,
    Autocomplete,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    FormHelperText,
    IconButton,
} from '@mui/material';

// project components
import MainCard from 'components/MainCard';

// Icons
import {
    Wallet,
    MoneyTick,
    Trash,
    Setting2,
    Calendar,
    SearchNormal1,
    Refresh,
    DocumentText,
} from 'iconsax-reactjs';

import useSalary from "./useSalary";

const Salary = () => {
    const theme = useTheme();
    const {
        year,
        month,
        fields,
        control,
        branchList,
        companyList,
        isSubmitting,
        setYear,
        onSubmit,
        setMonth,
        resetForm,
        searchList,
        handleSubmit,
        handleRemove,
        handleCalculation,
        setSelectedBranch,
        setSelectedCompany,
        handleValidateIfscCode,
    } = useSalary();

    return (
        <Stack spacing={4}>
            {/* ── Filter Hero Center ────────────────────────────────────────────────── */}
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}` }}>
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', color: '#fff' }}>
                            <Wallet size={24} variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800}>Monthly Salary Processing</Typography>
                            <Typography variant="body2" color="text.secondary">Configure filters to generate the payroll list for a specific branch and month.</Typography>
                        </Box>
                    </Stack>

                    <Grid container spacing={2.5} alignItems="flex-end">
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="salary-month-label">Select Month</InputLabel>
                                <Select
                                    labelId="salary-month-label"
                                    value={month || ''}
                                    onChange={(e) => setMonth(e.target.value)}
                                    label="Select Month"
                                    startAdornment={<Calendar size={18} style={{ marginRight: 8, color: theme.palette.text.disabled }} />}
                                >
                                    {['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                        <MenuItem key={m} value={i + 1}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Year"
                                value={year}
                                onChange={(e) => e.target.value.length < 5 && setYear(e.target.value)}
                                placeholder="YYYY"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={companyList || []}
                                getOptionLabel={(option) => option.companyName || ''}
                                onChange={(_event, value) => setSelectedCompany(value?.id || null)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company" placeholder="Select Company" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>{option.companyName}</li>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={branchList || []}
                                getOptionLabel={(option) => option.lastName || ''}
                                onChange={(_event, value) => setSelectedBranch(value?.id || null)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Branch" placeholder="Select Branch" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>{option.lastName}</li>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={searchList}
                                sx={{ height: 40, borderRadius: 2 }}
                            >
                                <SearchNormal1 size={18} variant="Bold" />
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>

            {/* ── Salary Processing Table ─────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}>
                <Stack spacing={3}>
                    <MainCard content={false} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                        <TableContainer sx={{ height: 'calc(100vh - 420px)', minHeight: 400 }}>
                            <Table stickyHeader sx={{ minWidth: 2800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ width: 60 }}>No</TableCell>
                                        <TableCell
                                            sx={{
                                                width: 180,
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 3,
                                                bgcolor: theme.palette.primary.main,
                                                color: '#fff',
                                                borderRight: `1px solid ${theme.palette.divider}`,
                                                boxShadow: `4px 0 8px ${alpha(theme.palette.primary.main, 0.05)}`
                                            }}
                                        >
                                            Staff Name
                                        </TableCell>
                                        <TableCell align="center">Left</TableCell>
                                        <TableCell align="center">Paid</TableCell>
                                        <TableCell>Staff Type</TableCell>
                                        <TableCell align="center">Total Days</TableCell>
                                        <TableCell align="center">Working Days</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>Week Off</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>Leave</TableCell>
                                        <TableCell align="right">Base Salary</TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>Expense Cut</TableCell>
                                        <TableCell align="right">Advance Taken</TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>Advance Given</TableCell>
                                        <TableCell align="right">Leave Cut</TableCell>
                                        <TableCell align="right">Sub Salary</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>Tax</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>Payable Salary</TableCell>
                                        <TableCell sx={{ minWidth: 250 }}>Account Holder</TableCell>
                                        <TableCell sx={{ minWidth: 200 }}>Account Number</TableCell>
                                        <TableCell sx={{ minWidth: 180 }}>IFSC Code</TableCell>
                                        <TableCell align="center" sx={{ width: 80 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields?.map((item, index) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 2,
                                                    bgcolor: '#fff',
                                                    fontWeight: 700,
                                                    borderRight: `1px solid ${theme.palette.divider}`,
                                                    boxShadow: `2px 0 4px ${alpha(theme.palette.primary.main, 0.05)}`
                                                }}
                                            >
                                                {item.staffName}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Controller
                                                    name={`staff.${index}.isLeft`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch size="small" color="error" checked={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Controller
                                                    name={`staff.${index}.isPaid`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch size="small" color="success" checked={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary' }}>
                                                    {item.employeeType}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">{item.totalDays}</TableCell>
                                            <TableCell align="center">
                                                <Controller
                                                    name={`staff.${index}.workingDays`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Typography variant="body2" fontWeight={600} color="primary.main">{field.value}</Typography>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.weekOff`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select size="small" fullWidth value={field.value || 0} onChange={field.onChange}>
                                                            {[0, 1, 2, 3, 4].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.leave`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            size="small"
                                                            value={field.value}
                                                            onChange={(e) => { field.onChange(e.target.value); handleCalculation(index); }}
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="right">₹{item.salary}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.expense`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            size="small"
                                                            value={field.value}
                                                            onChange={(e) => { field.onChange(e.target.value); handleCalculation(index); }}
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'error.main' }}>₹{item.takenAdvance || 0}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.advance`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            size="small"
                                                            value={field.value || ''}
                                                            onChange={(e) => { field.onChange(e.target.value); handleCalculation(index); }}
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'secondary.main' }}>₹{item.leaveCut || 0}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>₹{item.subSalary || 0}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.tax`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField size="small" value={field.value || ''} disabled />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Controller
                                                    name={`staff.${index}.payableSalary`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Typography variant="subtitle2" fontWeight={800} color="primary.dark">₹{field.value || 0}</Typography>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.accountHolderName`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField size="small" fullWidth value={field.value || ''} onChange={field.onChange} error={!!error} />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.accountNumber`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField size="small" fullWidth value={field.value || ''} onChange={field.onChange} error={!!error} />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name={`staff.${index}.ifscCode`}
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField size="small" fullWidth value={field.value || ''} onChange={(e) => field.onChange(e.target.value.toUpperCase())} error={!!error} />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemove(index)}
                                                    sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) } }}
                                                >
                                                    <Trash size={16} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>

                    {/* ── Footer Actions ────────────────────────────────────────────────── */}
                    <Box
                        sx={{
                            p: 2.5,
                            bgcolor: alpha(theme.palette.secondary.main, 0.02),
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetForm}
                            startIcon={<Refresh size={18} />}
                            sx={{ minWidth: 120, borderRadius: 2, fontWeight: 600 }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={!isSubmitting && <MoneyTick size={20} variant="Bold" />}
                            sx={{
                                minWidth: 180,
                                height: 48,
                                borderRadius: 2,
                                fontWeight: 700,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                            }}
                        >
                            {isSubmitting ? 'Saving...' : 'Finalize Payroll'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Stack>
    );
};

export default Salary;