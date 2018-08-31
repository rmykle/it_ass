import React from "react";

export default ({ events }) => {
  return (
    <section className="disputas">
      <h3>Disputaser</h3>
      <ul>
        {events.map(event => {
          return <li>asd</li>;
        })}
      </ul>
    </section>
  );
};
