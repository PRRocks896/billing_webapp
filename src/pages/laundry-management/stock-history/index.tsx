import React, { useMemo, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import MainCard from "components/MainCard";
import UseLaundryStockHistory from "./useStockHistory";
import moment from "moment";
import {
    AddCircle,
    ArrowDown2,
    ArrowUp2,
    Box1,
    Clock,
    Filter,
    InfoCircle,
    Minus,
    Refresh,
    SearchNormal1,
    Shop,
} from "iconsax-reactjs";

const LaundryStockHistory = () => {
    const theme = useTheme();
    const {
        laundryItemList,
        branchList,
        selectedBranch,
        selectedItem,
        laundryStockHistoryList,
        setSelectedBranch,
        setSelectedItem,
        fetchLaundryStockHistory,
        setLaundryStockHistoryList,
    } = UseLaundryStockHistory();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    // Calculate metrics dynamically
    const metrics = useMemo(() => {
        let totalIn = 0;
        let totalOut = 0;

        laundryStockHistoryList.forEach((item: any) => {
            const qty = Number(item.qty) || 0;
            if (item.transit === "IN") {
                totalIn += qty;
            } else if (item.transit === "OUT") {
                totalOut += qty;
            }
        });

        return {
            totalEntries: laundryStockHistoryList.length,
            totalIn,
            totalOut,
            netMovement: totalIn - totalOut,
        };
    }, [laundryStockHistoryList]);

    // Client-side instant quick search
    const filteredHistory = useMemo(() => {
        if (!searchTerm.trim()) return laundryStockHistoryList;

        const term = searchTerm.toLowerCase();
        return laundryStockHistoryList.filter((item: any) => {
            const dateStr = moment(item.createdAt).format("YYYY-MM-DD hh:mm A").toLowerCase();
            const qtyStr = String(item.qty);
            const transitStr = item.transit ? item.transit.toLowerCase() : "";
            const itemName = item.px_laundry_stock?.px_laundry_item?.itemName
                ? item.px_laundry_stock.px_laundry_item.itemName.toLowerCase()
                : "";
            const userName = item.px_user?.lastName ? item.px_user.lastName.toLowerCase() : "";

            return (
                dateStr.includes(term) ||
                qtyStr.includes(term) ||
                transitStr.includes(term) ||
                itemName.includes(term) ||
                userName.includes(term)
            );
        });
    }, [laundryStockHistoryList, searchTerm]);

    const handleClear = () => {
        setSelectedBranch(null);
        setSelectedItem(null);
        setLaundryStockHistoryList([]);
        setSearchTerm("");
        setPage(0);
    };

    return (
        <Stack spacing={3}>
            {/* ── Main Filter Container ────────────────────────────────────────── */}
            <MainCard content={false} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {/* ── Hero Header ────────────────────────────────────────────── */}
                <Box
                    sx={{
                        px: { xs: 2.5, md: 4 },
                        py: { xs: 3, md: 3.5 },
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
                            theme.palette.secondary.main,
                            0.04
                        )} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2.5,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "16px",
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                flexShrink: 0,
                            }}
                        >
                            <Clock size={30} color="#fff" variant="Bold" />
                        </Box>
                        <Box>
                            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
                                Laundry Stock History
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Audit and track every stock addition (IN) and removal (OUT) per branch & item.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* ── Filter Form ────────────────────────────────────────────── */}
                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        {/* Branch Selection */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: "text.primary" }}>
                                Select Branch <Typography component="span" color="error.main">*</Typography>
                            </Typography>
                            <Autocomplete
                                options={branchList}
                                getOptionLabel={(option) => option?.lastName || ""}
                                value={selectedBranch}
                                onChange={(_event: any, newValue: any) => {
                                    setSelectedBranch(newValue);
                                    setSelectedItem(null);
                                }}
                                noOptionsText="No Branches Found"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose a branch"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Shop size={20} color={theme.palette.primary.main} />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: "12px" },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Laundry Item Selection */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: "text.primary" }}>
                                Select Laundry Item <Typography component="span" color="error.main">*</Typography>
                            </Typography>
                            <Autocomplete
                                options={laundryItemList}
                                getOptionLabel={(option) => option?.label || ""}
                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                value={selectedItem}
                                onChange={(_event: any, newValue: any) => {
                                    setSelectedItem(newValue);
                                }}
                                noOptionsText="No Items Found"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose an item"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Box1 size={20} color={theme.palette.primary.main} />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: "12px" },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Action Buttons */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => fetchLaundryStockHistory()}
                                    startIcon={<Filter size={18} />}
                                    sx={{
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1.2,
                                        fontWeight: 700,
                                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                                    }}
                                >
                                    Apply Filter
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClear}
                                    startIcon={<Refresh size={18} />}
                                    sx={{
                                        borderRadius: "12px",
                                        px: 2.5,
                                        py: 1.2,
                                        fontWeight: 600,
                                    }}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>

            {/* ── KPI Summary Cards ────────────────────────────────────────── */}
            {laundryStockHistoryList.length > 0 && (
                <Grid container spacing={2.5}>
                    {/* Total Entries */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, boxShadow: "none" }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                            Total Log Entries
                                        </Typography>
                                        <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5 }}>
                                            {metrics.totalEntries}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1.5, bgcolor: "primary.lighter", color: "primary.main", borderRadius: 2 }}>
                                        <Clock size={26} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Stock Added (+ IN) */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, boxShadow: "none" }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                            Total Added (+ IN)
                                        </Typography>
                                        <Typography variant="h3" fontWeight={800} color="success.main" sx={{ mt: 0.5 }}>
                                            +{metrics.totalIn}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1.5, bgcolor: "success.lighter", color: "success.main", borderRadius: 2 }}>
                                        <AddCircle size={26} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Stock Removed (- OUT) */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, boxShadow: "none" }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                            Total Removed (- OUT)
                                        </Typography>
                                        <Typography variant="h3" fontWeight={800} color="error.main" sx={{ mt: 0.5 }}>
                                            -{metrics.totalOut}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1.5, bgcolor: "error.lighter", color: "error.main", borderRadius: 2 }}>
                                        <Minus size={26} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Net Stock Movement */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, boxShadow: "none" }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                            Net Movement
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            fontWeight={800}
                                            color={metrics.netMovement >= 0 ? "success.main" : "error.main"}
                                            sx={{ mt: 0.5 }}
                                        >
                                            {metrics.netMovement >= 0 ? `+${metrics.netMovement}` : metrics.netMovement}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            bgcolor: metrics.netMovement >= 0 ? "success.lighter" : "error.lighter",
                                            color: metrics.netMovement >= 0 ? "success.main" : "error.main",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box1 size={26} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── Table & Search Content Section ───────────────────────────── */}
            <MainCard content={false} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                {laundryStockHistoryList.length > 0 ? (
                    <>
                        {/* Table Quick Search Bar */}
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2}>
                                <TextField
                                    placeholder="Search by date, item, movement, quantity..."
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ minWidth: { xs: "100%", sm: 360 } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchNormal1 size={18} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: "10px" },
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    Showing {filteredHistory.length} of {laundryStockHistoryList.length} history records
                                </Typography>
                            </Stack>
                        </Box>

                        {/* History Records Table */}
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, py: 1.8 }}>Date & Time</TableCell>
                                        {/* <TableCell sx={{ fontWeight: 700, py: 1.8 }}>Laundry Item</TableCell> */}
                                        <TableCell sx={{ fontWeight: 700, py: 1.8 }}>Movement (Transit)</TableCell>
                                        <TableCell sx={{ fontWeight: 700, py: 1.8 }} align="right">
                                            Quantity Changed
                                        </TableCell>
                                        {/* <TableCell sx={{ fontWeight: 700, py: 1.8 }}>Branch / Managed By</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredHistory
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row: any, idx: number) => {
                                            const isAdd = row.transit === "IN";
                                            const itemName =
                                                row.px_laundry_stock?.px_laundry_item?.itemName || selectedItem?.label || "-";
                                            const userName = row.px_user?.lastName || selectedBranch?.lastName || "-";

                                            return (
                                                <TableRow key={row.id || idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                    {/* Date & Time */}
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                                            <Box
                                                                sx={{
                                                                    width: 36,
                                                                    height: 36,
                                                                    borderRadius: "10px",
                                                                    bgcolor: "action.hover",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "text.secondary",
                                                                }}
                                                            >
                                                                <Clock size={18} />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="subtitle2" fontWeight={700}>
                                                                    {moment(row.createdAt).format("DD MMM YYYY")}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {moment(row.createdAt).format("hh:mm A")} ({moment(row.createdAt).fromNow()})
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>

                                                    {/* Item Name */}
                                                    {/* <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                                            <Box
                                                                sx={{
                                                                    p: 0.8,
                                                                    bgcolor: "primary.lighter",
                                                                    color: "primary.main",
                                                                    borderRadius: "8px",
                                                                    display: "flex",
                                                                }}
                                                            >
                                                                <Box1 size={18} />
                                                            </Box>
                                                            <Typography variant="subtitle2" fontWeight={600}>
                                                                {itemName}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell> */}

                                                    {/* Transit Status Badge */}
                                                    <TableCell>
                                                        <Chip
                                                            icon={isAdd ? <ArrowDown2 size={14} /> : <ArrowUp2 size={14} />}
                                                            label={isAdd ? "Stock Added (IN)" : "Stock Removed (OUT)"}
                                                            color={isAdd ? "success" : "error"}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: "0.75rem",
                                                                borderRadius: "8px",
                                                                px: 0.5,
                                                            }}
                                                        />
                                                    </TableCell>

                                                    {/* Quantity */}
                                                    <TableCell align="right">
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight={800}
                                                            color={isAdd ? "success.main" : "error.main"}
                                                        >
                                                            {isAdd ? `+${row.qty}` : `-${row.qty}`}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Branch / User */}
                                                    {/* <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Shop size={16} color={theme.palette.text.secondary} />
                                                            <Typography variant="body2" color="text.primary" fontWeight={500}>
                                                                {userName}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredHistory.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </>
                ) : (
                    /* ── Non-Technical Friendly Empty State ─────────────────────── */
                    <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                color: "primary.main",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                            }}
                        >
                            <InfoCircle size={36} variant="Bulk" />
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                            {!selectedBranch || !selectedItem
                                ? "Select Branch & Laundry Item"
                                : "No Stock History Found"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
                            {!selectedBranch || !selectedItem
                                ? "Please select a Branch and Laundry Item from the filters above, then click 'Apply Filter' to view transaction movement history."
                                : "No stock addition or removal records match your current filter criteria."}
                        </Typography>
                    </Box>
                )}
            </MainCard>
        </Stack>
    );
};

export default LaundryStockHistory;