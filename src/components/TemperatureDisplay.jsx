import React, { Component } from 'react';

class TemperatureDisplay extends Component {
  render() {
    const { avg, min, max } = this.props;

    return (
      <div className="temperature-display">
        <p className="temperature-display-avg">{Math.floor(avg)}</p>
        <div className="temperature-display-row">
          <p>{max !== null ? Math.floor(max) : 0}</p>
          <p className="temperature-display-row-item--min">{min !== null ? Math.floor(min) : 0}</p>
        </div>
      </div>
    );
  }
}

export default TemperatureDisplay;
