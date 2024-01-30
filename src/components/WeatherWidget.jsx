import React, { useState, useEffect, useCallback } from 'react';
import TemperatureDisplay from '../components/TemperatureDisplay';
import WeatherCode from '../components/WeatherCode';
import ForecastItem from '../components/ForecastItem';
import PropTypes from 'prop-types';

const url = 'https://api.open-meteo.com/v1/forecast';

const WeatherWidget = ({ latitude, longitude, cityName }) => {
  const [state, setState] = useState({ data: null });
  const [selectedTab, setSelectedTab] = useState('day');

  // Les températures
  const minTemperature = state.data?.daily?.temperature_2m_min[0] || null;
  const maxTemperature = state.data?.daily?.temperature_2m_max[0] || null;
  const avg = (maxTemperature + minTemperature) / 2;

  // Le code météo
  const weatherCode = state.data?.daily?.weather_code || 0;

  // La date
  const currentDate = new Date();
  const dateFormatted = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  const getData = useCallback(() => {
    fetch(`${url}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
      .then((res) => res.json())
      .then((data) => {
        setState({
          data,
        });
      })
      .catch((error) => {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      });
  }, [longitude, latitude]);

  useEffect(() => {
    getData(); 
    const timer = setInterval(getData, 60000); 

    return () => {
      clearInterval(timer);
    };
  }, [getData, latitude, longitude]);

  console.log(weatherCode);

  return (
    <main className="weather-container">
      <div className="weather-container-content">
        <header className="weather-container-header">
          <p className="location">{cityName}</p>
          <button className="refresh-button" onClick={getData}>
            <img src="https://lpmiaw-react.napkid.dev/img/weather/refresh.png" alt="Refresh" />
          </button>
        </header>
        <p className="date">{dateFormatted}</p>
        <article className="today">
          <WeatherCode code={weatherCode} />
          <div className="temperature-display">
            <TemperatureDisplay avg={avg} min={minTemperature} max={maxTemperature} />
          </div>
        </article>
        <section className="">
          <nav className="tabs">
            <button className={`tab ${selectedTab === 'day' ? 'tab--active' : ''}`} onClick={() => setSelectedTab('day')}>
              Journée
            </button>
            <button className={`tab ${selectedTab === 'week' ? 'tab--active' : ''}`} onClick={() => setSelectedTab('week')}>
              Semaine
            </button>
          </nav>
          <ul className="forecast">
            {Array(5)
              .fill(null)
              .map((i, idx) => (
                <ForecastItem key={idx} label="10h" code={55} temperature={21} />
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
