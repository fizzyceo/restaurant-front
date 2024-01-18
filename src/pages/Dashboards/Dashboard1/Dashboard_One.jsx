import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import Widget from "./Widget";
import { t } from "i18next";
import Section from "./Section";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import "./extra.scss";
import HighestWidget from "./HighestWidget";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";

export default function DashboardOne() {
  const title = t("Dashboard");
  document.title = title;
  const [numilogInCount, setNumilogInCount] = useState(0);
  const [numilogOutCount, setNumilogOutCount] = useState(0);
  const [TotalInCount, setTotalInCount] = useState(0);
  const [totalOutCount, setTotalOutCount] = useState(0);
  const [othersInCount, setOthersInCount] = useState(0);
  const [othersOutCount, setOthersOutCount] = useState(0);
  const { getAccessHistory, history, deleteHistory, filters, setFilters } =
    useAccessHistoryStore((state) => state);
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
          counter: TotalInCount,
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
          counter: totalOutCount,
          decimals: 0,
          suffix: "",
          prefix: "",
        },
        // {
        //   id: 2,
        //   counter: "40",
        //   decimals: 0,
        //   suffix: "sec",
        //   prefix: "",
        // },
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
      // bgColor: "bg-info",
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
      // bgColor: "bg-info",
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
      label: "ENTRÉE(S) D'AUTRES",
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
      // bgColor: "bg-info",
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
      label: "SORTIE(s) D'AUTRES",
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
  useEffect(() => {
    getAccessHistory && getAccessHistory();
  }, []);

  useEffect(() => {
    setTotalInCount(0);
    setTotalOutCount(0);
    setNumilogOutCount(0);
    setNumilogInCount(0);
    setOthersInCount(0);
    setOthersOutCount(0);
    if (history.length > 0) {
      history.map((record) => {
        if (record.access === "IN") {
          console.log("IN");
          setTotalInCount((total) => total + 1);
          console.log(TotalInCount);
          if (record.transporter === "NUMILOG") {
            setNumilogInCount((total) => total + 1);
          } else {
            setOthersInCount((total) => total + 1);
          }
        } else if (record.access === "OUT") {
          console.log("OUT");

          setTotalOutCount((total) => total + 1);
          console.log(TotalInCount);

          if (record.transporter === "NUMILOG") {
            setNumilogOutCount((total) => total + 1);
          } else {
            setOthersOutCount((total) => total + 1);
          }
        }
      });
    }
  }, [history]);

  // if(isLoading) return (<div>Is Loading...</div>)

  return (
    <React.Fragment>
      <Container fluid>
        <Section />

        <div
          className=""
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {(widgetsInfo || []).map((item, key) => (
            <Col xl={4} md={6} key={key}>
              <Card className={"card-animate " + item.bgColor}>
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className={"fw-medium mb-0 text-" + item.labelClass}>
                        {item.label}
                      </p>
                      <h2
                        className={
                          "mt-4 ff-secondary fw-semibold " + item.counterClass
                        }
                      >
                        {item.subCounter.map((item, key) => (
                          <span className="counter-value" key={key}>
                            <CountUp
                              start={0}
                              prefix={item.prefix}
                              suffix={item.suffix}
                              separator={item.separator}
                              end={item.counter}
                              decimals={item.decimals}
                              duration={1}
                            />
                          </span>
                        ))}
                      </h2>
                      <p className={"mb-0 text-" + item.labelClass}>
                        <span className={"mb-0 badge " + item.badgeClass}>
                          <i className={"align-middle " + item.badge}></i>{" "}
                          {item.percentage}
                        </span>{" "}
                        vs. mois précédent
                      </p>
                    </div>
                    <div>
                      <div
                        className="avatar-sm flex-shrink-0"
                        style={{
                          transform: !item.in ? "scaleX(-1)" : " ",
                        }}
                      >
                        <span
                          className={
                            "avatar-title rounded-circle fs-2 bg-soft-" +
                            item.iconClass
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="20"
                            viewBox="0 0 640 512"
                          >
                            <path
                              fill="#ffffff"
                              d="M112 0C85.5 0 64 21.5 64 48V96H16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 272c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 240c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 208c8.8 0 16 7.2 16 16s-7.2 16-16 16H64V416c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H112zM544 237.3V256H416V160h50.7L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}

          {(totalWidgets || []).map((item, key) => (
            <Col xl={4} md={6} key={key}>
              <Card className={"card-animate " + item.bgColor}>
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <p
                        className={
                          "text-uppercase fw-medium mb-0 text-" +
                          item.labelClass
                        }
                      >
                        {item.label}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <h5 className={"fs-14 mb-0 text-" + item.percentageClass}>
                        <i
                          className={
                            "fs-13 align-middle " + item.percentageIcon
                          }
                        ></i>{" "}
                        {item.percentage}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4
                        className={
                          "fs-22 fw-semibold ff-secondary mb-4 " +
                          item.counterClass
                        }
                      >
                        <span className="counter-value" data-target="559.25">
                          <CountUp
                            start={0}
                            prefix={item.prefix}
                            suffix={item.suffix}
                            separator={item.separator}
                            end={item.counter}
                            decimals={item.decimals}
                            duration={1}
                          />
                        </span>
                      </h4>
                      <Link
                        to="#"
                        className={
                          "text-decoration-underline " + item.captionClass
                        }
                      >
                        {item.caption}
                      </Link>
                    </div>
                    <div
                      style={{
                        transform: !item.in ? "scaleX(-1)" : " ",
                      }}
                      className="avatar-sm flex-shrink-0"
                    >
                      <span
                        className={
                          "avatar-title rounded fs-3 bg-soft-" + item.iconClass
                        }
                      >
                        <i
                          className={item.icon + " text-" + item.iconClass}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </div>
      </Container>
    </React.Fragment>
  );
}
