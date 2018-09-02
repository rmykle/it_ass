import React from "react";

export default ({ resetZone, name, currentDate }) => {
  return (
    <header>
      <div>
        <div className="back" onClick={() => resetZone()}>
          <i class="material-icons">keyboard_arrow_left</i>
          <h3>Tilbake</h3>
        </div>
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
