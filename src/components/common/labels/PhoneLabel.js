import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const PhoneLabel = ({ val, emptyMsg = "-" }) => {
  return <Form.Text>{val.length === 0 ? emptyMsg : `+1 ${val}`}</Form.Text>;
};

PhoneLabel.propTypes = {
  val: PropTypes.string.isRequired,
  emptyMsg: PropTypes.string,
};

export default PhoneLabel;
