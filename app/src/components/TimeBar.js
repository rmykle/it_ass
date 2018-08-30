import React from "react";

export default ({ timeElapsed }) => {
  return <li style={{ top: timeElapsed }} className="timeBar" />;
};
