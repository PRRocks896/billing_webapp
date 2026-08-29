import React from "react";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MainCard from "components/MainCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useExportSection from "../hooks/useExportSection";

interface ExportSectionProps {
    onExport?: (params: any) => void;
}

const ExportSection: React.FC<ExportSectionProps> = ({ onExport }) => {
    const theme = useTheme();

    const {
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        selectedPayment,
        setSelectedPayment,
        paymentOptions,
        selectedCompany,
        setSelectedCompany,
        companyOptions,
        selectedBranch,
        setSelectedBranch,
        branchOptions,
        selectedStatus,
        setSelectedStatus,
        statusOptions,
        isLoading,
        exportSectionRights,
        isAdmin,
        handleExport
    } = useExportSection();

    // If no view right for export_section, do not render
    if (!exportSectionRights?.view) {
        return null;
    }

    const onExportClick = () => {
        if (onExport) {
            onExport({
                fromDate,
                toDate,
                selectedCompany,
                selectedBranch,
                selectedStatus
            });
        } else {
            handleExport();
        }
    };

    return (
        <MainCard
            border={false}
            shadow="0 2px 14px 0 rgb(32 40 45 / 8%)"
            sx={{
                background: theme.palette.mode === "dark" ? undefined : "#FFFFFF",
                borderRadius: 3,
                p: { xs: 1.5, sm: 2 }
            }}
        >
            <Stack spacing={2.5}>
                {/* 5 Input Fields in a Single Line */}
                <Grid container spacing={2} alignItems="center">
                    {/* 1. From Date */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
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

                    {/* 2. To Date */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
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

                    {/* 3. Company */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={companyOptions}
                            getOptionLabel={(option: any) => option.companyName || ""}
                            value={companyOptions.find((option: any) => option.id === selectedCompany) || null}
                            onChange={(_, newValue) => setSelectedCompany(newValue?.id || null)}
                            renderInput={(params) => (
                                <TextField {...params} label="Company" placeholder="All Companies" />
                            )}
                        />
                    </Grid>

                    {/* 4. Branch */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            multiple
                            options={branchOptions}
                            getOptionLabel={(option: any) => option?.lastName || option?.branchName || option?.firstName || ""}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value?.id || option.id === value}
                            value={branchOptions.filter((option: any) => selectedBranch.includes(option.id)) || null}
                            onChange={(_, newValue) => setSelectedBranch(newValue?.map((option: any) => option.id) || [])}
                            renderInput={(params) => (
                                <TextField {...params} label="Branch" placeholder="All Branches" />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            multiple
                            options={paymentOptions}
                            getOptionLabel={(option: any) => option?.name || ""}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value?.id || option.id === value}
                            value={paymentOptions.filter((option: any) => selectedPayment.includes(option.id)) || null}
                            onChange={(_, newValue) => setSelectedPayment(newValue?.map((option: any) => option.id) || [])}
                            renderInput={(params) => (
                                <TextField {...params} label="Payment Type" placeholder="All Payment Types" />
                            )}
                        />
                    </Grid>

                    {/* 5. Verification Status */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={statusOptions}
                            getOptionLabel={(option: any) => option?.label || ""}
                            value={statusOptions.find((option: any) => option.value === selectedStatus) || statusOptions[0]}
                            onChange={(_, newValue) => setSelectedStatus(newValue?.value ?? null)}
                            renderInput={(params) => (
                                <TextField {...params} label="Verification Status" />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Left Aligned Green Export Button */}
                <Stack direction="row" justifyContent="flex-start">
                    <Button
                        variant="contained"
                        onClick={onExportClick}
                        disabled={isLoading || !exportSectionRights?.download}
                        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
                        sx={{
                            bgcolor: "#00875A",
                            "&:hover": { bgcolor: "#007048" },
                            "&.Mui-disabled": {
                                bgcolor: "#E0E0E0",
                                color: "#9E9E9E"
                            },
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            px: 5,
                            py: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            boxShadow: "none"
                        }}
                    >
                        {isLoading ? "Exporting..." : "Export"}
                    </Button>
                </Stack>
            </Stack>
        </MainCard>
    );
};

export default ExportSection;
