import React from "reactn";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

const HelperSearchSortForm = ({
  show,
  toggle,
  selected = "price:1",
  onChange,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="wizard-overlay">
      <Button
        type="button"
        variant="link"
        onClick={() => {
          toggle();
        }}
        className="wizard-overlay__close-icon"
      >
        &times;
      </Button>

      <Form.Group className="mb-4">
        <h3>Sort results</h3>
        {[
          {
            label: "Price (lowest to highest)",
            value: "price:1",
          },
          {
            label: "Price (highest to lowest)",
            value: "price:-1",
          },
          {
            label: "Ratings",
            value: "_ratings.score:-1",
          },
        ].map((opt, i) => {
          return (
            <Form.Check
              type="radio"
              id={`cb-sort-${i}`}
              key={i}
              label={opt.label}
              value={opt.value}
              checked={selected === opt.value}
              onChange={(e) => {
                onChange(e.target.value);
                toggle();
              }}
            />
          );
        })}
      </Form.Group>
    </div>
  );
};

HelperSearchSortForm.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HelperSearchSortForm;
