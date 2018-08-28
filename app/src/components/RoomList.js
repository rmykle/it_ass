import React from "react";
import Room from "./Room";

export default ({ rooms }) => {
  return (
    <section>
      {rooms.map(room => {
        return <Room key={room.id} room={room} />;
      })}
    </section>
  );
};
