import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const WidgetTotal = ({ item }) => {
  return (
    <Col xl={12} md={6}>
      <Card
        style={{ minHeight: "146px" }}
        className={"card-animate " + item.bgColor}
      >
        <CardBody>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <p
                className={
                  "text-uppercase fw-medium mb-0 text-" + item.labelClass
                }
              >
                {item.label}
              </p>
            </div>
            {/* <div className="flex-shrink-0">
              <h5 className={"fs-14 mb-0 text-" + item.percentageClass}>
                <i className={"fs-13 align-middle " + item.percentageIcon}></i>{" "}
                {item.percentage}
              </h5>
            </div> */}
          </div>
          <div className="d-flex align-items-end justify-content-between mt-4">
            <div>
              <h4 className={"fs-22 fw-semibold ff-secondary mb-4 "}>
                <span className="counter-value" data-target="559.25">
                  <CountUp
                    start={0}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    separator={item.separator}
                    end={item.counter}
                    decimals={item.decimals}
                    duration={0.5}
                  />
                </span>
              </h4>
              {/* <Link to="#" className={"text-decoration-underline "}>
                {item.caption}
              </Link> */}
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
                <i className={item.icon + " text-" + item.iconClass}></i>
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default WidgetTotal;