import { alpha, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MainCard from "components/MainCard";
import UseAddEditReturn from "./hooks/useAddEditReturn";
import {
    ArrowLeft,
    SearchNormal,
    Import,
    InfoCircle,
    Box1,
    Building,
    Call,
    Calendar,
    User,
    TickCircle,
    CloseCircle,
    Clock,
    Location,
    Money4
} from "iconsax-reactjs";
import { Controller } from "react-hook-form";
import moment from "moment";

// ── Helper: Status Chip ──────────────────────────────────────────────
const StatusChip = ({ status }: { status: string }) => {
    let color: any = "primary";
    if (status === 'RECEIVED') color = "success";
    if (status === 'CANCELLED') color = "error";
    if (status === 'PARTIALLY_RECEIVED') color = "warning";
    if (status === 'PENDING') color = "info";
    if (status === 'SENT') color = "primary";
    return <Chip label={status?.replace(/_/g, ' ')} color={color} size="small" variant="light" sx={{ fontWeight: 700, letterSpacing: '0.3px' }} />;
};

// ── Helper: Info Row ──────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.75 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value || '-'}</Typography>
    </Stack>
);

const AddEditReturn = () => {
    const theme = useTheme();
    const {
        challanCode,
        setChallanCode,
        searchChallan,
        challanDetails,
        fields,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        watch
    } = UseAddEditReturn();

    // Derived summary values from challanDetails
    const allItems = challanDetails?.items || [];
    const totalSent = allItems.reduce((acc: number, i: any) => acc + (i.givenQty || 0), 0);
    const totalReceived = allItems.reduce((acc: number, i: any) => acc + (i.receivedQty || 0), 0);
    const totalDamaged = allItems.reduce((acc: number, i: any) => acc + (i.damagedQty || 0), 0);
    const totalPending = allItems.reduce((acc: number, i: any) => acc + (i.pendingQty || 0), 0);
    const overallProgress = totalSent > 0 ? ((totalReceived + totalDamaged) / totalSent) * 100 : 0;
    const totalAmount = allItems.reduce((acc: number, i: any) => acc + ((i.price || 0) * (i.givenQty || 0)), 0);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MainCard content={false} sx={{ overflow: 'visible', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {/* ── Hero Header ──────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 3,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '18px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                flexShrink: 0
                            }}
                        >
                            <Import size={32} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                                Receive Items
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Enter a Challan Code to load pending items and record received quantities.
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={18} />}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 1.25,
                            borderWidth: '2px',
                            '&:hover': { borderWidth: '2px' }
                        }}
                    >
                        Back to List
                    </Button>
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* ── Section 1: Search Challan ─────────────────── */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <TextField
                                    fullWidth
                                    label="Challan Code"
                                    placeholder="e.g. LC000001"
                                    value={challanCode}
                                    onChange={(e) => setChallanCode(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            searchChallan();
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchNormal size={20} color={theme.palette.text.disabled} /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={searchChallan}
                                    disabled={!challanCode}
                                    sx={{ py: 1.8, px: 4, borderRadius: 2 }}
                                >
                                    Search
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                        {/* ═══════════════════════════════════════════════════════════════════
                            CHALLAN FOUND: Show detailed information
                            ═══════════════════════════════════════════════════════════════════ */}
                        {challanDetails && (
                            <>
                                {/* ── Challan Summary Banner ──────────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.info.main, 0.04)} 100%)`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                        }}
                                    >
                                        {/* Top row: Code + Status */}
                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2.5 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex' }}>
                                                    <InfoCircle size={28} color={theme.palette.primary.main} variant="Bulk" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" fontWeight={800}>{challanDetails.challanCode}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Challan Reference</Typography>
                                                </Box>
                                            </Stack>
                                            <StatusChip status={challanDetails.status} />
                                        </Stack>

                                        {/* Overall Progress Bar */}
                                        <Box sx={{ mb: 2.5 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">Overall Return Progress</Typography>
                                                <Typography variant="caption" fontWeight={700}>{Math.round(overallProgress)}%</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={overallProgress}
                                                color={overallProgress >= 100 ? "success" : overallProgress > 0 ? "warning" : "primary"}
                                                sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                                            />
                                        </Box>

                                        {/* Stats Row */}
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
                                                    <Typography variant="h4" fontWeight={800} color="primary.main">{totalSent}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Total Sent</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
                                                    <Typography variant="h4" fontWeight={800} color="success.main">{totalReceived}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Received</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
                                                    <Typography variant="h4" fontWeight={800} color="error.main">{totalDamaged}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Damaged</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
                                                    <Typography variant="h4" fontWeight={800} color="warning.main">{totalPending}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* ── Vendor & Branch Details ──────────────────── */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                            <Building size={22} color={theme.palette.primary.main} variant="Bulk" />
                                            <Typography variant="h6" fontWeight={700}>Vendor Details</Typography>
                                        </Stack>
                                        <Divider sx={{ mb: 1.5 }} />
                                        <InfoRow
                                            icon={<User size={16} color={theme.palette.text.disabled} />}
                                            label="Owner"
                                            value={challanDetails.px_vendor?.name}
                                        />
                                        <InfoRow
                                            icon={<Building size={16} color={theme.palette.text.disabled} />}
                                            label="Shop"
                                            value={challanDetails.px_vendor?.laundryName}
                                        />
                                        <InfoRow
                                            icon={<Call size={16} color={theme.palette.text.disabled} />}
                                            label="Phone"
                                            value={challanDetails.px_vendor?.phoneNumber ? `+${challanDetails.px_vendor?.countryCode || '91'} ${challanDetails.px_vendor?.phoneNumber}` : '-'}
                                        />
                                        <InfoRow
                                            icon={<Location size={16} color={theme.palette.text.disabled} />}
                                            label="Address"
                                            value={challanDetails.px_vendor?.address}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                            <Calendar size={22} color={theme.palette.primary.main} variant="Bulk" />
                                            <Typography variant="h6" fontWeight={700}>Challan Details</Typography>
                                        </Stack>
                                        <Divider sx={{ mb: 1.5 }} />
                                        <InfoRow
                                            icon={<Calendar size={16} color={theme.palette.text.disabled} />}
                                            label="Given Date"
                                            value={moment(challanDetails.givenDate).format('DD MMM YYYY')}
                                        />
                                        <InfoRow
                                            icon={<Clock size={16} color={theme.palette.text.disabled} />}
                                            label="Created"
                                            value={moment(challanDetails.createdAt).format('DD MMM YYYY, hh:mm A')}
                                        />
                                        <InfoRow
                                            icon={<Building size={16} color={theme.palette.text.disabled} />}
                                            label="Branch"
                                            value={challanDetails.px_user?.branchName}
                                        />
                                        <InfoRow
                                            icon={<Money4 size={16} color={theme.palette.text.disabled} />}
                                            label="Total Amount"
                                            value={`₹${totalAmount.toLocaleString('en-IN')}/-`}
                                        />
                                    </Box>
                                </Grid>

                                {/* ── All Items Overview Table ──────────────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                        <Box1 size={22} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h6" fontWeight={700}>All Challan Items</Typography>
                                    </Stack>
                                    <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Sent</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Received</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Damaged</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Pending</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Price/pc</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Progress</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {allItems.map((item: any) => {
                                                    const itemProgress = item.givenQty > 0 ? ((item.receivedQty + item.damagedQty) / item.givenQty) * 100 : 0;
                                                    return (
                                                        <TableRow key={item.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight={600}>{item.px_laundry_item?.itemName || '-'}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">{item.givenQty}</TableCell>
                                                            <TableCell align="center">
                                                                <Typography color="success.main" fontWeight={600}>{item.receivedQty}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography color={item.damagedQty > 0 ? "error.main" : "text.secondary"} fontWeight={600}>{item.damagedQty}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography color={item.pendingQty > 0 ? "warning.main" : "text.secondary"} fontWeight={600}>{item.pendingQty}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">₹{item.price || 0}</TableCell>
                                                            <TableCell align="center"><StatusChip status={item.status} /></TableCell>
                                                            <TableCell align="center" sx={{ minWidth: 100 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={itemProgress}
                                                                    color={itemProgress >= 100 ? "success" : "warning"}
                                                                    sx={{ height: 6, borderRadius: 3 }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                {/* ── Previous Returns History ──────────────────── */}
                                {challanDetails.returns && challanDetails.returns.length > 0 && (
                                    <Grid size={{ xs: 12 }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                            <Clock size={22} color={theme.palette.secondary.main} variant="Bulk" />
                                            <Typography variant="h6" fontWeight={700}>Previous Returns ({challanDetails.returns.length})</Typography>
                                        </Stack>
                                        <Stack spacing={2}>
                                            {challanDetails.returns.map((ret: any, rIdx: number) => (
                                                <Box
                                                    key={ret.id}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(theme.palette.secondary.main, 0.03),
                                                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
                                                    }}
                                                >
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                        <Typography variant="subtitle2" fontWeight={700}>
                                                            Return #{rIdx + 1} — {moment(ret.returnDate).format('DD MMM YYYY')}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {moment(ret.createdAt).format('DD MMM YYYY, hh:mm A')}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={3} flexWrap="wrap">
                                                        {ret.items?.map((ri: any) => {
                                                            const challanItem = allItems.find((ci: any) => ci.id === ri.challanItemID);
                                                            return (
                                                                <Stack key={ri.id} direction="row" spacing={1} alignItems="center">
                                                                    <Typography variant="body2" fontWeight={600}>
                                                                        {challanItem?.px_laundry_item?.itemName || `Item #${ri.challanItemID}`}:
                                                                    </Typography>
                                                                    {ri.receivedQty > 0 && (
                                                                        <Chip
                                                                            icon={<TickCircle size={14} />}
                                                                            label={`${ri.receivedQty} good`}
                                                                            size="small"
                                                                            color="success"
                                                                            variant="light"
                                                                            sx={{ fontWeight: 600 }}
                                                                        />
                                                                    )}
                                                                    {ri.damagedQty > 0 && (
                                                                        <Chip
                                                                            icon={<CloseCircle size={14} />}
                                                                            label={`${ri.damagedQty} damaged`}
                                                                            size="small"
                                                                            color="error"
                                                                            variant="light"
                                                                            sx={{ fontWeight: 600 }}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            );
                                                        })}
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Grid>
                                )}

                                <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                                {/* ── Pending Items Form (Receive Now) ──────────── */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <Import size={24} color={theme.palette.primary.main} variant="Bulk" />
                                        <Typography variant="h5" fontWeight={700}>Receive Now</Typography>
                                        {fields.length > 0 && (
                                            <Chip label={`${fields.length} pending`} size="small" color="warning" variant="light" sx={{ fontWeight: 700 }} />
                                        )}
                                    </Stack>

                                    {fields.length === 0 ? (
                                        <Box sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.04), border: `1px solid ${alpha(theme.palette.success.main, 0.15)}` }}>
                                            <TickCircle size={48} color={theme.palette.success.main} variant="Bulk" />
                                            <Typography variant="h6" fontWeight={700} color="success.main" sx={{ mt: 1.5 }}>All Items Received!</Typography>
                                            <Typography variant="body2" color="text.secondary">No pending items remaining for this challan.</Typography>
                                        </Box>
                                    ) : (
                                        <Stack spacing={3}>
                                            {fields.map((item, index) => {
                                                const pending = watch(`items.${index}.pendingQty`);
                                                return (
                                                    <Box
                                                        key={item.id}
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 4,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                        }}
                                                    >
                                                        <Grid container spacing={3} alignItems="center">
                                                            <Grid size={{ xs: 12, md: 4 }}>
                                                                <Typography variant="h6">{item.itemName}</Typography>
                                                                <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                                                                    <Chip label={`Sent: ${item.givenQty}`} size="small" variant="outlined" />
                                                                    <Chip label={`Pending: ${item.pendingQty}`} size="small" color="warning" variant="light" />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 4 }}>
                                                                <Controller
                                                                    name={`items.${index}.receivedQty`}
                                                                    control={control}
                                                                    rules={{
                                                                        validate: (value) => {
                                                                            const val = parseInt(value || "0");
                                                                            if (val < 0) return 'Cannot be negative';
                                                                            const dam = parseInt(watch(`items.${index}.damagedQty`) || "0");
                                                                            if (val + dam > pending) return `Total cannot exceed ${pending}`;
                                                                            return true;
                                                                        }
                                                                    }}
                                                                    render={({ field, fieldState: { error } }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Good Condition (Received)"
                                                                            error={!!error}
                                                                            helperText={error?.message}
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">{item.unitName}</InputAdornment>
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 4 }}>
                                                                <Controller
                                                                    name={`items.${index}.damagedQty`}
                                                                    control={control}
                                                                    rules={{
                                                                        validate: (value) => {
                                                                            const val = parseInt(value || "0");
                                                                            if (val < 0) return 'Cannot be negative';
                                                                            const rec = parseInt(watch(`items.${index}.receivedQty`) || "0");
                                                                            if (rec + val > pending) return `Total cannot exceed ${pending}`;
                                                                            return true;
                                                                        }
                                                                    }}
                                                                    render={({ field, fieldState: { error } }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Damaged / Lost"
                                                                            color="error"
                                                                            error={!!error}
                                                                            helperText={error?.message}
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">{item.unitName}</InputAdornment>
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    )}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>

                {/* ── Footer Actions ───────────────────────────────────── */}
                <Box
                    sx={{
                        p: 3,
                        px: 4,
                        bgcolor: alpha(theme.palette.secondary.main, 0.02),
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        sx={{
                            minWidth: 120,
                            borderRadius: '12px',
                            py: 1.25,
                            order: { xs: 2, sm: 1 }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !challanDetails || fields.length === 0}
                        sx={{
                            minWidth: 180,
                            borderRadius: '12px',
                            py: 1.25,
                            order: { xs: 1, sm: 2 },
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                            '&:hover': {
                                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                            }
                        }}
                    >
                        {isSubmitting ? "Processing..." : "Submit Received Items"}
                    </Button>
                </Box>
            </MainCard>
        </form>
    )
}

export default AddEditReturn;
