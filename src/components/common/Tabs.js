import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

import "./css/Tabs.css";

const Tabs = ({ tabs, enableLocation = true, justifyLinks = false }) => {
  const [active, setActive] = useState(0);
  const [tabList, setTabList] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const newTabs = tabs.map((t) => {
      return { ...t, key: t.label.replace(/\s+/g, "-").toLowerCase() };
    });

    setTabList(newTabs);

    if (!location.hash || location.hash === "") {
      setActive(newTabs[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  useEffect(() => {
    if (location.hash && location.hash !== "" && enableLocation) {
      setActive(location.hash.replace(/^#/, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, enableLocation]);

  return (
    <div className="tabs-container">
      <div className={`tabs-links${justifyLinks ? " justify-links" : ""}`}>
        {tabList.map((tab, tabIndex) => {
          if (!enableLocation) {
            return (
              <Button
                key={tabIndex}
                variant="link"
                className={tab.key === active ? "active p-0" : "p-0"}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </Button>
            );
          }

          return (
            <Link
              key={tabIndex}
              to={`#${tab.key}`}
              className={tab.key === active ? "active" : ""}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      {tabList.map((tab, tabIndex) => {
        if (tab.key !== active) {
          return null;
        }
        return (
          <div key={tabIndex} className="tab-content">
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  enableLocation: PropTypes.bool,
  justifyLinks: PropTypes.bool,
};

export default Tabs;
