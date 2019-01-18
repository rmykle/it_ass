import React, { Component } from "react";
import "./scss/index.scss";
import ZoneSelector from "./components/ZoneSelector";
import Header from "./components/Header";
import axios from "axios";
import RoomList from "./components/RoomList";
import Disputas from "./components/Disputas";
import Loading from "./components/Loading";

const apiUrl = "https://it.myklevoll.com/api/";
const schedulePath = apiUrl + "schedule/";
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
      currentDate: new Date(),
      disputas: [],
      error: ""
    };
  }

  componentDidMount() {
    this.fetchSchedule();
    this.fetchDisputas();
    this.clockInterval = setInterval(() => {
      this.setState({ currentDate: new Date() });
    }, 60 * 1000);
  }

  render() {
    if (this.state.error) return <h1 className="error">{this.state.error}</h1>;
    const { data, zoneSelected } = this.state;
    if (!data) return <Loading />;
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
        <div className="topRow">
          <Disputas events={this.state.disputas} />
        </div>

        <RoomList
          rooms={data.zones[zoneSelected].rooms}
          baseDate={this.state.baseDate}
          currentDate={this.state.currentDate}
        />
      </main>
    );
  }
  fetchSchedule() {
    axios
      .get(schedulePath)
      .then(({ data }) => {
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
                dtend: new Date(
                  event.dtend.substring(0, event.dtend.length - 3)
                )
              });
            });
            room.events = formattedEvents;
          }
        }
        this.setState({ data: data });
      })
      .catch(error =>
        this.setState({
          error: "Ugler i mosen a gitt - Klarte ikke hente data"
        })
      );
  }

  fetchDisputas() {
    axios
      .get(apiUrl + "disputas/")
      .then(({ data }) => {
        this.setState({ disputas: data });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default App;
