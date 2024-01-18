import { max } from "moment";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import CountUp from "react-countup";

const HighestWidget = () => {
  return (
    <React.Fragment>
      <Row className="mt-2">
        <Card className="text-center  ">
          <CardHeader>
            <h2>Highest</h2>
          </CardHeader>
          <CardBody className=" d-flex align-items-center flex-row p-0">
            <Col className="p-0">
              <div className="p-1 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <span className="counter-value" data-target="36.48">
                    <CountUp
                      start={0}
                      end={5}
                      decimals={0}
                      suffix="°"
                      duration={4}
                    />
                  </span>
                </h5>
                <p className="text-muted mb-0">Temperature</p>
              </div>
            </Col>
            <Col className="p-0">
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <span className="counter-value" data-target="92.54">
                    <CountUp
                      start={0}
                      end={5}
                      decimals={0}
                      suffix="%"
                      duration={4}
                    />
                  </span>
                </h5>
                <p className="text-muted mb-0">Humidity</p>
              </div>
            </Col>
            <Col className="p-0">
              <div className="p-3 border border-dashed border-end-0">
                <h5 className="mb-1">
                  <span className="counter-value" data-target="8.62">
                    <CountUp
                      start={0}
                      end={5}
                      decimals={1}
                      suffix="kmh"
                      duration={4}
                    />
                  </span>
                </h5>
                <p className="text-muted mb-0">Wind Speed</p>
              </div>
            </Col>
          </CardBody>
        </Card>
      </Row>
    </React.Fragment>
  );
};

export default HighestWidget;
