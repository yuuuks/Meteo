import React from "react";
import TemperatureDisplay from "../components/TemperatureDisplay";
import WeatherCode from "../components/WeatherCode";
import ForecastItem from "../components/ForecastItem";
import PropTypes from "prop-types";
import useOpenMeteo from '../hooks/useOpenMeteo'; // Import du hook

const WeatherWidget = ({ latitude, longitude, cityName }) => {
  const {
    data,
    minTemperature,
    avg,
    maxTemperature,
    weatherCode,
    selectedTab,
    setSelectedTab,
    dateFormatted,
    fetchData, // Ajout de la fonction fetchData
  } = useOpenMeteo(latitude, longitude);

  return (
    <main className="weather-container">
      <div className="weather-container-content">
        <header className="weather-container-header">
          <p className="location">{cityName}</p>
          <button className="refresh-button" onClick={fetchData}>
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
                    code={data?.hourly.weathercode[6 + idx * 4] || 0}
                    temperature={data?.hourly.temperature_2m[6 + idx * 4] || 0}
                  />
                ))}

            {selectedTab === "week" &&
              data?.daily?.time.slice(1, 6).map((date, idx) => (
                <ForecastItem
                  key={idx}
                  label={new Date(date)
                    .toLocaleDateString()
                    .slice(0, -5)}
                  code={data?.daily.weathercode[idx + 1] || 0}
                  temperature={(
                    (data?.daily.temperature_2m_max[idx + 1] +
                      data?.daily.temperature_2m_min[idx + 1]) /
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
