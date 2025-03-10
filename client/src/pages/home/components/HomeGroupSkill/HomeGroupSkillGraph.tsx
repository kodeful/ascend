import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface HomeGroupSkillGraphProps {
  height: number;
}

const HomeGroupSkillGraph: FC<HomeGroupSkillGraphProps> = ({ height }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "bar",
      height: height,
      marginLeft: 0,
      spacingLeft: 0,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      lineWidth: 0,
      categories: ["Criteria 1"],

      labels: {
        enabled: false,
      },
    },
    legend: {
      align: "left",
      padding: 0,
    },
    yAxis: {
      min: 0, // Start y-axis at 0
      title: {
        text: "", // Y-axis title
      },

      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 5,
        dataLabels: {
          enabled: true, // Show data labels
          color: "#000", // Set label color
          style: {
            textOutline: "none", // Disable text outline
            fontWeight: "bold", // Optional: Make labels bold
          },
        },
      },
    },
    series: [
      {
        type: "bar",
        name: "Peer evaluation",
        data: [8],
        color: "#F1B136",
      },
      {
        type: "bar",
        name: "Self-evaluation",
        data: [9],
        color: "#EC762E",
      },
      {
        type: "bar",
        name: "Facilitator evaluation",
        data: [6],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HomeGroupSkillGraph;
