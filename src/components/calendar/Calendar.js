import React, { useState, useEffect } from "reactn";
import { Container, Row, Col, Alert } from "react-bootstrap";
import ReactCalendar from "react-calendar";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

import InternalLayout from "../layout/InternalLayout";
import Tabs from "../common/Tabs";
import ButtonList from "../common/ButtonList";
import ProfilePicture from "../common/ProfilePicture";
import { useApiPost } from "../../hooks/useApi";

import "react-calendar/dist/Calendar.css";
import ChevronRight from "@material-ui/icons/ChevronRight";

const Calendar = () => {
  const [error] = useState(null);

  const apiCal = useApiPost(`/calendar`, (resp) => {
    console.log(resp);
  });

  useEffect(() => {
    apiCal.mutate({});
  }, []);

  return (
    <InternalLayout>
      {error ? (
        <Alert variant="danger" className="header-error">
          {error.message}
        </Alert>
      ) : null}
      <Container>
        <Row>
          <Col xs={12} sm={12} md={{ span: 8, offset: 2 }}>
            <h2 className="mb-3">Calendar</h2>

            <ReactCalendar
              onChange={(dt) => alert(dt.toString())}
              next2Label={null}
              prev2Label={null}
              tileClassName="fw-bold"
            />
            <br />
            <br />

            {apiCal.isLoading ? (
              <p>Loading...</p>
            ) : (
              <Tabs
                tabs={[
                  {
                    label: "BOOKINGS",
                    content: (
                      <>
                        <ButtonList
                          className="mt-5 mb-5"
                          buttons={
                            apiCal.data
                              ? apiCal.data.bookings.map((booking) => {
                                  return {
                                    label: booking._id,
                                    render: () => {
                                      const dt = moment.utc(
                                        booking.dates.arrivalDateTime
                                      );
                                      const endDt = moment(dt).add(
                                        booking.hours,
                                        "hours"
                                      );

                                      return (
                                        <Link
                                          to={`/messages/${booking.bookedWith._id}/${booking._id}`}
                                          style={{ textDecoration: "none" }}
                                        >
                                          <Row>
                                            <Col xs={1}>
                                              <ProfilePicture
                                                user={booking.bookedWith}
                                                size="sm"
                                              />
                                            </Col>
                                            <Col>
                                              <strong>
                                                {dt.format("ddd, MMM dd")} with{" "}
                                                {booking.bookedWith.name}
                                              </strong>
                                              <p className="text-muted pb-0">
                                                {dt.format("h:mm A")} -{" "}
                                                {endDt.format("h:mm A")}
                                              </p>
                                            </Col>
                                            <Col
                                              xs={2}
                                              className="text-end pt-3"
                                            >
                                              <ChevronRight />
                                            </Col>
                                          </Row>
                                        </Link>
                                      );
                                    },
                                  };
                                })
                              : []
                          }
                          emptyMsg="Your calendar is currently empty."
                          styles={{
                            borderTop: "none",
                          }}
                        />
                      </>
                    ),
                  },
                  {
                    label: "AVAILABILITY",
                    content: (
                      <>
                        <ButtonList
                          className="mt-5 mb-5"
                          buttons={[]}
                          emptyMsg="You have not set your availability."
                          styles={{ borderTop: "none" }}
                        />
                      </>
                    ),
                  },
                ]}
              />
            )}
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Calendar;
