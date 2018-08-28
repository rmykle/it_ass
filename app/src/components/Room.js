import React from "react";

export default ({ room }) => {
  const baseDate = new Date();
  baseDate.setHours(8);
  baseDate.setMinutes(0);

  const hours = [];
  for (let i = 0; i < 10; i++) {
    hours.push(<li key={i} />);
  }

  const events = room.events.map(event => {
    return Object.assign(event, {
      dtstart: new Date(event.dtstart.substring(0, event.dtstart.length - 3)),
      dtend: new Date(event.dtend.substring(0, event.dtend.length - 3))
    });
  });

  const eventElements = events.map((event, index) => {
    return (
      <li
        key={index}
        style={{
          top: timeToPixels(event.dtstart, baseDate),
          height: timeToPixels(event.dtstart, event.dtend)
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
      </ul>
    </div>
  );
};

const timeToPixels = (d1, d2) => {
  const minutes = Math.abs(
    Math.floor((d2.getTime() - d1.getTime()) / 1000 / 60)
  );
  const pixels = Math.floor((minutes / 60) * 28);
  return pixels;
};

const getTimeString = date => {
  console.log(date.getHours());
  return `${date.getHours()}:${
    date.getMinutes() == 0 ? "00" : date.getMinutes()
  }`;
};
