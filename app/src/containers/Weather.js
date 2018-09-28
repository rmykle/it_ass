import React, { Component } from "react";
import axios from "axios";

export default class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
      //data: undefined,
      data: undefined,
      isFocused: false
    };
  }

  render() {
    const isFocusedOnComplete = this.state.isComplete && this.state.isFocused;
    return (
      <div className="weather">
        <h5>Regner det?</h5>
        <div
          className={`status ${
            isFocusedOnComplete ? "isFocusedOnComplete" : "noWeatherData"
          }`}
          onClick={() => this.fetchWeatherData()}
          onMouseEnter={() => this.setState({ isFocused: true })}
          onMouseLeave={() => this.setState({ isFocused: false })}
        >
          {this.state.isComplete && !isFocusedOnComplete
            ? this.rainStatus()
            : "Last inn"}
        </div>

        <p>
          Kilde:
          <a
            href="https://www.bergensveret.no"
            target="_blank"
            rel="noopener noreferrer"
          >
            bergensveret.no
            <br />
          </a>
        </p>
      </div>
    );
  }

  fetchWeatherData() {
    const apiUrl = this.props.rootApi + "rain";
    axios
      .get(apiUrl)
      .then(({ data }) => {
        this.setState({ data: data, isComplete: true });
      })
      .catch(error => {
        console.log(error);
      });
  }

  rainStatus() {
    const { mm } = this.state.data;
    const rainValue = Math.ceil(mm * 20);
    return (
      <div className="hasWeatherData">
        {rainValue === 0 ? (
          "Nei"
        ) : (
          <div>
            <h4>Ja</h4>
            <h5>{mm} mm</h5>
          </div>
        )}
        <div className="rainBg" style={{ height: rainValue + "%" }} />
      </div>
    );
  }
}
