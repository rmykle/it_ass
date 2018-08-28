import React from "react";

export default ({ room }) => {
  //console.log(room);
  const hours = [];
  for (let i = 0; i < 10 * 4; i++) {
    hours.push(<li />);
  }
  return (
    <div>
      <h5>{room.name}</h5>
      <ul> {hours}</ul>
    </div>
  );
};
