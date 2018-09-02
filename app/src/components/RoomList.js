import React from "react";
import Room from "./Room";

export default ({ rooms, baseDate, currentDate }) => {
  const filteredRooms = rooms.filter(room => showRoom(room, currentDate));
  if (filteredRooms.length === 0) {
    return (
      <section className="noRooms">
        <h1>Ingen gjenværende undervisning i dag</h1>
      </section>
    );
  }
  const fillers = [];
  const fillerCount = (filteredRooms.length + 1) % 5;
  for (let i = 0; i < fillerCount; i++) {
    fillers.push(<div key={i} className="filler" />);
  }

  return (
    <section className="rooms">
      {filteredRooms.map(room => {
        return (
          <Room
            key={room.id}
            room={room}
            baseDate={baseDate}
            currentDate={currentDate}
          />
        );
      })}
      {fillers}
    </section>
  );
};
const showRoom = (room, currentDate) => {
  return (
    room.events.filter(
      event =>
        event.dtstart.getTime() > currentDate.getTime() ||
        event.dtend.getTime() > currentDate.getTime()
    ).length > 0
  );
};
