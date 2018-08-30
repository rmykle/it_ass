import React from "react";

export default ({ resetZone, name, currentDate }) => {
  return (
    <header>
      <div>
        <h3 onClick={() => resetZone()}>&lt; Tilbake</h3>
        <h1>{name}</h1>
        <h5>
          {currentDate.toLocaleTimeString([], {
            weekday: "long",
            day: "numeric",
            month: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </h5>
      </div>
      <div className="line" />
    </header>
  );
};
