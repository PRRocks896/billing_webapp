import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import UseCompanyStaffSalary from "./hook/useCompanyStaffSalary";

const CompanyStaffSalaryReport = () => {
    const {
        year,
        month,
        companyList,
        setYear,
        setMonth,
        getReport,
        setSelectedCompany
    } = UseCompanyStaffSalary();
    return (
        <>
            <Box className="card">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
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
                        <FormControl size="small" fullWidth>
                            <TextField
                                variant="outlined"
                                label="Year"
                                size="small"
                                name="year"
                                value={year}
                                onChange={(e) => {
                                    if (e.target.value.length < 5) {
                                        setYear(e.target.value);
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            id="companyID"
                            disablePortal
                            // multiple
                            // isOptionEqualToValue={(option, value) => option?.id === value}
                            getOptionLabel={(option) => option.companyName ? option.companyName : ''}
                            options={companyList || []}
                            // value={branchList?.find((option) => option.id === selectedBranch) ?? ''}
                            onChange={(_event, value) => {
                                if (value && typeof value === 'object') {
                                    setSelectedCompany(value.id);
                                    // fetchBranch();
                                } else {
                                    setSelectedCompany(null);
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.companyName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Company"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <br />
                <Button className="btn btn-tertiary" style={{ width: '100%' }} onClick={getReport}>Get Salary Report</Button>
            </Box>
        </>
    )
}

export default CompanyStaffSalaryReport;