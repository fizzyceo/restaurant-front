import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../../Components/Common/ChartsDynamicColor";
import { useDashboardStore } from "../../../../stores/DashboardOne";
import { useDatePickerStore } from "../../../../stores/dashboardOneDates";
import moment from "moment";
import Loader from "../../../../Components/Common/Loader";

export const BrushChart = ({ dataColors, selectedDates }) => {
  var linechartBasicColors = getChartColorsArray(dataColors);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setchartData] = useState([]);
  const [data, setData] = useState([]);
  // const { selectedDates } = useDatePickerStore(
  //     (state) => state
  //   );
  const { temperature, isLoading, dataPerPeriod, getTempPerPeriod } =
    useDashboardStore((state) => state);

  useEffect(() => {
    if (selectedDates.length === 2) {
      const interval = 5;
      const body = { selectedDates, interval };
      getTempPerPeriod(body); // Pass each date to your function
    }
  }, [selectedDates]);

  useEffect(() => {
    const clearData = dataPerPeriod.flatMap((data) => {
      return data.map((subdata) => ({
        exactdate: subdata.exactdate,
        start: subdata.start,
        end: subdata.end,
        temp: parseFloat(subdata.temperature).toFixed(0), // Corrected typo in "temp"
        humi: subdata.humidity,
      }));
    });
    const sortedTempData = [...clearData].sort((a, b) =>
      a.start.localeCompare(b.start)
    );
    const dattaa = sortedTempData.map((data) => {
      return {
        x: new Date(data.start).getTime(),
        y: parseFloat(data.temp),
      };
    }); // Convert temp to a number
    setchartData(dattaa);
  }, [dataPerPeriod]);

  useEffect(() => {
    if (!isLoading && temperature.length > 0) {
      const sortedTempData = [...temperature].sort((a, b) =>
        a.detectionTime.localeCompare(b.detectionTime)
      );

      const seriesData = sortedTempData.map((entry) => ({
        x: new Date(entry.detectionTime).getTime(),
        y: parseFloat(entry.temperature).toFixed(0),
      }));
      setData(seriesData);
    }
  }, [temperature, isLoading]);

  //   const linechartBasicColors = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];

  const series = [
    {
      name: "Temperature",
      data: chartData,
    },
  ];
  var options = {
    chart: {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    colors: linechartBasicColors,
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      showAlways: true,
      labels: {
        show: true,
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      title: {
        text: "Temperature",
        style: {
          fontWeight: 500,
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  };
  if (isLoading) {
    return (
      <div
        style={{ height: "30vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Loader />
      </div>
    );
  }
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="area"
        height="350"
        className="apex-charts"
      />
    </React.Fragment>
  );
};
export const BrushChart1 = ({ dataColors }) => {
  var BrushChart1Colors = getChartColorsArray(dataColors);
  const generateDayWiseTimeSeries = (baseval, count, yrange) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };

  var data = generateDayWiseTimeSeries(new Date("11 Feb 2017").getTime(), 185, {
    min: 30,
    max: 90,
  });

  const series = [
    {
      data: data,
    },
  ];
  var options = {
    chart: {
      id: "chart1",
      brush: {
        target: "chart2",
        enabled: !0,
      },
      selection: {
        enabled: !0,
        xaxis: {
          min: new Date("19 Jun 2017").getTime(),
          max: new Date("14 Aug 2017").getTime(),
        },
      },
    },
    colors: BrushChart1Colors,
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: !1,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={{
          xaxis: {
            max: data[0]?.x,
            min: data[data.length - 1]?.x,
          },
          ...options,
        }}
        series={series}
        type="area"
        height={130}
        className="apex-charts"
      />
    </React.Fragment>
  );
};
