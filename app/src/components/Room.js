import React from "react";
import TimeBar from "./TimeBar";

export default ({ room, baseDate, currentDate }) => {
  const hours = [];
  for (let i = 0; i < 10; i++) {
    hours.push(<li key={i}>{`${i + 8}:00-${i + 9}:00`}</li>);
  }

  const eventElements = room.events.map((event, index) => {
    return (
      <li
        key={index}
        style={{
          top: timeToPixels(event.dtstart, baseDate),
          height: timeToPixels(event.dtend, event.dtstart)
        }}
        className="event"
        title={`${getTimeString(event.dtstart)} - ${getTimeString(
          event.dtend
        )} - ${event.summary}`}
      >
        <p>
          <span>{event["teaching-method-name"]}</span>
          <br />
          {`${getTimeString(event.dtstart)} - ${getTimeString(event.dtend)}`}
        </p>
      </li>
    );
  });

  return (
    <div>
      <h5>{room.name}</h5>
      <ul>
        {hours}
        {eventElements}
        <TimeBar timeElapsed={timeToPixels(currentDate, baseDate)} />
      </ul>
    </div>
  );
};

const timeToPixels = (d1, d2) => {
  const minutes = Math.floor((d1.getTime() - d2.getTime()) / 1000 / 60);
  const pixels = Math.floor((minutes / 60) * 28);
  return pixels;
};

const getTimeString = date => {
  return `${date.getHours()}:${
    date.getMinutes() === 0 ? "00" : date.getMinutes()
  }`;
};
