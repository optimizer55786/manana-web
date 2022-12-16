import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const AddressLabel = ({ val, emptyMsg = "-" }) => {
  const parts = [];

  if (val.street1) {
    parts.push(val.street1);
  }
  if (val.street2) {
    parts.push(val.street2);
  }
  if (val.city) {
    parts.push(val.city);
  }
  if (val.state && val.zip) {
    parts.push(`${val.state} ${val.zip}`);
  } else if (val.state) {
    parts.push(val.state);
  } else {
    parts.push(val.zip);
  }

  return (
    <Form.Text>{parts.length === 0 ? emptyMsg : parts.join(", ")}</Form.Text>
  );
};

AddressLabel.propTypes = {
  val: PropTypes.object.isRequired,
  emptyMsg: PropTypes.string,
};

export default AddressLabel;
