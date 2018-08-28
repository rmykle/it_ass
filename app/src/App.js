import React, { Component } from "react";
import "./App.css";
import ZoneSelector from "./components/ZoneSelector";
import Header from "./components/Header";
import axios from "axios";

const dev = true;
const settingsPath = dev ? "http://localhost:8081/settings.json" : "";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { zoneSelected: undefined, data: undefined };
  }

  componentDidMount() {
    axios.get(settingsPath).then(({ data }) => {
      this.setState({ data: data });
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
          name={this.state.data.zones[this.state.zoneSelected].name}
          resetZone={() => this.setState({ zoneSelected: undefined })}
        />
      </main>
    );
  }
}

export default App;
