import React, { useState, useCallback, useEffect } from 'react';

const baseUrl = 'https://geo.api.gouv.fr';

const Search = (props) => {
  const { onSelect } = props;

  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);

  const getData = useCallback(() => {
    fetch(`${baseUrl}/communes?nom=${inputValue}&fields=centre,departement&boost=population&limit=5`)
      .then(res => res.json())
      .then(data => setList(data));
  }, [inputValue]);

  useEffect(() => {
    if (inputValue.length >= 2) {
      getData();
    } else {
      setList([]);
    }
  }, [getData, inputValue]);

  const handleSelect = (item) => {
    onSelect(item);
    setList([]);
    setInputValue('');
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-group">
        <input
          type="text"
          className="searchbar-input"
          placeholder="Rechercher..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="searchbar-button" onClick={getData}>
          <svg
            className="searchbar-button-logo"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
        </button>
      </div>
      {!!list.length && (
        <div className="searchbar-options">
          <ul>
            {list.map((searchItem) => (
              <li key={searchItem.code}>
                <button onClick={() => handleSelect(searchItem)}>
                  {searchItem.nom} ({searchItem.departement.code})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
