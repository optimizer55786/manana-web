import React from "reactn";
import { createMedia } from "@artsy/fresnel";
import { Container, Row, Col, Button } from "react-bootstrap";

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

const HomepageHeading = ({ mobile }) => (
  <Row>
    <Col>
      <h1 className={`page-header__title ${mobile ? "mobile" : ""}`}>
        <a href="/"><img src={logo} alt="manana" title="manana" /></a>
      </h1>
      <h1 className={`page-header__sub-header ${mobile ? "mobile" : ""}`}>
        Getting people the help they need for life's everyday tasks.
      </h1>
      <Button variant="primary" size="huge">
        FIND HELP
      </Button>
    </Col>
    <Col>&nbsp;</Col>
  </Row>
);

const PageHeader = ({ children, mobile }) => {
  return (
    <div className="page-header">
      <Container>
        <MainNav />
        {children}
      </Container>
    </div>
  );
};

const DesktopContainer = ({ children }) => {
  return (
    <Media greaterThan="mobile">
      <PageHeader mobile={false}>
        <HomepageHeading />
      </PageHeader>
      {children}
    </Media>
  );
};

const MobileContainer = ({ children }) => {
  return (
    <Media at="mobile">
      <Container fluid>
        <p>[HEADER]</p>
        <p>[NAV]</p>
      </Container>
      {children}
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
