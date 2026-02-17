import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import UseCompanyStaffPayment from "./hook/useCompanyStaffPayment";

const CompanyStaffPaymentReport = () => {
    const {
        year,
        month,
        userList,
        companyList,
        paymentBankList,
        setYear,
        setMonth,
        getReport,
        fetchUserList,
        setSelectedUser,
        setSelectedCompany,
        setSelectedPaymentBank
    } = UseCompanyStaffPayment();
    return (
        <>
            <Box className="card">
                <Typography variant="h5">Salary Payment Sheet</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={1}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="month">Select Month</InputLabel>
                            <Select
                                size="small"
                                label="Select Month"
                                labelId="month"
                                value={month || ''}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <MenuItem value={1}>Jan</MenuItem>
                                <MenuItem value={2}>Feb</MenuItem>
                                <MenuItem value={3}>March</MenuItem>
                                <MenuItem value={4}>Apr</MenuItem>
                                <MenuItem value={5}>May</MenuItem>
                                <MenuItem value={6}>June</MenuItem>
                                <MenuItem value={7}>July</MenuItem>
                                <MenuItem value={8}>Aug</MenuItem>
                                <MenuItem value={9}>Sept</MenuItem>
                                <MenuItem value={10}>Oct</MenuItem>
                                <MenuItem value={11}>Nov</MenuItem>
                                <MenuItem value={12}>Dec</MenuItem>
                            </Select>
                        </FormControl>
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
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            id="company"
                            options={companyList || []}
                            getOptionLabel={(option) => option.companyName || ''}
                            onChange={(_, newValue) => {
                                setSelectedCompany(newValue?.id);
                                fetchUserList(newValue?.id)
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.companyName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Company" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            freeSolo
                            size="small"
                            disablePortal
                            multiple
                            id="userID"
                            options={userList || []}
                            getOptionLabel={(option) => option.label}
                            onChange={(_, newValue) => {
                                setSelectedUser(newValue || []);
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
                            id="paymentID"
                            options={paymentBankList || []}
                            getOptionLabel={(option) => option.bankName || ''}
                            onChange={(_, newValue) => {
                                setSelectedPaymentBank(newValue?.id)
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.bankName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Payment Bank" />
                            )}
                        />
                    </Grid>
                </Grid>
                <br />
                <Button className="btn btn-tertiary" style={{ width: '100%' }} onClick={getReport}>Get Salary Payment Report</Button>
            </Box>
        </>
    )
}

export default CompanyStaffPaymentReport;