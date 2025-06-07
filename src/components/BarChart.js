import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const BarChart = ({ chartData, title = '', responsive = false }) => {
    const data = chartData;
    // {
    //     labels,
    //     datasets: [
    //         {
    //             label: "Sales",
    //             data: salesData,
    //             backgroundColor: "rgba(54, 162, 235, 0.7)",
    //         },
    //         {
    //             label: "Expenses",
    //             data: expenseData,
    //             backgroundColor: "rgba(255, 99, 132, 0.7)",
    //         },
    //     ],
    // }
    const options = {
        responsive: responsive,
        maintainAspectRatio: responsive,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: title.length > 0,
                text: title || "Bar Chart",
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                // color: '#000',
                font: {
                    weight: 'bold',
                },
                formatter: (value) => `${value}/-`
            },
        },
        scales: {
            x: {
                barPercentage: 0.1, 
            }
        },
        elements: {
            bar: {
                barThickness: 10, // Adjust the thickness of the bars
            }
        }
    };
    return <Bar data={data} options={options}/>
}

export default BarChart;