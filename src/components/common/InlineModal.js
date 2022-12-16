import React from "reactn";
import { Button } from "react-bootstrap";

const InlineModal = ({ show, toggle, children, overlay = true }) => {
  return (
    <div
      className={`service-item__sublist${show ? "" : " d-none"}`}
      style={{ position: "absolute", width: "100%", top: -25 }}
    >
      <Button
        type="button"
        variant="link"
        onClick={() => toggle()}
        className="service-item__sublist__close-icon"
      >
        &times;
      </Button>
      {children}
    </div>
  );
};

export default InlineModal;
