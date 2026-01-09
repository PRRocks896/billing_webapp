import { DateRangePicker } from "rsuite";
import moment from 'moment';
import 'rsuite/dist/rsuite.min.css';

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import BarChart from "../../../components/BarChart";
import UseMonthWiseSale from "../hook/useMonthWiseSale";
import { capitalizeFirstLetter } from "../../../utils/helper";

const MonthWiseSale = () => {
    const {
        labels,
        dateRange,
        salesData,
        branchOptions,
        fetchMonthSale,
        handleDateChange,
        setSelectedBranch
    } = UseMonthWiseSale();

    const months = [...Array(12)].map((_, i) => ({value: i + 1, label: moment().month(i).format('MMMM')}))
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <Autocomplete
                        freeSolo
                        size="small"
                        disablePortal
                        id="Branch"
                        options={branchOptions || []}
                        getOptionLabel={(option) => option.label}
                        // value={branch}
                        onChange={(event, newValue) => setSelectedBranch(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Branch" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <DateRangePicker value={dateRange} onChange={handleDateChange} />
                </Grid>
                <Grid item xs={12} sm={3}>
                    
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button className="btn btn-tertiary" onClick={() => fetchMonthSale()}>Search</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                    <BarChart
                        chartData={{
                            labels: labels,
                            datasets: [
                                {
                                    label: salesData.length > 0 ? capitalizeFirstLetter(salesData[0]?.label || '') : '',
                                    data: salesData[0]?.data,
                                    backgroundColor: "#364865",
                                },
                                {
                                    label: salesData.length > 0 ? capitalizeFirstLetter(salesData[1]?.label || '') : '',
                                    data: salesData[1]?.data,
                                    backgroundColor: "#ff6385ff",
                                },
                                {
                                    label: salesData.length > 0 ? capitalizeFirstLetter(salesData[2]?.label || '') : '',
                                    data: salesData[2]?.data,
                                    backgroundColor: "#63ffa9ff",
                                },
                                {
                                    label: salesData.length > 0 ? capitalizeFirstLetter(salesData[3]?.label || '') : '',
                                    data: salesData[3]?.data,
                                    backgroundColor: "#63ffffff",
                                }
                            ],
                        }}
                        title=''
                        responsive={true}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default MonthWiseSale;