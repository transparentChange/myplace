import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Button } from '@mui/material'
import { GoogleMap, MarkerF, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect, useState, useMemo } from "react";
//import { getPlacesList } from './providers/PlacesClient';
import { Display } from './components/Display/Display';
import { PlacesSidebar } from './components/PlacesSidebar/PlacesSidebar';
import { Mock } from './MockData';
import { Visit } from './components/Visit/Visit';


function App() {
  const center = useMemo(() => ({ lat: 43.463070, lng: -80.528880 }), []);
  const [places, setPlaces] = useState<Map<string, any>>();
  const [VisitOpened, setVisitOpened] = useState<Map<string, boolean>>(new Map());
  const markers = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  let map: any, infoWindow: any;
  let selectedPlaceId: string;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
    libraries: ["places"]
  });
  let markerLibrary: google.maps.MarkerLibrary;
  const loc = { lat: 43.463070, lng: -80.528880 };

  const initMap = async () => {
    const { Map, InfoWindow } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    markerLibrary = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    map = new Map(document.getElementById("map-view") as HTMLElement, {
      center,
      zoom: 13,
      mapId: "DEMO_MAP_ID",
    });
    infoWindow = new InfoWindow();
    createMarkers();
  }

  const createMarkers = () => {
    places!.forEach((place: any, id: string) => {
      console.log("herea");
      markers.current.set(id, createMarker(place.place_id, place.geometry.location));
    });
  }

  const createMarker = (placeId:string, position: any): google.maps.marker.AdvancedMarkerElement => {
    const pinGlyph = new markerLibrary.PinElement({
      glyphColor: 'white',
      scale: 0.75
    });
    const marker = new markerLibrary.AdvancedMarkerElement({
      map,
      position,
      content: pinGlyph.element
    });
    marker.addListener('click', () => handleClick(placeId));
    return marker;
  }

  const handleClick = (placeId: string) => {
    console.log(markers.current);
    if (markers.current) {
      if (selectedPlaceId) {
        const selectedMarker = markers.current.get(selectedPlaceId);
        selectedMarker!.map = null;
        const notSelected = createMarker(places!.get(selectedPlaceId), selectedMarker!.position);
        markers.current.set(selectedPlaceId, notSelected);
      }

      const marker = markers.current.get(placeId);
      marker!.map = null;
      const newMarker = new markerLibrary.AdvancedMarkerElement({
        map,
        position: marker!.position
      });
      const newPlace = places!.get(placeId);

      const container = document.createElement('div');
      const root = ReactDOM.createRoot(container);
      root.render(<div>
        <div><img src={`data:image/png;base64,${newPlace.encoded_streetview}`}></img></div>
        <div><Button onClick={() => handleVisitOpen(placeId)} variant="contained">Add Visit</Button></div>
      </div>);
      infoWindow.close();
      infoWindow.setContent(container);
      infoWindow.open(map, newMarker);
      markers.current.set(placeId, newMarker);
      selectedPlaceId = placeId;
    }
  }

  const handleVisitOpen = (placeId: string) => {
    const newOpened = new Map(VisitOpened);
    newOpened.set(placeId, true);
    setVisitOpened(newOpened);
  }

  const handleVisitClose = (placeId: string) => {
    const newOpened = new Map(VisitOpened);
    newOpened.set(placeId, false);
    setVisitOpened(newOpened);
  }

  useEffect(() => {
    if (isLoaded) {
      //getPlacesList().then(placesResponse => {
      const x = Mock;
      const placesMap = x.body.reduce((acc: any, place: any) => {
        acc.set(place.place_id, place);
        return acc;
      }, new Map());
      const newOpened = new Map(VisitOpened);
      placesMap.forEach((place:any) => {
        newOpened.set(place.place_id, false);
      });
      setVisitOpened(newOpened);
      setPlaces(placesMap);
      console.log("body");
      console.log(x.body);
      // });
      
    }
  }, [isLoaded]);

  useEffect(() => {
    if (places) {
      initMap();
    }
  }, [places])

  return (
    <div className="App">
      {(!isLoaded || places == undefined) ? (
        <h1>Loading...</h1>
      ) : (
        <div className="NewPage">
          <PlacesSidebar places={places} handleClick={handleClick}></PlacesSidebar>
          <Display places={places}></Display>
          {Array.from(VisitOpened, ([placeId, opened]) => <Visit onClose={() => handleVisitClose(placeId)} open={opened}></Visit>) }
        </div>
      )}
    </div>
  );
}

export default App;
