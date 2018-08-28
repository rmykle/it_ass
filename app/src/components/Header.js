import React from "react";

export default ({ resetZone, name }) => {
  return (
    <header onClick={() => resetZone()}>
      <h1>{name}</h1>
      <div />
    </header>
  );
};
