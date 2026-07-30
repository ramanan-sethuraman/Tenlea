import React from 'react';
import { GoogleParkingLocator } from './GoogleParkingLocator';

export const IndiaMap = ({ onCitySelect, selectedCity = 'Chennai' }) => {
  return (
    <div className="w-full">
      <GoogleParkingLocator apiKey="" mapId="DEMO_MAP_ID" initialSelectedCity={selectedCity} />
    </div>
  );
};
