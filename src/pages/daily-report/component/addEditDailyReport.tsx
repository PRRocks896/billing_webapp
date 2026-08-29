import { Controller } from 'react-hook-form';
import {
    Building, ArrowLeft, Save2, AddCircle, Trash,
    Calendar1, People, WalletMoney, Moneys, Calculator, ScanBarcode, Receipt21
} from 'iconsax-reactjs';

import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'components/MainCard';

import useAddEditDailyReport from "../hooks/useAddEditDailyReport";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import InputAdornment from '@mui/material/InputAdornment';

// ─── Numbered Section Header ───────────────────────────────────────────────────
const NumberedSectionHeader = ({ step, icon, label, description }: { step: string | number, icon: React.ReactNode; label: string, description?: string }) => {
    const theme = useTheme();
    return (
        <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    {step}
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box> */}
                    {label}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', ml: 1 }} />
            </Stack>
            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5 }}>
                    {description}
                </Typography>
            )}
        </Stack>
    );
};

const AddEditDailyReport = () => {
    const theme = useTheme();
    const {
        mode,
        title,
        fields,
        control,
        isAdmin,
        branchList,
        isSubmitting,
        isOpeningBalanceDisable,
        onSubmit,
        handleBack,
        handleSubmit,
        handleAddExpense,
        handleRemoveExpense,
        fetchPreviousDateEntry,
    } = useAddEditDailyReport();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* ── Friendly Hero Header ──────────────────────────────────────── */}
            <Box
                sx={{
                    px: 3,
                    py: 3.5,
                    mb: 3,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                    >
                        <Building size={32} color="#fff" variant="Bold" />
                    </Box>
                    <Box>
                        <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                            {mode === 'add' ? 'Submit Today\'s Report' : 'Edit Report'}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Fill out the details for today. Follow the simple steps numbered below.
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleBack}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{ borderRadius: 2, py: 1, px: 2 }}
                >
                    Go Back
                </Button>
            </Box>

            <Grid container spacing={3}>

                {/* ── Main Form Column ───────────────────────────────────────── */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={4}>

                        {/* ── Step 1 ──────────────────────────── */}
                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="1"
                                icon={<Calendar1 />}
                                label="Basic Details"
                                description="Select the branch, date, and manager."
                            />
                            <Grid container spacing={3}>
                                {isAdmin && (
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                        <Controller
                                            name='userID'
                                            control={control}
                                            rules={{ required: "Selecting a branch is required" }}
                                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    freeSolo
                                                    disablePortal
                                                    getOptionLabel={(option: any) => option.lastName || option.branchName || ''}
                                                    options={branchList || []}
                                                    value={branchList?.find((branch: any) => branch.id === value) || null}
                                                    onChange={(_, val) => {
                                                        onChange(val?.id);
                                                        // fetchPreviousDateEntry();
                                                    }}
                                                    onBlur={onBlur}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            label="Which Branch?"
                                                            error={!!error}
                                                            helperText={error?.message || "Select the salon branch"}
                                                            InputProps={{ ...params.InputProps, sx: { fontSize: '1.1rem' } }}
                                                            InputLabelProps={{ sx: { fontSize: '1.1rem' } }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='dailyReportDate'
                                        control={control}
                                        rules={{ required: "Selecting a date is required" }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Report Date"
                                                type='date'
                                                error={!!error}
                                                helperText={error?.message || "Pick the date for this report"}
                                                value={value}
                                                onChange={(e) => {
                                                    onChange(e);
                                                    fetchPreviousDateEntry()
                                                }}
                                                onBlur={onBlur}
                                                InputLabelProps={{ shrink: true, sx: { fontSize: '1.1rem' } }}
                                                InputProps={{ sx: { fontSize: '1.1rem' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='managerName'
                                        control={control}
                                        rules={{ required: "Manager name is required" }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Manager's Name"
                                                error={!!error}
                                                helperText={error?.message || "Name of the person managing today"}
                                                value={value}
                                                disabled
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{ sx: { fontSize: '1.1rem', fontWeight: 600 } }}
                                                InputLabelProps={{ sx: { fontSize: '1.1rem' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </MainCard>

                        {/* ── Step 2 ──────────────────────────── */}
                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="2"
                                icon={<People />}
                                label="Attendance Basics"
                                description="How many people came to the salon today?"
                            />
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='totalStaffPresent'
                                        control={control}
                                        rules={{
                                            required: "Enter Staff count",
                                            pattern: { value: /^[0-9]+$/, message: "Use numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Total Staff Present"
                                                placeholder="e.g. 5"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Count of working staff"}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{ sx: { fontSize: '1.2rem', textAlign: 'center' } }}
                                                inputProps={{ style: { textAlign: 'center' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='totalCustomer'
                                        control={control}
                                        rules={{
                                            required: "Enter Customer count",
                                            pattern: { value: /^[0-9]+$/, message: "Use numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Total Customers"
                                                placeholder="e.g. 15"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Total clients served"}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{ sx: { fontSize: '1.2rem', textAlign: 'center' } }}
                                                inputProps={{ style: { textAlign: 'center' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name='totalMemberGuest'
                                        control={control}
                                        rules={{
                                            required: "Enter Member Guest count",
                                            pattern: { value: /^[0-9]+$/, message: "Use numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Total Member Guests"
                                                placeholder="e.g. 2"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Members & their guests"}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{ sx: { fontSize: '1.2rem', textAlign: 'center' } }}
                                                inputProps={{ style: { textAlign: 'center' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </MainCard>

                        {/* ── Step 3 ──────────────────────────── */}
                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="3"
                                icon={<WalletMoney />}
                                label="Earnings Collections"
                                description="Enter the money received in different payment forms."
                            />
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='openBalance'
                                        control={control}
                                        rules={{
                                            required: "Enter Morning Cash",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Morning Cash (Opening Balance)"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Cash available at morning opening time."}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                disabled={isOpeningBalanceDisable}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem', bgcolor: alpha(theme.palette.warning.light, 0.05) }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='cashSale'
                                        control={control}
                                        rules={{
                                            required: "Enter Cash Sale",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Cash Earnings"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Cash received directly from clients."}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem' }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='cardSale'
                                        control={control}
                                        rules={{
                                            required: "Enter Card Sale",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Card Machine Earnings"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Payments received through swiping machine."}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem' }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='upiSale'
                                        control={control}
                                        rules={{
                                            required: "Enter UPI Sale",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Online/UPI Earnings"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Google Pay, PhonePe, Paytm, etc."}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem' }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='dealsAppSale'
                                        control={control}
                                        rules={{
                                            required: "Enter Deals App Sale",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Deals App Earnings"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Payments from third-party Deal apps."}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem' }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='totalSales'
                                        control={control}
                                        rules={{
                                            required: "Enter Total Sale",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                fullWidth
                                                label="Total Sale (Sum of all above)"
                                                value={value}
                                                disabled
                                                InputProps={{
                                                    readOnly: true,
                                                    startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                    sx: { fontSize: '1.2rem', fontWeight: 600 }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.light, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }}>
                                        <Typography variant="subtitle2" color="success.dark" sx={{ mb: 1 }}>AUTO-CALCULATED FIELD</Typography>
                                        <Controller
                                            name='totalCash'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <TextField
                                                    fullWidth
                                                    type='text'
                                                    label="Total Cash + Morning Cash"
                                                    value={value ? `₹ ${value}` : '₹ 0.00'}
                                                    InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true,
                                                        sx: { fontSize: '1.5rem', fontWeight: 700, color: theme.palette.success.dark, '.Mui-disabled': { WebkitTextFillColor: theme.palette.success.dark } }
                                                    }}
                                                    variant="standard"
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </MainCard>

                        {/* ── Step 4 ──────────────────────── */}
                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="4"
                                icon={<Receipt21 />}
                                label="Daily Expenses"
                                description="List down today's purchases (tea, supplies, water, etc.)"
                            />
                            <Stack spacing={2}>
                                {fields?.map((item: any, index: number) => (
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} key={item.id || index} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.light, 0.05) }}>
                                        <Box flex={{ xs: 1, sm: 2 }}>
                                            <Controller
                                                name={`expense.${index}.description`}
                                                control={control}
                                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                    <TextField
                                                        fullWidth
                                                        label={`Expense #${index + 1} Name`}
                                                        placeholder="e.g. Office Supplies"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        InputProps={{ sx: { fontSize: '1.1rem' } }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box flex={1}>
                                            <Controller
                                                name={`expense.${index}.amount`}
                                                control={control}
                                                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                    <TextField
                                                        fullWidth
                                                        label="Cost Amount"
                                                        type='text'
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        value={value}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>,
                                                            sx: { fontSize: '1.1rem' }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Stack direction="row" spacing={1} sx={{ pt: { xs: 1, sm: 0 }, justifyContent: { xs: 'flex-end', sm: 'center' } }}>
                                            {fields.length !== 1 && (
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => handleRemoveExpense(index)}
                                                    startIcon={<Trash size={18} />}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Stack>
                                    </Stack>
                                ))}
                                <Button
                                    color="primary"
                                    variant="dashed"
                                    onClick={handleAddExpense}
                                    startIcon={<AddCircle size={22} />}
                                    sx={{ py: 2, borderStyle: 'dashed', borderWidth: 2 }}
                                >
                                    Add Another Expense
                                </Button>
                            </Stack>
                        </MainCard>

                        {/* ── Step 5 ──────────────────────── */}
                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="5"
                                icon={<Moneys />}
                                label="Cash Notes Count"
                                description="Enter the total count of each cash note available in the shop counter."
                            />
                            <TableContainer sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                                <Table size="medium">
                                    <TableBody>
                                        {[
                                            { label: '500', name: 'fiveHundred', display: '₹500 Notes' },
                                            { label: '200', name: 'twoHundred', display: '₹200 Notes' },
                                            { label: '100', name: 'oneHundred', display: '₹100 Notes' },
                                            { label: '50', name: 'fifty', display: '₹50 Notes' }
                                        ].map((row) => (
                                            <TableRow key={row.name} hover>
                                                <TableCell sx={{ minWidth: 120, fontSize: '1.1rem', fontWeight: 600 }}>{row.display}</TableCell>
                                                <TableCell align="center" sx={{ width: '20px', fontSize: '1.2rem', color: theme.palette.text.secondary }}>x</TableCell>
                                                <TableCell sx={{ width: 140 }}>
                                                    <Controller
                                                        name={row.name as any}
                                                        control={control}
                                                        rules={{ required: 'Enter Note Count' }}
                                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                                            <TextField
                                                                fullWidth
                                                                placeholder="How many?"
                                                                type='text'
                                                                error={!!error}
                                                                value={value || ''}
                                                                onChange={onChange}
                                                                onBlur={onBlur}
                                                                InputProps={{ sx: { fontSize: '1.1rem', textAlign: 'center' } }}
                                                                inputProps={{ style: { textAlign: 'center' } }}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: '20px', fontSize: '1.2rem', color: theme.palette.text.secondary }}>=</TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={row.name as any}
                                                        control={control}
                                                        render={({ field: { value } }) => (
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Total Value"
                                                                type='text'
                                                                value={Number(row.label) * (value || 0) > 0 ? `₹ ${Number(row.label) * (value || 0)}` : '₹ 0'}
                                                                disabled
                                                                variant="filled"
                                                                InputProps={{ readOnly: true, disableUnderline: true, sx: { fontSize: '1.1rem', fontWeight: 'bold' } }}
                                                                sx={{ '.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>

                    </Stack>
                </Grid>

                {/* ── Summary & Actions Column ───────────────────────────── */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Box sx={{ position: { xs: 'static', lg: 'sticky' }, top: 88 }}>

                        <MainCard sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`, boxShadow: theme.customShadows.z1 }}>
                            <NumberedSectionHeader
                                step="6"
                                icon={<Calculator />}
                                label="Summary & Final Calculations"
                            />
                            <Stack spacing={3}>

                                <Box sx={{ p: 2, border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                                    <Controller
                                        name='totalExpenses'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                fullWidth
                                                label="Sum of All Daily Expenses"
                                                type='text'
                                                value={value}
                                                disabled
                                                InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>, sx: { fontSize: '1.1rem' } }}
                                            />
                                        )}
                                    />
                                </Box>

                                <Controller
                                    name='tipsCard'
                                    control={control}
                                    rules={{
                                        required: "Enter Tips from Card",
                                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label="Staff Tips via Card"
                                            type='text'
                                            error={!!error}
                                            helperText={error?.message}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>, sx: { fontSize: '1.1rem' } }}
                                        />
                                    )}
                                />

                                <Controller
                                    name='totalCard'
                                    control={control}
                                    rules={{
                                        required: "Enter Commission",
                                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label="Staff/Therapist 25% Share"
                                            type='text'
                                            error={!!error}
                                            helperText={error?.message || "Amount given to therapists"}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>, sx: { fontSize: '1.1rem' } }}
                                        />
                                    )}
                                />

                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), borderRadius: 2 }}>
                                    <Controller
                                        name='nextDayCash'
                                        control={control}
                                        rules={{
                                            required: "Enter Tomorrow's Cash",
                                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                fullWidth
                                                label="Money Kept For Tomorrow"
                                                type='text'
                                                error={!!error}
                                                helperText={error?.message || "Next day starting change"}
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>, sx: { fontSize: '1.1rem' } }}
                                            />
                                        )}
                                    />
                                </Box>

                                <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, border: `2px solid ${alpha(theme.palette.success.main, 0.3)}` }}>
                                    <Controller
                                        name='grandCash'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Stack spacing={0.5}>
                                                <Typography variant="subtitle2" color="success.dark">FINAL CASH IN HAND</Typography>
                                                <TextField
                                                    fullWidth
                                                    type='text'
                                                    value={value ? `₹ ${value}` : ''}
                                                    inputProps={{ readOnly: true }}
                                                    disabled
                                                    variant="standard"
                                                    InputProps={{ disableUnderline: true, sx: { fontWeight: 800, fontSize: '1.8rem', color: theme.palette.success.dark, '.Mui-disabled': { WebkitTextFillColor: theme.palette.success.dark } } }}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Box>

                                <Controller
                                    name='salonCustomerCash'
                                    control={control}
                                    rules={{
                                        required: 'Enter Salon Customer Cash',
                                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Numbers only" }
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label="Salon Customer Cash"
                                            type='text'
                                            error={!!error}
                                            helperText={error?.message}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Typography variant="h6">₹</Typography></InputAdornment>, sx: { fontSize: '1.1rem' } }}
                                        />
                                    )}
                                />

                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                                    <Controller
                                        name='cashInCover'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Stack spacing={0.5}>
                                                <Typography variant="subtitle2" color="info.dark">CASH TO BE PUT IN COVER</Typography>
                                                <TextField
                                                    fullWidth
                                                    type='text'
                                                    value={value ? `₹ ${value}` : ''}
                                                    inputProps={{ readOnly: true }}
                                                    disabled
                                                    variant="standard"
                                                    InputProps={{ disableUnderline: true, sx: { fontWeight: 'bold', fontSize: '1.4rem', color: theme.palette.info.dark, '.Mui-disabled': { WebkitTextFillColor: theme.palette.info.dark } } }}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Box>

                                {/* <Controller
                                    name='barcodeNumber'
                                    control={control}
                                    rules={{ required: 'Required Field' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label="Barcode / Receipt Number"
                                            type='text'
                                            error={!!error}
                                            helperText={error?.message || "Scan or type the barcode number"}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><ScanBarcode size={24} color={theme.palette.primary.main} /></InputAdornment>, sx: { fontSize: '1.2rem', fontWeight: 600 } }}
                                        />
                                    )}
                                /> */}
                            </Stack>
                        </MainCard>

                        <MainCard sx={{ boxShadow: theme.customShadows.z1 }}>
                            <Stack spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<Save2 size={24} />}
                                    disabled={isSubmitting}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                                    }}
                                >
                                    {mode === 'add' ? (isSubmitting ? 'Please wait...' : 'Submit Final Report') : (isSubmitting ? 'Please wait...' : 'Save Changes')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    color="secondary"
                                    startIcon={<ArrowLeft size={20} />}
                                    onClick={handleBack}
                                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                                >
                                    Cancel and Go Back
                                </Button>
                            </Stack>
                        </MainCard>

                    </Box>
                </Grid>

            </Grid>
        </form>
    )
}

export default AddEditDailyReport;