import { Autocomplete, Button, Box, Grid, TextField, Typography, FormControl } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

const SalesReport = () => {
    const {
        attUserList,
        selectedAttUser,
        setSelectedAttUser,
        fetchStaffList,
        attMonth,
        setAttMonth,
        attYear,
        setAttYear,
        selectedStaff,
        setSelectedStaff,
        pdfData,
        staffList,
        year,
        month,
        userList,
        selectedUser,
        setSelectedUser,
        roleId,
        dateRange,
        gstDateRange,
        managerDateRange,
        managerList,
        companyOptions,
        paymentList,
        serviceList,
        // selectedService,
        setYear,
        setMonth,
        fetchUserList,
        fetchReportDate,
        handleDateChange,
        handleBranchChange,
        handlePaymentChange,
        fetchGstReportData,
        handleGstDateChange,
        handleGstPaymentChange,
        fetchManagerReportData,
        handleManagerDateChange,
        handleManagerChange,
        setSelectedService,
        fetchAttendanceReportData,
        fetchStaffAttendanceReportData,
        selectedInsentiveManager,
        setSelectedInsentiveManager,
        insentiveManagerYear,
        setInsentiveManagerYear,
        insentiveManagerMonth,
        setInsentiveManagerMonth,
        fetchInsentiveManagerReportData,
        auditoDateRange,
        auditorSelectedCompany,
        setAuditorSelectedCompany,
        selectedAuditorPayment,
        setSelectedAuditorPayment,
        handleAuditorDateChange,
        fetchAuditorReportData,
    } = useReport();
    return (
        <>
            <Box className="card">
                <Typography variant="h5">Sales Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <DateRangePicker value={dateRange} onChange={handleDateChange} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <>
                                <Autocomplete
                                    freeSolo
                                    size="small"
                                    disablePortal
                                    // multiple
                                    id="Comapny"
                                    options={companyOptions || []}
                                    getOptionLabel={(option) => option.label}
                                    // value={branch}
                                    onChange={(_, newValue) => handleBranchChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company" />
                                    )}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <Autocomplete
                                freeSolo
                                size="small"
                                disablePortal
                                multiple
                                id="paymentID"
                                options={paymentList || []}
                                getOptionLabel={(option) => option.label}
                                // value={value}
                                // onBlur={onBlur}
                                onChange={(event, newValue) => {
                                    handlePaymentChange(newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Payment Type"
                                    />
                                )}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={fetchReportDate}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">GST Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <DateRangePicker value={gstDateRange} onChange={handleGstDateChange} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <Autocomplete
                                freeSolo
                                size="small"
                                disablePortal
                                multiple
                                id="paymentID"
                                options={paymentList || []}
                                getOptionLabel={(option) => option.label}
                                onChange={(event, newValue) => {
                                    handleGstPaymentChange(newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Payment Type"
                                    />
                                )}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={fetchGstReportData}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">Auditor Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <DateRangePicker value={auditoDateRange} onChange={handleAuditorDateChange} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <>
                                <Autocomplete
                                    freeSolo
                                    size="small"
                                    disablePortal
                                    // multiple
                                    id="Comapny"
                                    options={companyOptions || []}
                                    getOptionLabel={(option) => option.label}
                                    // value={branch}
                                    onChange={(_, newValue) => setAuditorSelectedCompany(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company" />
                                    )}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <Autocomplete
                                freeSolo
                                size="small"
                                disablePortal
                                multiple
                                id="paymentID"
                                options={paymentList || []}
                                getOptionLabel={(option) => option.label}
                                // value={value}
                                // onBlur={onBlur}
                                onChange={(event, newValue) => {
                                    setSelectedAuditorPayment(newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Payment Type"
                                    />
                                )}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={fetchAuditorReportData}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default SalesReport;