// import { DateRangePicker } from "rsuite";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// import 'rsuite/dist/rsuite.min.css';
import BarChart from "../../../components/BarChart";
import useLowSalesHook from "../hook/useLowSale";

const LowSale = () => {
    const {
        labels,
        date,
        salesData,
        handleDateChange,
        fetchLowSalesReport
    } = useLowSalesHook();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    {/* <DateRangePicker value={dateRange} onChange={handleDateChange} /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date"
                            value={date}
                            onChange={(newValue) => {
                                handleDateChange(newValue)
                            }}
                            renderInput={(params) => <TextField size="small" {...params} />}
                            format="DD-MM-YYYY"
                            
                        />
                        </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button className="btn btn-tertiary" onClick={fetchLowSalesReport}>Search</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                    <BarChart
                        chartData={{
                            labels: labels,
                            datasets: [
                                {
                                    label: "Sales",
                                    data: salesData,
                                    backgroundColor: "#364865",
                                }
                            ],
                        }}
                        title=''
                        responsive={true}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default LowSale;