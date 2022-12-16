import React from "reactn";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import ChevronRight from "@material-ui/icons/ChevronRight";
import AddCircle from "@material-ui/icons/AddCircle";

import "./css/ButtonList.css";

const ButtonList = ({
  buttons,
  className,
  styles,
  emptyMsg,
  hover = false,
}) => {
  const addClasses = ["button-list"];

  if (className) {
    addClasses.push(className);
  }

  if (hover) {
    addClasses.push("button-list-hover");
  }

  const renderEmptyState = () => {
    if (!emptyMsg) {
      return null;
    }

    return <p className="text-center lead mt-5 mb-5">{emptyMsg}</p>;
  };

  const getIcon = (btn) => {
    if (btn.icon) {
      return btn.icon;
    }

    return btn.hasContent ? <ChevronRight /> : <AddCircle />;
  };

  return (
    <div className={addClasses.join(" ")} style={styles || {}}>
      {buttons.length === 0
        ? renderEmptyState()
        : buttons.map((btn, i) => {
            return (
              <div key={i} className="button-list-item" onClick={btn.onClick}>
                {btn.render ? (
                  btn.render()
                ) : (
                  <Row>
                    <Col>
                      <h5 className="m-0 p-0">{btn.label}</h5>
                      {btn.desc ? (
                        <p className="text-muted mb-0">{btn.desc}</p>
                      ) : null}
                    </Col>
                    <Col className="text-end">{getIcon(btn)}</Col>
                  </Row>
                )}
              </div>
            );
          })}
    </div>
  );
};

ButtonList.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      desc: PropTypes.string,
      hasContent: PropTypes.bool,
      onClick: PropTypes.func.isRequired,
      render: PropTypes.func,
      icon: PropTypes.node,
    })
  ).isRequired,
  emptyMsg: PropTypes.string,
  className: PropTypes.string,
  styles: PropTypes.object,
  hover: PropTypes.bool,
};

export default ButtonList;
