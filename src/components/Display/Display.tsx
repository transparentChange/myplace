import { GoogleMap, MarkerF, useLoadScript, Autocomplete } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react';
import { useMemo } from "react";

export function Display({ places }: any) {


  return (
    <div id='map-view' className='display'>
      {
        /*
            <GoogleMap
              mapContainerClassName="map-container"
              center={center}
              zoom={10}
            >
              <MarkerF position={places[0].geometry.location} />
            </GoogleMap>
            */
      }
    </div>
  );
}