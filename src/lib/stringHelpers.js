import React from "reactn";

export const ucwords = (str) => {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
};

export const nl2br = (text) => {
  return text.split("\n").map((item, key) => {
    return (
      <React.Fragment key={key}>
        {item}
        <br />
      </React.Fragment>
    );
  });
};
