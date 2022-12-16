import React from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import logo from "../../../Logo-White.svg";

const Footer = ({ includeHelpText = true }) => {
  return (
    <footer>
      <Container>
        {includeHelpText ? (
          <>
            <h3 className="text-center">
              Need help booking? Call 1 (800) 555-1234
            </h3>
            <hr />
          </>
        ) : null}
        <div className="links">
          <Link to="/terms-of-service">Terms Of Service</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/our-team">Our Team</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
        {!includeHelpText ? <hr /> : null}
        {/* <h2 className={`mt-${includeHelpText ? 5 : 3}`}>manana</h2> */}
        <div className={`mt-${includeHelpText ? 5 : 3}`}>
          <a href="/" >
            <img src={logo} alt="manana"  title="manana"/>
          </a>
        </div>
        <p>&copy; 2021 Manana Health. All rights reserved.</p>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  includeHelpText: PropTypes.bool,
};

export default Footer;
