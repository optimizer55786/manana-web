import React from "reactn";
import { useLocation } from "react-router-dom";

import PrimaryLayout from "./PrimaryLayout";

const CMS = () => {
  const { pathname } = useLocation();

  return (
    <PrimaryLayout>
      <div style={{ background: "#fff", margin: 0, padding: "2rem" }}>
        <h1>CMS Page: {pathname}</h1>
      </div>
    </PrimaryLayout>
  );
};

export default CMS;
