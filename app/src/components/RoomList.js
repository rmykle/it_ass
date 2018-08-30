import React from "react";
import Room from "./Room";

export default ({ rooms, baseDate, currentDate }) => {
  return (
    <section>
      {rooms.map(room => {
        return (
          <Room
            key={room.id}
            room={room}
            baseDate={baseDate}
            currentDate={currentDate}
          />
        );
      })}
    </section>
  );
};
