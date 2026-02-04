import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useLaundryReport from "./hook/useLaundryReport";

const LaundryReport = () => {
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
    } = useLaundryReport();
    return (
        <>
            <Box className="card">
                <Typography variant="h5">Laundry Report</Typography>
                <br />
                <Grid container spacing={2}>
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
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
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
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
                            id="branch"
                            options={userList || []}
                            getOptionLabel={(option) => option?.lastName}
                            value={userList.find((user) => user.id === selectedUser) || null}
                            onChange={(_, newValue) => {
                                setSelectedUser(newValue?.id);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Branch" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            className="btn btn-tertiary"
                            onClick={handleFetchReportLaundryManagement}
                        >
                            Fetch Report
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box className="card">
                <Typography variant="h5">Laundry Receiver Report</Typography>
                <br />
                <Grid container spacing={2}>
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
                            value={monthReceiver}
                            onChange={(_, newValue) => {
                                setMonthReceiver(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Month" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
                            // multiple
                            id="year"
                            options={[...Array(10)].map((_, index) => new Date().getFullYear() - index) || []}
                            getOptionLabel={(option) => option}
                            value={yearReceiver}
                            onChange={(_, newValue) => {
                                setYearReceiver(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Year" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            fullWidth
                            id="branch"
                            options={userList || []}
                            getOptionLabel={(option) => option?.lastName}
                            value={userList.find((user) => user.id === selectedUserReceiver) || null}
                            onChange={(_, newValue) => {
                                setSelectedUserReceiver(newValue?.id);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Branch" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            className="btn btn-tertiary"
                            onClick={handleFetchReportLaundryReceiver}
                        >
                            Fetch Report
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default LaundryReport;
