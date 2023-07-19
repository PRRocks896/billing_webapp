import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Title, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Title, Legend);

const DonutChart = ({ chartData }) => {
  chartData = chartData || {};
  const { customerCount, staffCount, serviceCount, userCount } = chartData;

  const data = {
    labels: ["Customer", "Staff", "Service", "User"],
    datasets: [
      {
        label: "Customer",
        data: [customerCount, staffCount, serviceCount, userCount],
        backgroundColor: ["#364865", "#21ab58", "#364865", "#777777"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Green Day Spa",
      },
    },
    // tooltips: {
    //   enabled: true,
    //   callbacks: {
    //     label: function (tooltipItem, data) {
    //       // Display the value and label of the hovered data point
    //       const dataset = data.datasets[tooltipItem.datasetIndex];
    //       const label = data.labels[tooltipItem.index];
    //       const value = dataset.data[tooltipItem.index];
    //       return `${label}: ${value}`;
    //     },
    //   },
    // },
  };

  const plugins = [
    {
      afterDraw(chart) {
        const { ctx } = chart;
        const { width } = chart;
        const { height } = chart;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "22px orkney";

        if (chart?.data?.datasets[0].data.length < 1) {
          ctx.fillText("No data to display", width / 2, height / 2);
          ctx.restore();
        } else {
          const count = chart.data.datasets[0].data.reduce((a, b) => a + b);
          ctx.font = "22px orkney";
          ctx.fontWeight = "700";
          ctx.color = "#777";
          ctx.fillText(count, width / 2, height / 1.7);
          ctx.save();
        }
      },
    },
  ];

  return (
    <Doughnut
      data={data}
      height="343px"
      width="300px"
      options={options}
      plugins={plugins}
    />
  );
};

export default DonutChart;
