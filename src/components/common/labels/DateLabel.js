import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import moment from "moment-timezone";

const DateLabel = ({ val, emptyMsg = "-", age = false }) => {
  const getLabel = () => {
    if (val.length === 0) {
      return emptyMsg;
    }
    if (age) {
      return moment().diff(moment(val), "years");
    }
    return moment(val).format("MM/DD/YYYY");
  };

  return <Form.Text>{getLabel()}</Form.Text>;
};

DateLabel.propTypes = {
  val: PropTypes.objectOf(Date).isRequired,
  emptyMsg: PropTypes.string,
  age: PropTypes.bool,
};

export default DateLabel;
