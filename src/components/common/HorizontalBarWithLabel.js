import React from "reactn";
import PropTypes from "prop-types";

import "./css/HorizontalBarWithLabel.css";

const HorizontalBarWithLabel = ({ label }) => {
  return (
    <div className="hr-label">
      <div></div>
      <span>{label}</span>
    </div>
  );
};

HorizontalBarWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default HorizontalBarWithLabel;
