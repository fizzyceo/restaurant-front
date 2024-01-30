import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { t } from "i18next";
import Section from "./Section";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

import "./extra.scss";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";
import { useDatePickerStore } from "../../../stores/datePickerStore";
import WidgetInfo from "./widgets/WidgetInfo";
import WidgetTotal from "./widgets/WidgetTotal";
import PieChart from "./widgets/PieChart";
import TimeWidget from "./widgets/TimeWidget";
import { timeAgo } from "../../../Components/Common/TimeAgo";
import WidgetsContainer from "./WidgetsContainer";
import HighestWidget from "./HighestWidget";
// const SimpleDonut = ({ dataColors }) => {

//   return (

//   );
// };

export default function DashboardOne() {
  const title = t("EASYVAM | Dashboard");
  const [numilogInCount, setNumilogInCount] = useState(0);
  const [numilogOutCount, setNumilogOutCount] = useState(0);
  const [TotalInCount, setTotalInCount] = useState(0);
  const [totalOutCount, setTotalOutCount] = useState(0);
  const [othersInCount, setOthersInCount] = useState(0);
  const [othersOutCount, setOthersOutCount] = useState(0);
  const [serieNumilog, setSerieNumilog] = useState([]);
  const [serieOthers, setSerieOthers] = useState([]);
  const [serieTotal, setSerieTotal] = useState([]);
  const [chartsReady, setChartsReady] = useState(false);
  const [avgTimeToday, setAvgTimeToday] = useState(0);
  const [maxMatricule, setMaxMatricule] = useState(0);
  const [minMatricule, setMinMatricule] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [minTime, setMinTime] = useState(0);
  const { getAccessHistory, history } = useAccessHistoryStore((state) => state);
  const { selectedDates } = useDatePickerStore((state) => state);

  var chartDonutBasicColors = getChartColorsArray(
    '[ "--vz-success", "--vz-danger", "--vz-info"]'
  );

  var options = {
    chart: {
      height: 300,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartDonutBasicColors,
    labels: ["ENTREE", "SORTIE"],
    noData: { text: "Aucune Donnee!" },
  };
  useEffect(() => {
    //favicon setup
    document.title = title;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = "/logo-sm.png";
    } else {
      // If no favicon link exists, create a new one
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/png";
      newFavicon.href = "/logo-sm.png";
      document.head.appendChild(newFavicon);
    }
  }, []);
  const structuredWidgets = [
    {
      title: "NUMILOG",
      entry: {
        id: 3,
        bgColor: "bg-primary",
        label: "ENTRÉE(S)",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: numilogInCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: true,
      },
      exit: {
        id: 3,
        bgColor: "bg-primary",
        label: "SORTIE(S)",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: numilogOutCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: false,
      },
      chart: {
        style: {
          bgColor: "bg-primary",
          textColor: "text-white",
        },
        title: "NUMILOG STATISTIQUES",
        options: options,
        series: serieNumilog,
      },
    },
    {
      title: "AUTRES TRANSPORTEURS",
      entry: {
        id: 2,
        label: "ENTRÉE(S)",
        labelClass: "muted",
        percentage: "-6 %",
        percentageClass: "danger",
        bgColor: "bg-primary",
        percentageIcon: "ri-arrow-right-down-line",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: othersInCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: true,
      },
      exit: {
        id: 2,
        label: "SORTIE(S)",
        labelClass: "muted",
        percentage: "-6 %",
        percentageClass: "danger",
        bgColor: "bg-primary",
        percentageIcon: "ri-arrow-right-down-line",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: othersOutCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: false,
      },
      chart: {
        title: "AUTRES STATISTIQUES",
        options: options,
        series: serieOthers,
      },
    },
    {
      title: "TOTAL",
      entry: {
        id: 1,
        label: "ENTRÉE(S)",
        labelClass: "muted",
        percentage: "-6 %",
        percentageClass: "danger",
        bgColor: "bg-primary",
        percentageIcon: "ri-arrow-right-down-line",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: TotalInCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: true,
      },
      exit: {
        id: 1,
        label: "SORTIE(S)",
        labelClass: "muted",
        percentage: "-6 %",
        percentageClass: "danger",
        bgColor: "bg-primary",
        percentageIcon: "ri-arrow-right-down-line",
        labelClass: "white-50",
        counterClass: "text-white",
        badgeClass: "badge-soft-light",
        badge: "ri-arrow-down-line",
        percentage: "0.24 %",
        iconClass: "light",
        feaIcon: "log-in",
        decimals: 0,
        suffix: "",
        prefix: "",
        subCounter: [
          {
            id: 1,
            counter: totalOutCount,
            decimals: 0,
            suffix: "",
            prefix: "",
          },
        ],
        in: false,
      },
      chart: {
        title: "TOTALE STATISTIQUES",
        options: options,
        series: serieTotal,
      },
    },
  ];
  const widgetsInfo = [
    {
      id: 3,
      bgColor: "bg-primary",
      label: "ENTRÉE(S) NUMILOG",
      labelClass: "white-50",
      counterClass: "text-white",
      badgeClass: "badge-soft-light",
      badge: "ri-arrow-down-line",
      percentage: "0.24 %",
      iconClass: "light",
      feaIcon: "log-in",
      decimals: 0,
      suffix: "",
      prefix: "",
      subCounter: [
        {
          id: 1,
          counter: numilogInCount,
          decimals: 0,
          suffix: "",
          prefix: "",
        },
      ],
      in: true,
    },
    {
      id: 3,
      bgColor: "bg-primary",
      label: "SORTIE(S) NUMILOG",
      labelClass: "white-50",
      counterClass: "text-white",
      badgeClass: "badge-soft-light",
      badge: "ri-arrow-down-line",
      percentage: "0.24 %",
      iconClass: "light",
      feaIcon: "log-in",
      decimals: 0,
      suffix: "",
      prefix: "",
      subCounter: [
        {
          id: 1,
          counter: numilogOutCount,
          decimals: 0,
          suffix: "",
          prefix: "",
        },
      ],
      in: false,
    },
  ];
  const totalWidgets = [
    {
      id: 2,
      label: "Entrée(s) Totales",
      labelClass: "muted",
      percentage: "+29.08 %",
      percentageClass: "success",
      percentageIcon: "ri-arrow-right-up-line",
      caption: "Afficher la liste d'Entrée(s)",
      icon: "bg-soft-primary shadow-none bg-opacity-10",
      counter: TotalInCount,
      caption: "See details",
      iconClass: "light",
      counterClass: "text-white",
      captionClass: "text-white-50",
      icon: "bx bx-bar-chart-alt-2",
      iconClass: "warning",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 2,
      label: "SORTIE(s) TOTALES",
      labelClass: "muted",
      percentage: "-2.08 %",
      percentageClass: "danger",
      percentageIcon: "ri-arrow-right-down-line",
      caption: "Afficher la liste d'Entrée(s)",
      icon: "bg-soft-primary shadow-none bg-opacity-10",
      counter: totalOutCount,
      caption: "See details",
      iconClass: "light",
      counterClass: "text-white",
      captionClass: "text-white-50",
      icon: "bx bx-bar-chart-alt-2",
      iconClass: "warning",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 2,
      label: "ENTRÉE(S)",
      labelClass: "muted",
      percentage: "-6 %",
      percentageClass: "danger",
      percentageIcon: "ri-arrow-right-down-line",
      counter: "36894",
      caption: "Afficher la liste des sortie(s)",
      icon: "bg-soft-primary shadow-none bg-opacity-10",
      counter: othersInCount,
      caption: "See details",
      iconClass: "light",
      counterClass: "text-white",
      captionClass: "text-white-50",
      icon: "bx bxs-truck",
      iconClass: "info",
      decimals: 0,
      prefix: "",
      suffix: "",
      in: true,
    },
    {
      id: 2,
      label: "SORTIE(s)",
      labelClass: "muted",
      percentage: "+2 %",
      percentageClass: "success",
      percentageIcon: "ri-arrow-right-up-line",
      counter: "36894",
      caption: "Afficher la liste d'Entrée(s)",
      icon: "bg-soft-primary shadow-none bg-opacity-10",
      counter: othersOutCount,
      caption: "See details",
      iconClass: "light",
      // bgColor: "bg-info",
      counterClass: "text-white",
      captionClass: "text-white-50",
      icon: "bx bxs-truck",
      iconClass: "info",
      decimals: 0,
      prefix: "",
      suffix: "",
      in: false,
    },
  ];

  const timeWidgets = [
    {
      id: 3,
      bgColor: "bg-primary",
      label: "MOYENNE",
      labelClass: "white-50",
      counterClass: "text-white",
      badgeClass: "badge-soft-light",
      badge: "ri-arrow-down-line",
      percentage: "0.24 %",
      iconClass: "light",
      feaIcon: "clock",
      decimals: 0,
      suffix: "",
      prefix: "",
      subCounter: [
        {
          id: 1,
          counter: parseInt(avgTimeToday / 3600),
          decimals: 0,
          suffix: "h ",
          prefix: "",
        },
        {
          id: 2,
          counter:
            (parseFloat(avgTimeToday / 3600) - parseInt(avgTimeToday / 3600)) *
            60,
          decimals: 0,
          suffix: "m ",
          prefix: "",
        },

        // {
        //   id: 2,
        //   counter: parseInt(
        //     (parseFloat(avgTimeToday / 60) - parseInt(avgTimeToday / 60)) * 60
        //   ),
        //   decimals: 0,
        //   suffix: "sec",
        //   prefix: "",
        // },
      ],
    },
    {
      id: 4,
      bgColor: "bg-primary",
      label: "MAX",
      labelClass: "white-50",
      counterClass: "text-white",
      badgeClass: "badge-soft-light",
      badge: "ri-arrow-down-line",
      percentage: "0.24 %",
      iconClass: "light",
      feaIcon: "clock",
      decimals: 0,
      suffix: "",
      prefix: "",
      matricule: maxMatricule,
      subCounter: [
        {
          id: 1,
          counter: parseInt(maxTime / 3600),
          decimals: 0,
          suffix: "h ",
          prefix: "",
        },
        {
          id: 2,
          counter: (parseFloat(maxTime / 3600) - parseInt(maxTime / 3600)) * 60,
          decimals: 0,
          suffix: "m ",
          prefix: "",
        },
        // {
        //   id: 2,
        //   counter: parseInt(
        //     (parseFloat(maxTime / 60) - parseInt(maxTime / 60)) * 60
        //   ),
        //   decimals: 0,
        //   suffix: "sec",
        //   prefix: "",
        // },
      ],
    },
    {
      id: 4,
      bgColor: "bg-primary",
      label: "MIN",
      labelClass: "white-50",
      counterClass: "text-white",
      badgeClass: "badge-soft-light",
      badge: "ri-arrow-down-line",
      percentage: "0.24 %",
      iconClass: "light",
      feaIcon: "clock",
      decimals: 0,
      suffix: "",
      prefix: "",
      matricule: minMatricule,
      subCounter: [
        {
          id: 1,
          counter: parseInt(minTime / 3600),
          decimals: 0,
          suffix: "h ",
          prefix: "",
        },
        {
          id: 2,
          counter: (parseFloat(minTime / 3600) - parseInt(minTime / 3600)) * 60,
          decimals: 0,
          suffix: "m ",
          prefix: "",
        },
        // {
        //   id: 3,
        //   counter: parseInt(
        //     (parseFloat(minTime / 60) - parseInt(minTime / 60)) * 60
        //   ),
        //   decimals: 0,
        //   suffix: "sec",
        //   prefix: "",
        // },
      ],
    },
  ];
  useEffect(() => {
    //fetch data based on the selected date
    const now = new Date(); // Current date and time
    const midnightToday = new Date(now); // Clone the current date
    midnightToday.setHours(0, 0, 0, 0); // Set time to midnight
    const dateFrom = midnightToday.toISOString();
    const dateTo = now.toISOString(); // Current date and time

    getAccessHistory &&
      getAccessHistory({
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
  }, [selectedDates]);

  useEffect(() => {
    //update the counters everytime the data changes
    setChartsReady(false);
    setTotalInCount(0);
    setTotalOutCount(0);
    setNumilogOutCount(0);
    setNumilogInCount(0);
    setOthersInCount(0);
    setOthersOutCount(0);

    if (history.length > 0) {
      history.map((record) => {
        if (record.access === "IN") {
          setTotalInCount((total) => total + 1);

          if (record.transporter === "NUMILOG") {
            setNumilogInCount((total) => total + 1);
          } else {
            setOthersInCount((total) => total + 1);
          }
        } else if (record.access === "OUT") {
          setTotalOutCount((total) => total + 1);

          if (record.transporter === "NUMILOG") {
            setNumilogOutCount((total) => total + 1);
          } else {
            setOthersOutCount((total) => total + 1);
          }
        }
      });
    }

    setChartsReady(true);
  }, [history]);

  useEffect(() => {
    if (history.length > 0) {
      // Create a map to store staying times for each immatriculationRemorque
      const stayingTimesMap = new Map();

      // Iterate through each history record to fill entryDate and exitDate
      history.forEach((record) => {
        const { immatriculationRemorque, date, access } = record;

        // Parse date strings into JavaScript Date objects
        const currentDate = new Date(date);

        // Check if the immatriculationRemorque already exists in the map
        if (!stayingTimesMap.has(immatriculationRemorque)) {
          // If it doesn't exist, add a new entry with the current date and access type
          stayingTimesMap.set(immatriculationRemorque, {
            entryDate: null,
            exitDate: null,
            stayingTime: 0,
          });
        }

        // Get the existing entry for the immatriculationRemorque
        const existingEntry = stayingTimesMap.get(immatriculationRemorque);

        if (access === "IN") {
          // Update entry date for "IN" access
          stayingTimesMap.set(immatriculationRemorque, {
            ...existingEntry,
            entryDate: currentDate,
          });
        } else if (access === "OUT") {
          // Ensure both currentDate and existingEntry.entryDate are valid dates
          if (!isNaN(currentDate) && !isNaN(existingEntry.entryDate)) {
            // If "OUT" entry comes first, set exit date without calculating staying time
            if (!existingEntry.exitDate) {
              stayingTimesMap.set(immatriculationRemorque, {
                ...existingEntry,
                exitDate: currentDate,
              });
            }
          } else {
            console.error("Invalid date format");
          }
        }
      });

      // Calculate staying time for each entry
      history.forEach((record) => {
        const { immatriculationRemorque, date, access } = record;
        const currentDate = new Date(date);

        const existingEntry = stayingTimesMap.get(immatriculationRemorque);

        // Ensure both currentDate and existingEntry.exitDate are valid dates
        if (
          existingEntry.entryDate !== null &&
          existingEntry.exitDate !== null
        ) {
          // Calculate staying time and update dates
          const stayingTime =
            new Date(existingEntry.exitDate).getTime() -
            new Date(existingEntry.entryDate).getTime();
          stayingTimesMap.set(immatriculationRemorque, {
            ...existingEntry,
            stayingTime: stayingTime,
          });
        } else {
          console.error("Invalid date format");
        }
      });

      // Find the immatriculationRemorque with the biggest and smallest staying times
      let maxStayingTimeRemorque = null;
      let minStayingTimeRemorque = null;
      let maxStayingTime = 0;
      let minStayingTime = Infinity;
      let avg = 0;
      let index = 0;
      stayingTimesMap.forEach(({ stayingTime }, immatriculationRemorque) => {
        if (stayingTime !== 0) {
          if (stayingTime > maxStayingTime) {
            maxStayingTime = stayingTime;
            maxStayingTimeRemorque = immatriculationRemorque;
          }

          if (stayingTime < minStayingTime) {
            minStayingTime = stayingTime;
            minStayingTimeRemorque = immatriculationRemorque;
          }
        }
        avg += stayingTime;
        index++;
      });
      //calculate the average time, and compare it to yesterdays

      avg = avg / index;
      setAvgTimeToday(parseInt(avg / 1000));

      //set the max staying time with its plate number

      setMaxTime(parseInt(maxStayingTime / 1000));
      setMaxMatricule(maxStayingTimeRemorque);

      //set the min staying time with its plate number

      setMinTime(parseInt(minStayingTime / 1000));
      setMinMatricule(minStayingTimeRemorque);
    }
  }, [history]);

  useEffect(() => {
    const serieN = [parseInt(numilogInCount), parseInt(numilogOutCount)];
    const serieO = [parseInt(othersInCount), parseInt(othersOutCount)];
    const serieT = [parseInt(TotalInCount), parseInt(totalOutCount)];
    setSerieNumilog(serieN);
    setSerieOthers(serieO);
    setSerieTotal(serieT);
  }, [numilogInCount, numilogOutCount, othersInCount, othersOutCount]);

  if (chartsReady) {
    return (
      <React.Fragment>
        <Container fluid>
          <Section />

          <div className="widgetContainer">
            {(structuredWidgets || []).map((item, key) => (
              <WidgetsContainer key={key} item={item} />
            ))}
          </div>
          <Card style={{ border: "1px solid black" }}>
            <CardHeader>
              <h4>TEMPS PARKING</h4>
            </CardHeader>
            <CardBody className="widgetContainer">
              {(timeWidgets || []).map((item, key) => (
                <TimeWidget key={key} item={item} />
              ))}
            </CardBody>
          </Card>
        </Container>
      </React.Fragment>
    );
  } else {
    return <div>Loading...</div>;
  }
}
