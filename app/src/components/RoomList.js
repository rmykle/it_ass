import React from "react";
import Room from "./Room";

export default ({ rooms, baseDate, currentDate }) => {
  return (
    <section>
      {rooms.filter(room => showRoom(room, currentDate)).map(room => {
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
const showRoom = (room, currentDate) => {
  if (
    room.events.filter(
      event =>
        event.dtstart.getTime() > currentDate.getTime() ||
        event.dtend.getTime() > currentDate.getTime()
    ).length > 0
  )
    return true;
  return false;
};
