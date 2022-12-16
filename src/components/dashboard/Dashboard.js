import React, { useState } from "reactn";
import { Container, Row, Col, Alert, Card, Form  } from "react-bootstrap";
import AttachMoney from '@material-ui/icons/AttachMoney';
import Alarm from '@material-ui/icons/Alarm';
import BarChart from '@material-ui/icons/BarChart';
import Block from '@material-ui/icons/Block';
import DataUsage from '@material-ui/icons/DataUsage';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import InternalLayout from "../layout/InternalLayout";
import "./dashboard.css";
const data = [
  {
    name: 'SUN',
    uv: 70,
  },
  {
    name: 'MON',
    uv: 110,
  },
  {
    name: 'TUE',
    uv: 160,
  },
  {
    name: 'WED',
    uv: 100,
  },
  {
    name: 'THU',
    uv: 110,
  },
  {
    name: 'FRI',
    uv: 80,
  },
  {
    name: 'SAT',
    uv: 125,
  },
];
const Dashboard = () => {
  const [error] = useState(null);

  return (
    <InternalLayout>
      {error ? (
        <Alert variant="danger" className="header-error">
          {error.message}
        </Alert>
      ) : null}
      <Container className="dashboard">
        <Row>
          <Col xs={12} sm={12} md={{ span: 8, offset: 2 }}>
            <h1 className="mb-3">Dashboard</h1>
          </Col>
          <Col md={{ span: 8, offset: 2 }} sm={12} className="my-4">
            <Card className="p-3">
              <Card.Body className="d-flex align-items-center">
                <div className="card-icon">
                  <AttachMoney />
                </div>
                <div className="px-4">
                  <Card.Title>Total amount earned</Card.Title>
                  <Card.Text>$125,000.00</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={{ span: 8, offset: 2 }} sm={12} className="my-4">
            <Card className="p-3">
              <Card.Body className="d-flex align-items-center">
                <div className="card-icon">
                  <Alarm />
                </div>
                <div className="px-4 border-right">
                  <Card.Title>Your Avg. Response Time</Card.Title>
                  <Card.Text>1 Hr</Card.Text>
                </div>
                <div className="px-4">
                  <Card.Title>Avg. of Other Helpers</Card.Title>
                  <Card.Text>45 Mins</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={{ span: 8, offset: 2 }} sm={12} className="my-4 d-flex align-items-center justify-content-between">
            <div>
              <span>Jan 1 - Jan 8, 2022</span>
              <CalendarToday className="mx-3"/>
              <ArrowBackIos  className="mx-3"/>
              <ArrowForwardIos  className="mx-3"/>

            </div>
            <div style={{width: "150px"}}>
              <Form.Select >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="Year">Year</option>
              </Form.Select>
            </div>
          </Col>
          <Col md={{ span: 8, offset: 2 }} sm={12} className="my-4">
            <Card className="p-3">
              <Card.Body className="d-flex align-items-center">
                <div className="card-icon">
                  <BarChart />
                </div>
                <div className="px-4">
                  <Card.Title>Amount earned this week</Card.Title>
                  <Card.Text>$150.00</Card.Text>
                </div>
              </Card.Body>
              <Card.Body>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart  data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <Line type="linear" dataKey="uv" stroke="#356f7c" dot={false}/>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$ ${value}`}/>

                    <ReferenceLine x="SAT" stroke="#f3ebea"/>
                    <ReferenceLine y="160" stroke="#f3ebea"/>
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={{ span: 4, offset: 2 }} sm={12} className="my-4">
            <Card className="p-3">
              <Card.Body className="d-flex align-items-center">
                <div className="card-icon">
                  <DataUsage />
                </div>
                <div className="px-4">
                  <Card.Title>Capacity booked</Card.Title>
                  <Card.Text className="mb-0">60%</Card.Text>
                  <div className="d-flex align-items-center">
                    <div className="triangle-up success"></div>
                    <div className="mx-3">25%</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={{ span: 4 }} sm={12} className="my-4">
            <Card className="p-3">
              <Card.Body className="d-flex align-items-center">
                <div className="card-icon">
                  <Block />
                </div>
                <div className="px-4">
                  <Card.Title>Cancellations</Card.Title>
                  <Card.Text className="mb-0">5</Card.Text>
                  <div className="d-flex align-items-center">
                    <div className="triangle-up danger"></div>
                    <div className="mx-3">25%</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Dashboard;
