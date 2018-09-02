import React from "react";

export default ({ events }) => {
  if (events.length === 0) return null;
  let id = 0;
  return (
    <section className="disputas">
      <h3>Disputaser i dag</h3>
      <ul>
        {events.map(event => {
          const start = new Date(event.dtstart);
          const end = new Date(event.dtend);

          return (
            <li key={"disp" + id++}>
              <span>{event.summary}</span>
              <br />

              {start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }) +
                " - " +
                end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              {event.location ? <i>{event.location}</i> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
