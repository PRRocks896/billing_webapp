// import { DateRangePicker } from "rsuite";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";


// import 'rsuite/dist/rsuite.min.css';
import BarChart from "../../../components/BarChart";
import useAttendanceListHomepage from "../hook/useAttendanceListHomepage";

const AttendanceList = () => {
    const {
      
    } = useAttendanceListHomepage();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    {/* <DateRangePicker value={dateRange} onChange={handleDateChange} /> */}
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button className="btn btn-tertiary" >Refresh</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                    
                </Grid>
            </Grid>
            
        </>
    );
}

export default AttendanceList;