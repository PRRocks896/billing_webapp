import { DateRangePicker } from "rsuite";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import 'rsuite/dist/rsuite.min.css';
import BarChart from "../../../components/BarChart";
import useSalesExpenseHook from "../hook/useSalesExpense";

const SalesExpense = () => {
    const {
        labels,
        dateRange,
        salesData,
        expenseData,
        handleDateChange,
        fetchSalesExpenseReport
    } = useSalesExpenseHook();
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <DateRangePicker value={dateRange} onChange={handleDateChange} />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button className="btn btn-tertiary" onClick={fetchSalesExpenseReport}>Search</Button>
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
                                },
                                {
                                    label: "Expenses",
                                    data: expenseData,
                                    backgroundColor: "rgba(255, 99, 132, 0.7)",
                                },
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

export default SalesExpense;