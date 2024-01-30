import { useState, useEffect, useCallback } from 'react';

const url = 'https://api.open-meteo.com/v1/forecast';

const useOpenMeteo = (latitude, longitude) => {
  const [data, setData] = useState(null);
  const [minTemperature, setMinTemperature] = useState(null);
  const [maxTemperature, setMaxTemperature] = useState(null);
  const [avg, setAvg] = useState(null); // Ajout de avg ici
  const [weatherCode, setWeatherCode] = useState(0);
  const [selectedTab, setSelectedTab] = useState('day');
  const [dateFormatted, setDateFormatted] = useState('');

  const fetchData = useCallback(() => {
    fetch(
      `${url}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/London`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, [latitude, longitude]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchData, latitude, longitude]);

  useEffect(() => {
    if (data) {
      setMinTemperature(data?.daily?.temperature_2m_min[0] || null);
      setMaxTemperature(data?.daily?.temperature_2m_max[0] || null);
      setWeatherCode(data?.daily?.weather_code || 0);

      // Calcul de avg ici
      const maxTemp = data?.daily?.temperature_2m_max[0] || 0;
      const minTemp = data?.daily?.temperature_2m_min[0] || 0;
      setAvg((maxTemp + minTemp) / 2);

      const currentDate = new Date();
      setDateFormatted(
        `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
      );
    }
  }, [data]);

  return {
    data,
    minTemperature,
    maxTemperature,
    avg, 
    weatherCode,
    selectedTab,
    setSelectedTab,
    dateFormatted,
    fetchData,
  };
};

export default useOpenMeteo;
