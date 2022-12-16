import React from "reactn";
import { Link } from "react-router-dom";
import { createMedia } from "@artsy/fresnel";
import { Container, Row, Col } from "react-bootstrap";

import MainNav from "./components/MainNav";
import Footer from "./components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./PrimaryLayout.css";

import logo from "../../logo.png";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const PageHeader = ({ children, mobile }) => {
  return (
    <div className="page-header full">
      <Container>
        <Row>
          <Col md={3}>
            <Link to="/">
              <img
                src={logo}
                alt="manana"
                title="manana"
                className="page-header__logo"
              />
            </Link>
          </Col>
          <Col md={9}>
            <MainNav />
          </Col>
        </Row>
        {children}
      </Container>
    </div>
  );
};

const DesktopContainer = ({ children }) => {
  return (
    <Media greaterThan="mobile">
      <PageHeader mobile={false}>{children}</PageHeader>
    </Media>
  );
};

const MobileContainer = ({ children }) => {
  return (
    <Media at="mobile">
      <Container fluid>
        <p>[HEADER]</p>
        <p>[NAV]</p>
        {children}
      </Container>
    </Media>
  );
};

const PrimaryLayout = ({ children }) => {
  return (
    <MediaContextProvider>
      <DesktopContainer>{children}</DesktopContainer>
      <MobileContainer>{children}</MobileContainer>
      <Footer />
    </MediaContextProvider>
  );
};

export default PrimaryLayout;
