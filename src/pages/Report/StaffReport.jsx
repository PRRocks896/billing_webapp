import { Autocomplete, Button, Box, Grid, TextField, Typography, FormControl } from "@mui/material";
import React from "react";
import { useReport } from "./hook/useReport";
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

const StaffReport = () => {
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
        weekDays,
        weekDaysPercentage,
        weekEnd,
        weekEndPercentage,
        setWeekDays,
        setWeekDaysPercentage,
        setweekEnd,
        setWeekEndPercentage
    } = useReport();
    return (
        <>
            <Box className="card">
                <Typography variant="h5">Attendance Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        {roleId === 1 && (
                            <Autocomplete
                                freeSolo
                                size="small"
                                disablePortal
                                // multiple
                                id="Comapny"
                                options={companyOptions || []}
                                getOptionLabel={(option) => option.label}
                                // value={branch}
                                onChange={(_, newValue) => {
                                    handleBranchChange(newValue)
                                    fetchUserList(newValue?.value);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company" />
                                )}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="userID"
                            options={userList || []}
                            getOptionLabel={(option) => option.label}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.value) {
                                    setSelectedUser(selected?.value);
                                } else {
                                    setSelectedUser(null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="User" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="year"
                            options={[...Array(10)].map((_, index) => new Date().getFullYear() - index) || []}
                            getOptionLabel={(option) => option}
                            value={year}
                            onChange={(_, newValue) => {
                                setYear(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Year" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="month"
                            options={[...Array(12)].map((_, index) => (new Date(`01-01-${new Date().getFullYear()}`).getMonth() + 1) + index) || []}
                            getOptionLabel={(option) => option}
                            value={month}
                            onChange={(_, newValue) => {
                                setMonth(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Month" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={() => fetchAttendanceReportData()}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">Manager Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <DateRangePicker value={managerDateRange} onChange={handleManagerDateChange} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="service"
                            options={serviceList || []}
                            getOptionLabel={(option) => option.label}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.value) {
                                    setSelectedService(selected?.value);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Service" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="manager"
                            options={managerList || []}
                            getOptionLabel={(option) => `${option?.nickName} (${option?.name})`}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.id) {
                                    handleManagerChange(selected?.id);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Manager" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button className="btn btn-tertiary" onClick={fetchManagerReportData}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">Manager Incentive Report</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            disablePortal
                            // multiple
                            id="manager"
                            options={managerList || []}
                            getOptionLabel={(option) => `${option?.nickName} (${option?.name})`}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.id) {
                                    setSelectedInsentiveManager(selected?.id);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Manager" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
                            // multiple
                            id="year"
                            options={[...Array(10)].map((_, index) => new Date().getFullYear() - index) || []}
                            getOptionLabel={(option) => option}
                            value={insentiveManagerYear}
                            onChange={(_, newValue) => {
                                setInsentiveManagerYear(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Year" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
                            // multiple
                            id="month"
                            options={[...Array(12)].map((_, index) => (new Date(`01-01-${new Date().getFullYear()}`).getMonth() + 1) + index) || []}
                            getOptionLabel={(option) => option}
                            value={insentiveManagerMonth}
                            onChange={(_, newValue) => {
                                setInsentiveManagerMonth(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Month" />
                            )}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="Mon to Fri (₹)"
                            size="small"
                            name="name"
                            value={weekDays || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty for typing
                                if (val === "") {
                                    setWeekDays("");
                                    return;
                                }
                                if (!/^\d{0,10}$/.test(val)) return;
                                setWeekDays(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="Mon to Fri (%)"
                            size="small"
                            name="name"
                            value={weekDaysPercentage || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty for typing
                                if (val === "") {
                                    setWeekDaysPercentage("");
                                    return;
                                }

                                // Allow only digits
                                if (!/^\d{0,3}$/.test(val)) return;

                                // Convert to number
                                const num = Number(val);

                                // Block if > 100
                                if (num > 100) return;

                                setWeekDaysPercentage(val);
                                // if (/^\d{0,3}$/.test(value)) {
                                //     setWeekDaysPercentage(value);
                                // }
                                // if (value === "" || /^\d+(\.\d{1,2})?$/.test(value) || /^(100|[0-9]{1,2})$/.test(value)) {
                                //     setWeekDaysPercentage(value);
                                // }
                            }}
                            
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}></Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="Sat Sun (₹)"
                            size="small"
                            name="name"
                            value={weekEnd}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty for typing
                                if (val === "") {
                                    setweekEnd("");
                                    return;
                                }
                                if (!/^\d{0,10}$/.test(val)) return;
                                setweekEnd(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="Sat Sun (%)"
                            size="small"
                            name="name"
                            value={weekEndPercentage || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty for typing
                                if (val === "") {
                                    setWeekEndPercentage("");
                                return;
                                }

                                // Allow only digits
                                if (!/^\d{0,3}$/.test(val)) return;

                                // Convert to number
                                const num = Number(val);

                                // Block if > 100
                                if (num > 100) return;

                                setWeekEndPercentage(val);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button className="btn btn-tertiary" onClick={() => fetchInsentiveManagerReportData()}>Export</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">Attendance Detail Staff Wise</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="userID"
                            options={attUserList || []}
                            getOptionLabel={(option) => option.label}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.value) {
                                    setSelectedAttUser(selected?.value);
                                    fetchStaffList(selected?.value);
                                } else {
                                    setSelectedAttUser(null);
                                    setSelectedStaff(null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="User" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="staffID"
                            options={staffList || []}
                            getOptionLabel={(option) => `${option?.nickName} (${option?.label})`}
                            // getOptionLabel={(option) => option.label}
                            // value={branch}
                            onChange={(_, newValue) => {
                                const selected = JSON.parse(JSON.stringify(newValue));
                                if (selected && selected?.value) {
                                    setSelectedStaff(selected?.value);
                                } else {
                                    setSelectedStaff(null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Staff" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="year"
                            options={[...Array(10)].map((_, index) => new Date().getFullYear() - index) || []}
                            getOptionLabel={(option) => option}
                            value={attYear}
                            onChange={(_, newValue) => {
                                setAttYear(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Year" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            // multiple
                            id="month"
                            options={[...Array(12)].map((_, index) => (new Date(`01-01-${new Date().getFullYear()}`).getMonth() + 1) + index) || []}
                            getOptionLabel={(option) => option}
                            value={attMonth}
                            onChange={(_, newValue) => {
                                setAttMonth(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Month" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button className="btn btn-tertiary" onClick={() => fetchStaffAttendanceReportData()}>Search</Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {pdfData && (
                            <iframe
                                title="PDF Viewer"
                                src={pdfData}
                                width="100%"
                                style={{ height: "calc(100vh - 100px)" }}
                            />
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default StaffReport;