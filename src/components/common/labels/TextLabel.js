import React from "reactn";
import PropTypes from "prop-types";

const TextLabel = ({ val, emptyMsg = "-" }) => {
  return (
    <small
      className="form-text"
      style={{ textTransform: "initial !important" }}
    >
      {val.length === 0 ? emptyMsg : val}
    </small>
  );
};

TextLabel.propTypes = {
  val: PropTypes.string.isRequired,
  emptyMsg: PropTypes.string,
};

export default TextLabel;
