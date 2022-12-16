import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const ArrayLabel = ({ vals, emptyMsg = "-" }) => {
  return (
    <Form.Text>{vals.length === 0 ? emptyMsg : vals.join(", ")}</Form.Text>
  );
};

ArrayLabel.propTypes = {
  vals: PropTypes.arrayOf(PropTypes.string).isRequired,
  emptyMsg: PropTypes.string,
};

export default ArrayLabel;
