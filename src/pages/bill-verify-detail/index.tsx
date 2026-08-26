import React from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MainCard from "components/MainCard";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

// Icons
import {
    Receipt2,
    TickCircle,
    CloseCircle,
    Warning2,
    SearchNormal1,
    Refresh2,
    DirectboxReceive,
    Money4,
    WalletMoney,
    Cards,
    DocumentText,
    Export,
    Eye,
    Calendar1,
    Shop,
    Building,
    User,
    Profile2User
} from "iconsax-reactjs";

import ExportSection from "./component/exportSection";
import UseBillVerifyDetail, { getPaymentColor } from "./hooks/useBillVerifyDetail";
import { formatCurrency } from "utils/helper";

const BillVerifyDetail = () => {
    const theme = useTheme();

    const {
        // Table & Pagination
        list,
        page,
        rows,
        totalCount,
        isLoading,
        hasLoaded,
        sectionRights,
        // Filters State
        fromDate,
        toDate,
        selectedCompany,
        companyOptions,
        selectedCity,
        cityOptions,
        selectedBranch,
        branchOptions,
        statusOptions,
        selectedStatus,
        excludeCash,
        searchText,

        // Aggregated Stats
        stats,

        // Modal
        selectedBillForModal,
        isDetailModalOpen,

        // Auth
        isAdmin,

        // Handlers
        fetch,
        setPage,
        setRows,
        setToDate,
        setFromDate,
        setSelectedCompany,
        setSelectedCity,
        setSelectedBranch,
        setSelectedStatus,
        setExcludeCash,
        setSearchText,
        setDateRangePreset,
        handleOpenDetailModal,
        handleCloseDetailModal,
        handleExportCSV
    } = UseBillVerifyDetail();

    return (
        <Stack spacing={3}>
            {/* ── Page Header ──────────────────────────────────────────────────────── */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: "primary.lighter",
                            borderRadius: 2.5,
                            display: "flex",
                            color: "primary.main",
                            boxShadow: "0 4px 12px 0 rgba(70, 128, 255, 0.15)"
                        }}
                    >
                        <Receipt2 size={32} variant="Bulk" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Bill Verification & Reconciliation Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Comprehensive administrative audit log and statement verification reports across all branches.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    {sectionRights?.['admin_section']?.view && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Refresh2 size={18} />}
                            onClick={() => fetch(page, rows)}
                            disabled={isLoading}
                            size="medium"
                        >
                            Refresh
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* ── Export Section Component ────────────────────────────────────────── */}
            {sectionRights?.['export_section']?.view && (
                <ExportSection />
            )}

            {/* ── Admin Section ───────────────────────────────────────────────────── */}
            {sectionRights?.['admin_section']?.view &&
                <>
                    {/* ── Advanced Search & Filter Controls ─────────────────────────────────── */}
                    <MainCard
                        border={false}
                        shadow="0 2px 14px 0 rgb(32 40 45 / 8%)"
                        sx={{
                            background: theme.palette.mode === "dark" ? undefined : "#FFFFFF",
                            borderRadius: 3
                        }}
                    >
                        <Stack spacing={2.5}>
                            {/* Quick Date Range Shortcuts */}
                            {/* <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", mr: 0.5 }}>
                                    Quick Range:
                                </Typography>
                                <Chip
                                    label="Today"
                                    size="small"
                                    onClick={() => setDateRangePreset("today")}
                                    clickable
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                <Chip
                                    label="Yesterday"
                                    size="small"
                                    onClick={() => setDateRangePreset("yesterday")}
                                    clickable
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                <Chip
                                    label="This Week"
                                    size="small"
                                    onClick={() => setDateRangePreset("this_week")}
                                    clickable
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                <Chip
                                    label="This Month"
                                    size="small"
                                    onClick={() => setDateRangePreset("this_month")}
                                    clickable
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                <Chip
                                    label="Last Month"
                                    size="small"
                                    onClick={() => setDateRangePreset("last_month")}
                                    clickable
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Stack>

                            <Divider /> */}

                            {/* Filter Inputs Grid */}
                            <Grid container spacing={2} alignItems="center">
                                {/* From Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="From Date"
                                                format="dd/MM/yyyy"
                                                value={fromDate}
                                                onChange={(val: Date | null) => setFromDate(val)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small"
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>

                                {/* To Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="To Date"
                                                format="dd/MM/yyyy"
                                                value={toDate}
                                                onChange={(val: Date | null) => setToDate(val)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small"
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>

                                {/* Company (Admin only) */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={companyOptions}
                                        getOptionLabel={(option) => option.companyName || ""}
                                        value={companyOptions.find((option: any) => option.id === selectedCompany) || null}
                                        onChange={(_, newValue) => setSelectedCompany(newValue?.id || null)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Company" placeholder="All Companies" />
                                        )}
                                    />
                                </Grid>

                                {/* City (Admin only) */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={cityOptions}
                                        disabled={!selectedCompany}
                                        getOptionLabel={(option: any) => option?.name || ""}
                                        isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
                                        value={cityOptions?.find((option: any) => option.id === selectedCity) || null}
                                        onChange={(_, newValue) => setSelectedCity(newValue?.id || null)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="City" placeholder={selectedCompany ? "All Cities" : "Select Company"} />
                                        )}
                                    />
                                </Grid>

                                {/* Branch */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={branchOptions}
                                        disabled={!selectedCity}
                                        getOptionLabel={(option: any) => option?.lastName || option?.branchName || option?.firstName || ""}
                                        isOptionEqualToValue={(option: any, value: any) => option.id === value}
                                        value={branchOptions?.find((option: any) => option.id === selectedBranch) || null}
                                        onChange={(_, newValue) => setSelectedBranch(newValue?.id || null)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Branch" placeholder={selectedCity ? "All Branches" : "Select City"} />
                                        )}
                                    />
                                </Grid>

                                {/* Status Filter */}
                                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={statusOptions}
                                        getOptionLabel={(option: any) => option?.label || ""}
                                        value={statusOptions?.find((option: any) => option.value === selectedStatus) || statusOptions[0]}
                                        onChange={(_, newValue) => setSelectedStatus(newValue?.value ?? null)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Verification Status" />
                                        )}
                                    />
                                </Grid>

                                {/* Live Search */}
                                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search by Bill #, Customer, Staff, Card #..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchNormal1 size={16} />
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Exclude Cash Toggle */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex", alignItems: "center" }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={excludeCash}
                                                onChange={(e) => setExcludeCash(e.target.checked)}
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                                Exclude Cash Transactions
                                            </Typography>
                                        }
                                    />
                                </Grid>

                                {/* Search & Apply Button */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Button
                                        fullWidth
                                        size="medium"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setPage(0); fetch(0, rows); }}
                                        disabled={isLoading}
                                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SearchNormal1 size={18} />}
                                        sx={{ height: 40, fontWeight: 700 }}
                                    >
                                        {isLoading ? "Searching..." : "Search"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </MainCard>

                    {/* ── Executive Metric KPI Dashboard ────────────────────────────────────── */}
                    {hasLoaded && (
                        <>
                            <Grid container spacing={2.5} alignItems="stretch">
                                {/* 1. Total Bills Card */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                                    <MainCard
                                        content={false}
                                        sx={{
                                            p: 2.5,
                                            width: "100%",
                                            height: "100%",
                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                            borderRadius: 3,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    Total Filtered Invoices
                                                </Typography>
                                                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, color: "primary.main", display: "flex" }}>
                                                    <DocumentText size={20} />
                                                </Box>
                                            </Stack>
                                            <Typography variant="h3" fontWeight={700}>
                                                {stats.totalCount}
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ minHeight: 28, display: "flex", alignItems: "center", mt: 1.5 }}>
                                            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="nowrap" sx={{ width: "100%", overflow: "hidden" }}>
                                                <Chip
                                                    label={`${stats.verifiedCount} Verified`}
                                                    size="small"
                                                    color="success"
                                                    sx={{ height: 22, fontSize: "0.72rem", fontWeight: 600 }}
                                                />
                                                <Chip
                                                    label={`${stats.pendingCount} Pending`}
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                    sx={{ height: 22, fontSize: "0.72rem", fontWeight: 600 }}
                                                />
                                                {stats.mismatchCount > 0 && (
                                                    <Chip
                                                        label={`${stats.mismatchCount} Diff`}
                                                        size="small"
                                                        color="error"
                                                        sx={{ height: 22, fontSize: "0.72rem", fontWeight: 600 }}
                                                    />
                                                )}
                                            </Stack>
                                        </Box>
                                    </MainCard>
                                </Grid>

                                {/* 2. Total Billed Sales Amount */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                                    <MainCard
                                        content={false}
                                        sx={{
                                            p: 2.5,
                                            width: "100%",
                                            height: "100%",
                                            bgcolor: alpha(theme.palette.info.main, 0.04),
                                            borderColor: alpha(theme.palette.info.main, 0.2),
                                            borderRadius: 3,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    Gross Billed Total
                                                </Typography>
                                                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2, color: "info.main", display: "flex" }}>
                                                    <WalletMoney size={20} />
                                                </Box>
                                            </Stack>
                                            <Typography variant="h3" fontWeight={700} color="info.main">
                                                {formatCurrency(stats.totalGrandTotal)}
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ minHeight: 28, display: "flex", alignItems: "center", mt: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                Total sales value (excl. cash)
                                            </Typography>
                                        </Box>
                                    </MainCard>
                                </Grid>

                                {/* 3. Statement Received Amount */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                                    <MainCard
                                        content={false}
                                        sx={{
                                            p: 2.5,
                                            width: "100%",
                                            height: "100%",
                                            bgcolor: alpha(theme.palette.success.main, 0.04),
                                            borderColor: alpha(theme.palette.success.main, 0.2),
                                            borderRadius: 3,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    Statement Received
                                                </Typography>
                                                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, color: "success.main", display: "flex" }}>
                                                    <Money4 size={20} />
                                                </Box>
                                            </Stack>
                                            <Typography variant="h3" fontWeight={700} color="success.main">
                                                {formatCurrency(stats.totalStatementAmount)}
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ minHeight: 28, display: "flex", alignItems: "center", mt: 1.5, width: "100%" }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={stats.verifiedPercentage}
                                                    color="success"
                                                    sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                                />
                                                <Typography variant="caption" fontWeight={700} color="success.dark">
                                                    {stats.verifiedPercentage}%
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </MainCard>
                                </Grid>

                                {/* 4. Net Reconciliation Variance */}
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
                                    <MainCard
                                        content={false}
                                        sx={{
                                            p: 2.5,
                                            width: "100%",
                                            height: "100%",
                                            bgcolor: stats.totalVariance === 0 ? alpha(theme.palette.success.main, 0.04) : alpha(theme.palette.error.main, 0.04),
                                            borderColor: stats.totalVariance === 0 ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                                            borderRadius: 3,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    Net Reconciliation Variance
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        bgcolor: stats.totalVariance === 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                        borderRadius: 2,
                                                        color: stats.totalVariance === 0 ? "success.main" : "error.main",
                                                        display: "flex"
                                                    }}
                                                >
                                                    {stats.totalVariance === 0 ? <TickCircle size={20} /> : <Warning2 size={20} />}
                                                </Box>
                                            </Stack>
                                            <Typography variant="h3" fontWeight={700} color={stats.totalVariance === 0 ? "success.main" : "error.main"}>
                                                {stats.totalVariance > 0 ? `+${formatCurrency(stats.totalVariance)}` : formatCurrency(stats.totalVariance)}
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ minHeight: 28, display: "flex", alignItems: "center", mt: 1.5 }}>
                                            <Typography
                                                variant="caption"
                                                color={stats.totalVariance === 0 ? "success.dark" : "error.main"}
                                                fontWeight={600}
                                                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                            >
                                                {stats.totalVariance === 0
                                                    ? "✓ Perfect Match (No Variance)"
                                                    : stats.totalVariance > 0
                                                        ? `+${formatCurrency(stats.totalVariance)} Surplus`
                                                        : `Shortage of ${formatCurrency(Math.abs(stats.totalVariance))}`}
                                            </Typography>
                                        </Box>
                                    </MainCard>
                                </Grid>
                            </Grid>

                            {/* Payment Mode Distribution Bar */}
                            {stats.paymentBreakdown && stats.paymentBreakdown.length > 0 && (
                                <MainCard content={false} sx={{ p: 2, borderRadius: 2.5, bgcolor: "background.paper" }}>
                                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Cards size={18} variant="Bulk" />
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                Online / Bank Payment Breakdown:
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                            {stats.paymentBreakdown.map((item) => {
                                                const pColor = getPaymentColor(item.name);
                                                return (
                                                    <Chip
                                                        key={item.name}
                                                        label={
                                                            <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                                                <strong style={{ textTransform: "uppercase" }}>{item.name}:</strong>
                                                                <span>{formatCurrency(item.total)}</span>
                                                                <span style={{ opacity: 0.7 }}>({item.count})</span>
                                                            </Box>
                                                        }
                                                        size="small"
                                                        sx={{
                                                            bgcolor: pColor.bg,
                                                            color: pColor.text,
                                                            border: `1px solid ${pColor.border}`,
                                                            fontWeight: 600,
                                                            height: 28
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Stack>
                                </MainCard>
                            )}
                        </>
                    )}

                    {/* ── Detailed Admin Reconciliation Table ───────────────────────────────── */}
                    <MainCard
                        content={false}
                        border={false}
                        shadow="0 2px 14px 0 rgb(32 40 45 / 8%)"
                        sx={{ borderRadius: 3, overflow: "hidden" }}
                    >
                        <TableContainer component={Paper} sx={{ maxHeight: 680, boxShadow: "none" }}>
                            <Table stickyHeader size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={50} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>#</TableCell>
                                        <TableCell width={160} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Bill Info</TableCell>
                                        <TableCell width={180} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Customer</TableCell>
                                        <TableCell width={200} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Staff & Room</TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Services / Item</TableCell>
                                        <TableCell width={140} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Payment</TableCell>
                                        <TableCell width={130} align="right" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Billed Amount</TableCell>
                                        <TableCell width={150} align="right" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Statement Recv.</TableCell>
                                        <TableCell width={120} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Variance</TableCell>
                                        <TableCell width={110} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Status</TableCell>
                                        <TableCell width={70} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                                <Stack spacing={2} alignItems="center" justifyContent="center">
                                                    <CircularProgress size={36} color="primary" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Loading billing reconciliation records...
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ) : list.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                                <Stack spacing={1.5} alignItems="center">
                                                    <Receipt2 size={48} variant="Bulk" style={{ opacity: 0.3 }} />
                                                    <Typography variant="h5" fontWeight={700}>
                                                        No Billing Records Found
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                                                        There are no billing records matching the selected date range and filter criteria. Try expanding your search.
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        list.map((row, idx) => {
                                            const pName = row?.px_payment_type?.name || "Unknown";
                                            const pColor = getPaymentColor(pName);
                                            const isCard = pName.toLowerCase().includes("card") || pName.toLowerCase().includes("pos");
                                            const statementVal = row.statementReceiveAmount !== null && row.statementReceiveAmount !== undefined
                                                ? Number(row.statementReceiveAmount)
                                                : null;
                                            const variance = statementVal !== null ? statementVal - Number(row.grandTotal || 0) : null;
                                            const isMatched = statementVal !== null && variance === 0;

                                            const managers = Array.isArray(row?.managerName)
                                                ? row.managerName.map((i: any) => i.nickName || i.name).filter(Boolean).join(", ")
                                                : (row?.managerName || "N/A");

                                            return (
                                                <TableRow
                                                    key={row.id || idx}
                                                    hover
                                                    sx={{
                                                        bgcolor: row.isVerify
                                                            ? alpha(theme.palette.success.main, 0.02)
                                                            : undefined,
                                                        "&:hover": {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.04) + " !important"
                                                        },
                                                        transition: "background-color 0.2s"
                                                    }}
                                                >
                                                    {/* 1. Index */}
                                                    <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem", fontWeight: 600 }}>
                                                        {(page * rows) + idx + 1}
                                                    </TableCell>

                                                    {/* 2. Bill Info */}
                                                    <TableCell>
                                                        <Stack spacing={0.25}>
                                                            <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                                                {row.billNo || "N/A"}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {moment(row.createdAt).format("DD/MM/YYYY hh:mm A")}
                                                            </Typography>
                                                            {/* {row?.px_user?.branchName && (
                                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                    📍 {row.px_user.branchName}
                                                                </Typography>
                                                            )} */}
                                                        </Stack>
                                                    </TableCell>

                                                    {/* 3. Customer */}
                                                    <TableCell>
                                                        <Stack spacing={0.25}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {row?.px_customer?.name || "Walk-in Customer"}
                                                            </Typography>
                                                            {/* <Typography variant="caption" color="text.secondary">
                                                                📞 {row?.px_customer?.phoneNumber || "N/A"}
                                                            </Typography> */}
                                                            {row?.referenceBy && (
                                                                <Typography variant="caption" color="primary.main" sx={{ fontSize: "0.72rem" }}>
                                                                    Ref: {row.referenceBy}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    </TableCell>

                                                    {/* 4. Manager, Staff & Room */}
                                                    <TableCell>
                                                        <Stack spacing={0.5}>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                <Typography variant="caption" color="text.secondary">Mgr:</Typography>
                                                                <Typography variant="caption" fontWeight={600}>
                                                                    {managers || "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                <Typography variant="caption" color="text.secondary">Staff:</Typography>
                                                                <Typography variant="caption" fontWeight={600}>
                                                                    {row?.px_staff?.nickName || row?.px_staff?.name || "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                <Typography variant="caption" color="text.secondary">Room:</Typography>
                                                                <Chip
                                                                    label={row?.px_room?.roomName || "N/A"}
                                                                    size="small"
                                                                    sx={{ height: 18, fontSize: "0.68rem", fontWeight: 600 }}
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>

                                                    {/* 5. Services / Detail */}
                                                    <TableCell>
                                                        <Stack spacing={0.5}>
                                                            {Array.isArray(row.detail) && row.detail.length > 0 ? (
                                                                row.detail.map((d: any, dIdx: number) => {
                                                                    const serviceTitle = d?.service?.name || d?.membershipPlan?.planName || "Service Item";
                                                                    return (
                                                                        <Box key={dIdx} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                            <Typography variant="caption" fontWeight={500} color="text.primary">
                                                                                {serviceTitle} {d?.quantity > 1 ? `(x${d.quantity})` : ""}
                                                                            </Typography>
                                                                            {/* {d?.rate && (
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    @{formatCurrency(Number(d.rate))}
                                                                                </Typography>
                                                                            )} */}
                                                                        </Box>
                                                                    );
                                                                })
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Standard Service
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    </TableCell>

                                                    {/* 6. Payment Mode */}
                                                    <TableCell>
                                                        <Chip
                                                            label={isCard && row?.cardNo ? `Card (${row.cardNo})` : pName}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: pColor.bg,
                                                                color: pColor.text,
                                                                border: `1px solid ${pColor.border}`,
                                                                fontWeight: 700,
                                                                fontSize: "0.72rem",
                                                                textTransform: "uppercase",
                                                                height: 24
                                                            }}
                                                        />
                                                    </TableCell>

                                                    {/* 7. Billed Amount */}
                                                    <TableCell align="right">
                                                        <Stack spacing={0.25} alignItems="flex-end">
                                                            <Typography variant="subtitle2" fontWeight={700}>
                                                                {formatCurrency(Number(row.grandTotal))}
                                                            </Typography>
                                                            {/* {(Number(row.cgst) > 0 || Number(row.sgst) > 0) && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                                                                    GST: {formatCurrency(Number(row.cgst || 0) + Number(row.sgst || 0))}
                                                                </Typography>
                                                            )} */}
                                                        </Stack>
                                                    </TableCell>

                                                    {/* 8. Statement Received Amount */}
                                                    <TableCell align="right">
                                                        <Typography
                                                            variant="subtitle2"
                                                            fontWeight={700}
                                                            color={statementVal !== null ? "success.main" : "text.secondary"}
                                                        >
                                                            {statementVal !== null ? formatCurrency(statementVal) : "—"}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* 9. Variance */}
                                                    <TableCell align="center">
                                                        {variance === null ? (
                                                            <Typography variant="caption" color="text.secondary">
                                                                —
                                                            </Typography>
                                                        ) : isMatched ? (
                                                            <Chip
                                                                label="Match"
                                                                size="small"
                                                                color="success"
                                                                icon={<TickCircle size={13} />}
                                                                sx={{ fontWeight: 700, height: 22, fontSize: "0.72rem" }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={variance > 0 ? `+₹${variance}` : `-₹${Math.abs(variance)}`}
                                                                size="small"
                                                                color="error"
                                                                icon={<Warning2 size={13} />}
                                                                sx={{ fontWeight: 700, height: 22, fontSize: "0.72rem" }}
                                                            />
                                                        )}
                                                    </TableCell>

                                                    {/* 10. Status */}
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={row.isVerify ? "Verified" : "Pending"}
                                                            size="small"
                                                            color={row.isVerify ? "success" : "warning"}
                                                            variant={row.isVerify ? "filled" : "outlined"}
                                                            sx={{ fontWeight: 700, height: 24, fontSize: "0.75rem" }}
                                                        />
                                                    </TableCell>

                                                    {/* 11. Action (View Detail) */}
                                                    <TableCell align="center">
                                                        <Tooltip title="View Full Bill Details">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleOpenDetailModal(row)}
                                                                sx={{ p: 0.75 }}
                                                            >
                                                                <Eye size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Table Pagination */}
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rows}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRows(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </MainCard>
                </>
            }

            {/* ── Invoice Detail Inspection Dialog Modal ────────────────────────────── */}
            {selectedBillForModal && (
                <Dialog
                    open={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 3, p: 1 }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ p: 1, bgcolor: "primary.lighter", borderRadius: 2, color: "primary.main", display: "flex" }}>
                                    <Receipt2 size={24} variant="Bulk" />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>
                                        Invoice #{selectedBillForModal.billNo}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Created on {moment(selectedBillForModal.createdAt).format("DD MMMM YYYY, hh:mm A")}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                label={selectedBillForModal.isVerify ? "Verified" : "Pending"}
                                color={selectedBillForModal.isVerify ? "success" : "warning"}
                                size="small"
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={3}>
                            {/* Top Info Cards */}
                            <Grid container spacing={2}>
                                {/* Customer Info */}
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <MainCard content={false} sx={{ p: 2, bgcolor: "background.default", height: "100%" }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                                            Customer Information
                                        </Typography>
                                        <Typography variant="body1" fontWeight={700}>
                                            {selectedBillForModal?.px_customer?.name || "Walk-in Customer"}
                                        </Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            Phone: {selectedBillForModal?.px_customer?.phoneNumber || "N/A"}
                                        </Typography> */}
                                        {selectedBillForModal?.referenceBy && (
                                            <Typography variant="caption" color="primary.main">
                                                Reference: {selectedBillForModal.referenceBy}
                                            </Typography>
                                        )}
                                    </MainCard>
                                </Grid>

                                {/* Staff & Room Info */}
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <MainCard content={false} sx={{ p: 2, bgcolor: "background.default", height: "100%" }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                                            Staff & Location
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Therapist:</strong> {selectedBillForModal?.px_staff?.nickName || selectedBillForModal?.px_staff?.name || "N/A"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Room:</strong> {selectedBillForModal?.px_room?.roomName || "N/A"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Branch:</strong> {selectedBillForModal?.px_user?.lastName || "N/A"}
                                        </Typography>
                                    </MainCard>
                                </Grid>

                                {/* Payment Mode Info */}
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <MainCard content={false} sx={{ p: 2, bgcolor: "background.default", height: "100%" }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                                            Payment Details
                                        </Typography>
                                        <Box sx={{ my: 0.5 }}>
                                            <Chip
                                                label={selectedBillForModal?.px_payment_type?.name || "Unknown"}
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </Box>
                                        {selectedBillForModal?.cardNo && (
                                            <Typography variant="body2">
                                                <strong>Card No:</strong> {selectedBillForModal.cardNo}
                                            </Typography>
                                        )}
                                    </MainCard>
                                </Grid>
                            </Grid>

                            {/* Service Items Table */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    Billed Line Items
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: "background.default" }}>
                                                <TableCell sx={{ fontWeight: 700 }}>Service / Plan</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>HSN</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>Rate</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>Discount</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(selectedBillForModal.detail) && selectedBillForModal.detail.length > 0 ? (
                                                selectedBillForModal.detail.map((item: any, iIdx: number) => {
                                                    const name = item?.service?.name || item?.membershipPlan?.planName || "Service Item";
                                                    return (
                                                        <TableRow key={iIdx}>
                                                            <TableCell sx={{ fontWeight: 600 }}>{name}</TableCell>
                                                            <TableCell align="center">{item.hsnCode || "—"}</TableCell>
                                                            <TableCell align="right">{formatCurrency(Number(item.rate || 0))}</TableCell>
                                                            <TableCell align="center">{item.quantity || 1}</TableCell>
                                                            <TableCell align="right">{formatCurrency(Number(item.discount || 0))}</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                                {formatCurrency(Number(item.total || item.rate || 0))}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">No detail items recorded</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Financial Reconciliation Summary Box */}
                            <MainCard content={false} sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Typography variant="caption" color="text.secondary">CGST Amount</Typography>
                                        <Typography variant="h6" fontWeight={700}>{formatCurrency(Number(selectedBillForModal.cgst || 0))}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Typography variant="caption" color="text.secondary">SGST Amount</Typography>
                                        <Typography variant="h6" fontWeight={700}>{formatCurrency(Number(selectedBillForModal.sgst || 0))}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Typography variant="caption" color="text.secondary">Gross Grand Total</Typography>
                                        <Typography variant="h5" fontWeight={700} color="primary.main">
                                            {formatCurrency(Number(selectedBillForModal.grandTotal || 0))}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Typography variant="caption" color="text.secondary">Statement Received</Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            color={selectedBillForModal.statementReceiveAmount !== null ? "success.main" : "text.secondary"}
                                        >
                                            {selectedBillForModal.statementReceiveAmount !== null
                                                ? formatCurrency(Number(selectedBillForModal.statementReceiveAmount))
                                                : "Not Recorded"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 2.5, py: 1.5 }}>
                        <Button variant="outlined" color="secondary" onClick={handleCloseDetailModal}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Stack>
    );
};

export default BillVerifyDetail;