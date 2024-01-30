import React, { useState, useEffect, useCallback } from "react";
import TemperatureDisplay from "../components/TemperatureDisplay";
import WeatherCode from "../components/WeatherCode";
import ForecastItem from "../components/ForecastItem";
import PropTypes from "prop-types";

const url = "https://api.open-meteo.com/v1/forecast";

const WeatherWidget = ({ latitude, longitude, cityName }) => {
  const [state, setState] = useState({ data: null });
  const [selectedTab, setSelectedTab] = useState("day");

  const getData = useCallback(() => {
    fetch(
      `${url}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/London`
    )
      .then((res) => res.json())
      .then((data) => {
        setState({
          data,
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, [longitude, latitude]);

  useEffect(() => {
    getData();
    const timer = setInterval(getData, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [getData, latitude, longitude]);

  const minTemperature = state.data?.daily?.temperature_2m_min[0] || null;
  const maxTemperature = state.data?.daily?.temperature_2m_max[0] || null;
  const avg = (maxTemperature + minTemperature) / 2;


  const weatherCode = state.data?.daily?.weather_code || 0;

  const currentDate = new Date();
  const dateFormatted = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  return (
    <main className="weather-container">
      <div className="weather-container-content">
        <header className="weather-container-header">
          <p className="location">{cityName}</p>
          <button className="refresh-button" onClick={getData}>
            <img
              src="https://lpmiaw-react.napkid.dev/img/weather/refresh.png"
              alt="Refresh"
            />
          </button>
        </header>
        <p className="date">{dateFormatted}</p>
        <article className="today">
          <WeatherCode code={weatherCode} />
          <div className="temperature-display">
            <TemperatureDisplay
              avg={avg}
              min={minTemperature}
              max={maxTemperature}
            />
          </div>
        </article>
        <section className="">
          <nav className="tabs">
            <button
              className={`tab ${selectedTab === "day" ? "tab--active" : ""}`}
              onClick={() => setSelectedTab("day")}
            >
              Journée
            </button>
            <button
              className={`tab ${selectedTab === "week" ? "tab--active" : ""}`}
              onClick={() => setSelectedTab("week")}
            >
              Semaine
            </button>
          </nav>
          <ul className="forecast">
            {selectedTab === "day" &&
              Array(5)
                .fill(null)
                .map((_, idx) => (
                  <ForecastItem
                    key={idx}
                    label={`${6 + idx * 4}h`}
                    code={state.data?.hourly.weathercode[6 + idx * 4] || 0}
                    temperature={
                      state.data?.hourly.temperature_2m[6 + idx * 4] || 0
                    }
                  />
                ))}

            {selectedTab === "week" &&
              state.data?.daily?.time.slice(1, 6).map((date, idx) => (
                <ForecastItem
                  key={idx}
                  label={new Date(date)
                    .toLocaleDateString()
                    .slice(0, -5)}
                  code={state.data?.daily.weathercode[idx + 1] || 0}
                  temperature={(
                    (state.data?.daily.temperature_2m_max[idx + 1] +
                      state.data?.daily.temperature_2m_min[idx + 1]) /
                    2
                  ).toFixed(1)}
                />
              ))}
          </ul>
        </section>
        <footer className="weather-container-footer">
          <p>Mise à jour : {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </main>
  );
};

WeatherWidget.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  cityName: PropTypes.string,
};

export default WeatherWidget;
