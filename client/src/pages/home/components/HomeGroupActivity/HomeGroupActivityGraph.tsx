import React, { type FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// import { useIntl } from "react-intl";

interface HomeGroupActivityGraphProps {
  height: number;
}

const HomeGroupActivityGraph: FC<HomeGroupActivityGraphProps> = ({
  height,
}) => {
  // const intl = useIntl();

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: height,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      crosshair: false,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },

      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        borderRadius: 5,
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "Hours Spent",
        data: [5, 10, 8, 4, 6, 2, 2],
        color: "#AEAC95",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HomeGroupActivityGraph;
