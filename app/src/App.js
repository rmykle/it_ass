import React, { Component } from "react";
import "./App.css";
import ZoneSelector from "./components/ZoneSelector";
import Header from "./components/Header";
import axios from "axios";
import RoomList from "./components/RoomList";

const dev = true;
const settingsPath = dev ? "http://localhost:8081/schedule.json" : "";

class App extends Component {
  constructor(props) {
    super(props);
    const baseDate = new Date();
    baseDate.setHours(8);
    baseDate.setMinutes(0);
    this.state = {
      zoneSelected: undefined,
      data: undefined,
      baseDate: baseDate,
      currentDate: new Date()
    };
  }

  componentDidMount() {
    axios.get(settingsPath).then(({ data }) => {
      const { zones } = data;
      for (let zoneKey in zones) {
        const zone = zones[zoneKey];
        for (let roomKey in zone.rooms) {
          const room = zone.rooms[roomKey];
          const formattedEvents = room.events.map(event => {
            return Object.assign(event, {
              dtstart: new Date(
                event.dtstart.substring(0, event.dtstart.length - 3)
              ),
              dtend: new Date(event.dtend.substring(0, event.dtend.length - 3))
            });
          });
          room.events = formattedEvents;
        }
      }
      this.setState({ data: data });
    });
    this.clockInterval = setInterval(() => {
      this.setState({ currentDate: new Date() });
    });
  }

  render() {
    const { data, zoneSelected } = this.state;
    if (!data) return <div>Loading</div>;
    if (!zoneSelected)
      return (
        <ZoneSelector
          zones={Object.keys(data.zones).reduce((newObj, key) => {
            newObj[data.zones[key].name] = key;
            return newObj;
          }, {})}
          onZoneSelect={id => {
            this.setState({ zoneSelected: id });
          }}
        />
      );

    return (
      <main>
        <Header
          currentDate={this.state.currentDate}
          name={this.state.data.zones[this.state.zoneSelected].name}
          resetZone={() => this.setState({ zoneSelected: undefined })}
        />
        <RoomList
          rooms={data.zones[zoneSelected].rooms}
          baseDate={this.state.baseDate}
          currentDate={this.state.currentDate}
        />
      </main>
    );
  }
}

export default App;
