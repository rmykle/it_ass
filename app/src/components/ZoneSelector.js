import React from "react";

export default ({ zones, onZoneSelect }) => {
  return (
    <ul className="selector">
      {Object.keys(zones).map(key => {
        return (
          <li
            key={key}
            href="#"
            onClick={() => {
              onZoneSelect(zones[key]);
            }}
          >
            {key}
          </li>
        );
      })}
    </ul>
  );
};
