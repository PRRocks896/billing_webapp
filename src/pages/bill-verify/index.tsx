import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MainCard from "components/MainCard";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import {
    Receipt2,
    TickCircle,
    Warning2,
    SearchNormal1,
    Refresh2,
    DirectboxReceive,
    Money4,
    WalletMoney,
    Cards,
    ArrowRotateRight,
    DocumentText
} from "iconsax-reactjs";

import UseBillVerify, { StatusFilter } from "./hooks/useBillVerify";

const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
};

const getPaymentColor = (paymentType: string = "") => {
    const p = paymentType.toLowerCase();
    if (p.includes("cash")) return { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" };
    if (p.includes("upi") || p.includes("gpay") || p.includes("paytm")) return { bg: "#EDE7F6", text: "#673AB7", border: "#D1C4E9" };
    if (p.includes("card") || p.includes("pos")) return { bg: "#E3F2FD", text: "#1976D2", border: "#BBDEFB" };
    return { bg: "#FFF3E0", text: "#E65100", border: "#FFE0B2" };
};

const BillVerify = () => {
    const theme = useTheme();

    const {
        // Table & Form
        watchedBills,
        filteredBillsWithIndex,
        isSaving,
        isFetchingBills,
        hasLoaded,

        // Filters
        date,
        selectedCompany,
        companyOptions,
        selectedCity,
        cityOptions,
        selectedBranch,
        branchOptions,
        isAdmin,

        // Search & Filters
        searchText,
        statusFilter,
        paymentFilter,
        availablePaymentTypes,
        stats,

        // Handlers
        setDate,
        setSelectedCompany,
        setSelectedCity,
        setSelectedBranch,
        setSearchText,
        setStatusFilter,
        setPaymentFilter,
        fetchBill,
        onSubmit,
        handleSubmit,
        handleToggleVerify,
        handleStatementAmountChange,
        handleQuickMatch,
        handleVerifyAll,
        handleAutoFillAllStatement
    } = UseBillVerify();

    return (
        <Stack spacing={3}>
            {/* ── Header ───────────────────────────────────────────────────────────── */}
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
                            Bill Verification & Reconciliation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Reconcile daily billing receipts against bank statements and received amounts.
                        </Typography>
                    </Box>
                </Stack>

                {hasLoaded && watchedBills.length > 0 && (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Refresh2 size={18} />}
                            onClick={fetchBill}
                            disabled={isFetchingBills || isSaving}
                            size="medium"
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <TickCircle size={18} />}
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSaving || isFetchingBills || watchedBills.length === 0}
                            size="medium"
                            sx={{
                                px: 3,
                                boxShadow: "0 4px 12px 0 rgba(70, 128, 255, 0.25)"
                            }}
                        >
                            {isSaving ? "Saving..." : "Save Verification"}
                        </Button>
                    </Stack>
                )}
            </Stack>

            {/* ── Selection & Filter Card ─────────────────────────────────────────── */}
            <MainCard
                border={false}
                shadow="0 2px 14px 0 rgb(32 40 45 / 8%)"
                sx={{
                    background: theme.palette.mode === "dark" ? undefined : "#FFFFFF",
                    borderRadius: 3
                }}
            >
                <Grid container spacing={2.5} alignItems="center">
                    {/* Date Picker */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <FormControl fullWidth size="small">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Billing Date"
                                    format="dd/MM/yyyy"
                                    value={date}
                                    onChange={(val: Date | null) => setDate(val)}
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
                    {isAdmin && (
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={companyOptions}
                                getOptionLabel={(option) => option.companyName || ""}
                                value={companyOptions.find((option: any) => option.id === selectedCompany) || null}
                                onChange={(_, newValue) => setSelectedCompany(newValue?.id || null)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company" placeholder="Select Company" />
                                )}
                            />
                        </Grid>
                    )}

                    {/* City (Admin only, when company selected) */}
                    {isAdmin && (
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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
                                    <TextField {...params} label="City" placeholder={selectedCompany ? "Select City" : "Select Company first"} />
                                )}
                            />
                        </Grid>
                    )}

                    {/* Branch */}
                    {isAdmin ? (
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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
                                    <TextField {...params} label="Branch" placeholder={selectedCity ? "Select Branch" : "Select City first"} />
                                )}
                            />
                        </Grid>
                    ) : null}

                    {/* Get Bills Button */}
                    <Grid size={{ xs: 12, sm: 6, md: isAdmin ? 2 : 3.5 }}>
                        <Button
                            fullWidth
                            size="medium"
                            variant="contained"
                            color="primary"
                            onClick={fetchBill}
                            disabled={isFetchingBills || (!selectedBranch && isAdmin)}
                            startIcon={isFetchingBills ? <CircularProgress size={16} color="inherit" /> : <SearchNormal1 size={18} />}
                            sx={{ height: 40 }}
                        >
                            {isFetchingBills ? "Loading..." : "Get Bills"}
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>

            {/* ── Executive KPI Dashboard Cards ───────────────────────────────────── */}
            {hasLoaded && watchedBills.length > 0 && (
                <>
                    <Grid container spacing={2.5}>
                        {/* 1. Total Invoices Card */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <MainCard
                                content={false}
                                sx={{
                                    p: 2.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                    borderRadius: 3
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Total Bills
                                        </Typography>
                                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, color: "primary.main", display: "flex" }}>
                                            <DocumentText size={20} />
                                        </Box>
                                    </Stack>
                                    <Typography variant="h3" fontWeight={700}>
                                        {stats.totalCount}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label={`${stats.verifiedCount} Verified`}
                                            size="small"
                                            color="success"
                                            sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
                                        />
                                        <Chip
                                            label={`${stats.pendingCount} Pending`}
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
                                        />
                                    </Stack>
                                </Stack>
                            </MainCard>
                        </Grid>

                        {/* 2. Total Billed Amount */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <MainCard
                                content={false}
                                sx={{
                                    p: 2.5,
                                    bgcolor: alpha(theme.palette.info.main, 0.04),
                                    borderColor: alpha(theme.palette.info.main, 0.2),
                                    borderRadius: 3
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Total Billed Amount
                                        </Typography>
                                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2, color: "info.main", display: "flex" }}>
                                            <WalletMoney size={20} />
                                        </Box>
                                    </Stack>
                                    <Typography variant="h3" fontWeight={700} color="info.main">
                                        {formatCurrency(stats.totalGrandTotal)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Gross sum of all generated invoices
                                    </Typography>
                                </Stack>
                            </MainCard>
                        </Grid>

                        {/* 3. Statement Received Amount */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <MainCard
                                content={false}
                                sx={{
                                    p: 2.5,
                                    bgcolor: alpha(theme.palette.success.main, 0.04),
                                    borderColor: alpha(theme.palette.success.main, 0.2),
                                    borderRadius: 3
                                }}
                            >
                                <Stack spacing={1.5}>
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
                                    <Stack direction="row" alignItems="center" spacing={1}>
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
                                </Stack>
                            </MainCard>
                        </Grid>

                        {/* 4. Variance / Discrepancy Card */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <MainCard
                                content={false}
                                sx={{
                                    p: 2.5,
                                    bgcolor: stats.totalVariance === 0 ? alpha(theme.palette.success.main, 0.04) : alpha(theme.palette.error.main, 0.04),
                                    borderColor: stats.totalVariance === 0 ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                                    borderRadius: 3
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Reconciliation Variance
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
                                    <Typography variant="caption" color={stats.totalVariance === 0 ? "success.dark" : "error.main"} fontWeight={600}>
                                        {stats.totalVariance === 0
                                            ? "✓ Perfect Match (No Variance)"
                                            : stats.totalVariance > 0
                                                ? `Surplus in received statement`
                                                : `Shortage of ${formatCurrency(Math.abs(stats.totalVariance))}`}
                                    </Typography>
                                </Stack>
                            </MainCard>
                        </Grid>
                    </Grid>

                    {/* Payment Mode Distribution Bar */}
                    {stats.paymentBreakdown.length > 0 && (
                        <MainCard content={false} sx={{ p: 2, borderRadius: 2.5, bgcolor: "background.paper" }}>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Cards size={18} variant="Bulk" />
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        Payment Mode Breakdown:
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

            {/* ── Table & Reconciliation Management ──────────────────────────────── */}
            {hasLoaded && watchedBills.length > 0 && (
                <MainCard
                    content={false}
                    border={false}
                    shadow="0 2px 14px 0 rgb(32 40 45 / 8%)"
                    sx={{ borderRadius: 3, overflow: "hidden" }}
                >
                    {/* Filter & Batch Action Toolbar */}
                    <Box sx={{ p: 2.5, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            {/* Left: Status Filter Tabs & Search */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                                    {/* Tabs */}
                                    <Tabs
                                        value={statusFilter}
                                        onChange={(_, val) => setStatusFilter(val as StatusFilter)}
                                        textColor="primary"
                                        indicatorColor="primary"
                                        sx={{
                                            minHeight: 38,
                                            "& .MuiTab-root": {
                                                minHeight: 38,
                                                py: 0.5,
                                                px: 1.5,
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                textTransform: "none"
                                            }
                                        }}
                                    >
                                        <Tab value="all" label={`All (${stats.totalCount})`} />
                                        <Tab value="verified" label={`Verified (${stats.verifiedCount})`} />
                                        <Tab value="pending" label={`Pending (${stats.pendingCount})`} />
                                        {stats.mismatchCount > 0 && (
                                            <Tab
                                                value="mismatch"
                                                label={
                                                    <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "error.main" }}>
                                                        <Warning2 size={14} /> Mismatch ({stats.mismatchCount})
                                                    </Box>
                                                }
                                            />
                                        )}
                                    </Tabs>

                                    {/* Quick Search */}
                                    <TextField
                                        size="small"
                                        placeholder="Search by Bill #, Customer, Staff..."
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
                                        sx={{ width: { xs: "100%", sm: 260 } }}
                                    />
                                </Stack>
                            </Grid>

                            {/* Right: Quick Batch Actions */}
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap" useFlexGap>
                                    {/* Payment filter dropdown */}
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <Select
                                            value={paymentFilter}
                                            onChange={(e) => setPaymentFilter(e.target.value)}
                                            displayEmpty
                                            sx={{ height: 36, fontSize: "0.85rem" }}
                                        >
                                            <MenuItem value="all">All Payments</MenuItem>
                                            {availablePaymentTypes.map((pt) => (
                                                <MenuItem key={pt} value={pt}>
                                                    {pt}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        onClick={() => handleVerifyAll(true)}
                                        startIcon={<TickCircle size={16} />}
                                    >
                                        Verify All
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAutoFillAllStatement}
                                        startIcon={<ArrowRotateRight size={16} />}
                                    >
                                        Auto-Match All
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleVerifyAll(false)}
                                    >
                                        Unverify All
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Reconciliation Table */}
                    <TableContainer component={Paper} sx={{ maxHeight: 640, boxShadow: "none" }}>
                        <Table stickyHeader size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={50} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>#</TableCell>
                                    <TableCell width={160} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Bill No</TableCell>
                                    <TableCell width={200} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Customer</TableCell>
                                    <TableCell width={180} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Staff & Room</TableCell>
                                    <TableCell sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Services / Item</TableCell>
                                    <TableCell width={130} sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Payment</TableCell>
                                    <TableCell width={130} align="right" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Billed Amount</TableCell>
                                    <TableCell width={200} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Statement Amount</TableCell>
                                    <TableCell width={110} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Variance</TableCell>
                                    <TableCell width={140} align="center" sx={{ fontWeight: 700, bgcolor: "background.paper" }}>Status & Verify</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBillsWithIndex.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                            <Stack spacing={1.5} alignItems="center">
                                                <Receipt2 size={40} variant="Bulk" style={{ opacity: 0.4 }} />
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    No bills match the selected filters.
                                                </Typography>
                                                <Button size="small" variant="text" onClick={() => { setSearchText(""); setStatusFilter("all"); setPaymentFilter("all"); }}>
                                                    Clear Table Filters
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBillsWithIndex.map(({ bill, index }, displayIndex) => {
                                        const pColor = getPaymentColor(bill.paymentType);
                                        const statementVal = bill.statementReceiveAmount !== null && bill.statementReceiveAmount !== undefined
                                            ? Number(bill.statementReceiveAmount)
                                            : null;
                                        const variance = statementVal !== null ? statementVal - bill.grandTotal : null;
                                        const isMatched = statementVal !== null && variance === 0;

                                        return (
                                            <TableRow
                                                key={bill.mappedId || index}
                                                hover
                                                sx={{
                                                    bgcolor: bill.isVerify
                                                        ? alpha(theme.palette.success.main, 0.02)
                                                        : undefined,
                                                    "&:hover": {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.04) + " !important"
                                                    },
                                                    transition: "background-color 0.2s"
                                                }}
                                            >
                                                {/* 1. Index */}
                                                <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                                                    {displayIndex + 1}
                                                </TableCell>

                                                {/* 2. Bill No */}
                                                <TableCell>
                                                    <Chip
                                                        label={bill.billNo || "N/A"}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ fontWeight: 700, fontSize: "0.8rem" }}
                                                    />
                                                </TableCell>

                                                {/* 3. Customer */}
                                                <TableCell>
                                                    <Stack spacing={0.25}>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {bill.customerName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {bill.customerPhone}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                {/* 4. Staff & Room */}
                                                <TableCell>
                                                    <Stack spacing={0.25}>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {bill.staffName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Room: <strong>{bill.roomName}</strong>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                {/* 5. Services / Details */}
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        {Array.isArray(bill.detail) && bill.detail.length > 0 ? (
                                                            bill.detail.map((d: any, idx: number) => {
                                                                const serviceTitle = d?.service?.name || d?.membershipPlan?.planName || "Service";
                                                                return (
                                                                    <Typography key={idx} variant="caption" color="text.primary" sx={{ display: "block" }}>
                                                                        • {serviceTitle} {d?.quantity > 1 ? `(x${d.quantity})` : ""}
                                                                    </Typography>
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
                                                        label={bill.paymentType}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: pColor.bg,
                                                            color: pColor.text,
                                                            border: `1px solid ${pColor.border}`,
                                                            fontWeight: 700,
                                                            fontSize: "0.75rem",
                                                            textTransform: "uppercase"
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* 7. Billed Amount */}
                                                <TableCell align="right">
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {formatCurrency(bill.grandTotal)}
                                                    </Typography>
                                                </TableCell>

                                                {/* 8. Statement Receive Amount */}
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            placeholder="0"
                                                            value={bill.statementReceiveAmount ?? ""}
                                                            onChange={(e) => handleStatementAmountChange(index, e.target.value)}
                                                            slotProps={{
                                                                input: {
                                                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                                                                }
                                                            }}
                                                            sx={{
                                                                width: 130,
                                                                "& .MuiInputBase-input": {
                                                                    py: 0.75,
                                                                    fontWeight: 600,
                                                                    textAlign: "right"
                                                                }
                                                            }}
                                                        />
                                                        <Tooltip title="Match Billed Amount">
                                                            <IconButton
                                                                size="small"
                                                                color={isMatched ? "success" : "primary"}
                                                                onClick={() => handleQuickMatch(index)}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <ArrowRotateRight size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
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
                                                            icon={<TickCircle size={14} />}
                                                            sx={{ fontWeight: 700, height: 24, fontSize: "0.75rem" }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label={variance > 0 ? `+₹${variance}` : `-₹${Math.abs(variance)}`}
                                                            size="small"
                                                            color="error"
                                                            icon={<Warning2 size={14} />}
                                                            sx={{ fontWeight: 700, height: 24, fontSize: "0.75rem" }}
                                                        />
                                                    )}
                                                </TableCell>

                                                {/* 10. Status & Verify Toggle */}
                                                <TableCell align="center">
                                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                        <Switch
                                                            checked={Boolean(bill.isVerify)}
                                                            onChange={(e) => handleToggleVerify(index, e.target.checked)}
                                                            color="success"
                                                            size="small"
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            fontWeight={700}
                                                            color={bill.isVerify ? "success.main" : "text.secondary"}
                                                        >
                                                            {bill.isVerify ? "Verified" : "Pending"}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Bottom Action Footer Bar */}
                    <Box
                        sx={{
                            p: 2.5,
                            borderTop: 1,
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                Showing <strong>{filteredBillsWithIndex.length}</strong> of <strong>{stats.totalCount}</strong> invoices
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Verified: <strong style={{ color: theme.palette.success.main }}>{formatCurrency(stats.totalStatementAmount)}</strong>
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <TickCircle size={20} />}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSaving || isFetchingBills || watchedBills.length === 0}
                                sx={{
                                    px: 4,
                                    py: 1,
                                    fontWeight: 700,
                                    boxShadow: "0 6px 16px 0 rgba(70, 128, 255, 0.3)"
                                }}
                            >
                                {isSaving ? "Saving Verifications..." : "Save Verifications"}
                            </Button>
                        </Stack>
                    </Box>
                </MainCard>
            )}

            {/* ── Empty State / Initial Prompt ────────────────────────────────────── */}
            {hasLoaded && watchedBills.length === 0 && (
                <MainCard border={false} shadow="0 2px 14px 0 rgb(32 40 45 / 8%)" sx={{ py: 8, textAlign: "center", borderRadius: 3 }}>
                    <Stack spacing={2} alignItems="center" justifyContent="center">
                        <Box sx={{ p: 2, bgcolor: "primary.lighter", borderRadius: "50%", color: "primary.main", display: "flex" }}>
                            <Receipt2 size={48} variant="Bulk" />
                        </Box>
                        <Typography variant="h4" fontWeight={700}>
                            No Invoices Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                            There are no billing records recorded for the selected date and branch. Try choosing a different date or branch.
                        </Typography>
                    </Stack>
                </MainCard>
            )}

            {!hasLoaded && (
                <MainCard border={false} shadow="0 2px 14px 0 rgb(32 40 45 / 8%)" sx={{ py: 8, textAlign: "center", borderRadius: 3 }}>
                    <Stack spacing={2} alignItems="center" justifyContent="center">
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: "50%", color: "primary.main", display: "flex" }}>
                            <DirectboxReceive size={48} variant="Bulk" />
                        </Box>
                        <Typography variant="h4" fontWeight={700}>
                            Ready to Reconcile Bills
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                            Select the date and branch above, then click <strong>&quot;Get Bills&quot;</strong> to start verifying receipts against statement amounts.
                        </Typography>
                    </Stack>
                </MainCard>
            )}
        </Stack>
    );
};

export default BillVerify;