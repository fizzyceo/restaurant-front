import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import getChartColorsArray from "../../../../Components/Common/ChartsDynamicColor";
import { useDatePickerStore } from "../../../../stores/dashboardOneDates";
import { useDashboardStore } from "../../../../stores/DashboardOne";
import moment from "moment";
import Loader from "../../../../Components/Common/Loader";
export const StackedHorizontalBarChart = ({ dataColors }) => {
  var chartBarStackedColors = getChartColorsArray(dataColors);

  const [temperatureData, settemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [WindData, setWindData] = useState([]);
  const [yAxisData, setyAxisData] = useState([]);
  
  const { selectedDates } = useDatePickerStore((state) => state);
  const { getWind, wind, getTemperature, temperature, isLoading } =
    useDashboardStore((state) => state);
  
    // Extract data from temperatureData and format it as [x, y] points
  
  useEffect(() => {
    if (!isLoading && temperature.length > 0 && wind.length > 0) {
      const sortedTempData = [...temperature].sort((a, b) =>
        a.detectionTime.localeCompare(b.detectionTime)
      );

      const sortedWindData = [...wind].sort((a, b) =>
        a.detectionTime.localeCompare(b.detectionTime)
      );

      const tempData = sortedTempData.map((entry) => entry.temperature);

      const yAxis = sortedTempData.map((entry) => {
        // Parse the date string into a moment object
        const date = moment(entry.detectionTime, "YYYY-MM-DD");

        // Format the date as the day of the week in French
        return date.format("ddd");
      }); //further filtering to make the yaxis only show the date and not the hrs and minutes
      const xAxisHumidityData = sortedTempData.map((entry) =>
        parseFloat(entry.humidity).toFixed(0)
      );
      const xAxisWindSpeedData = sortedWindData.map((entry) =>
        parseFloat(entry.speed).toFixed(0)
      );
      settemperatureData(tempData);
      setHumidityData(xAxisHumidityData);
      setWindData(xAxisWindSpeedData);
      setyAxisData(yAxis);
    }
  }, [isLoading, temperature, wind]);

  var option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      textStyle: {
        color: "#858d98",
      },
    },
    grid: {
      left: "1%",
      right: "3%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#858d98",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(133, 141, 152, 0.1)",
        },
      },
    },
    color: chartBarStackedColors,
    yAxis: {
      type: "category",
      data: yAxisData, // Use the date as the y-axis data
      axisLine: {
        lineStyle: {
          color: "#858d98",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(133, 141, 152, 0.1)",
        },
      },
    },
    textStyle: {
      fontFamily: "Poppins, sans-serif",
    },
    series: [
      {
        name: "Temperature",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: temperatureData, // Use temperature as the x-axis data
      },
      {
        name: "Humidity",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: humidityData,
      },
      {
        name: "Wind Speed",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: WindData,
      },
    ],
  };
  if(isLoading){
    return(
      <div style={{height:"30vh"}} className="d-flex align-items-center justify-content-center">
      <Loader />
      </div>
    )
  }
  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={option} />
    </React.Fragment>
  );
};
