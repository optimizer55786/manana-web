import React from "reactn";

const ContentBlock = ({ children, className, style }) => {
  return (
    <div className={`content-block ${className || ""}`} style={style || {}}>
      {children}
    </div>
  );
};

export default ContentBlock;
