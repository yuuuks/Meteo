import React,{ useState } from 'react';
import WeatherWidget from './WeatherWidget';
import Search from './Search';

const App = () => {

  const [location, setLocation] = useState({
    centre: {
      coordinates: [
        6.1513,
        49.1511
      ]
    },
    nom: 'Woippy'
  })

  const [longitude, latitude] = location.centre.coordinates

  return <main className="weather-container">
        <Search onSelect={setLocation} />
        <WeatherWidget
          cityName={location.nom}
          latitude={latitude}
          longitude={longitude}
        />
  </main>
}
export default App;
