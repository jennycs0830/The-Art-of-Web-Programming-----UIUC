import React from 'react';
import { GoogleMap, useLoadScript,Marker, MarkerF,InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

import {Stop} from '../Bus/stop';
import Navbar from '../Navbar/Navbar';
//import { GoogleMap, useLoadScript, MarkerF, InfoWindow  } from '@react-google-maps/api';
//import { useState, useEffect } from 'react';

//import Navbar from '../Navbar/Navbar';
//import AdvSearch from '../AdvanceSearch/advsearch';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const BusStop = () => {
  const [long, setLong] = React.useState(0);
  const [lat, setLat] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [zoom, setZoom] = useState(16);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [navigation, setNavigation] = React.useState(false);
  const [center, setCenter] = useState({ lat: 0, lng:0 });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCG8MUFrbUkfNNxhg-gcs-DM5Rku9pSsHM',
    libraries,
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    //console.log(position.coords.longitude);
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
    setCenter({ lat: lat, lng:long });
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const handleOnClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    // console.log(`Clicked on: Lat ${clickedLat}, Lng ${clickedLng}`);
    // setCenter({ lat:clickedLat, lng:clickedLng });
    setSelectedLocation({ lat:clickedLat, lng:clickedLng });

  }

  const handleCloseInfoWindow = () => {
    setSelectedLocation(null);
  };

  return (
    <div>
      <Navbar />
      <div style={{ top: '80px', height: 'calc(100vh - 80px)', width: '100%' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
          onClick={handleOnClick}
          //onScroll={()=>{setZoom(16)}}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <MarkerF position={center} />
          
            {selectedLocation && (
            <InfoWindow
              position={selectedLocation}
              onCloseClick={handleCloseInfoWindow}
            >
              <div>
                {/* Your content for the info window goes here */}
                <h2>Pin</h2>
                <p>Latitude: {selectedLocation.lat}</p>
                <p>Longitude: {selectedLocation.lng}</p>
                <button
                onClick={()=>{
                    setNavigation(true);
                    
                }}
                
                
                
                >Navigate</button>
                      
                  
            

              </div>
            </InfoWindow>
          )}
          {/* <MarkerF position={center} /> */}
          {navigation && selectedLocation ?
                <>
                <Marker position={selectedLocation}
                icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    
                }}
                ></Marker>
                <Stop DATA={{lat:selectedLocation.lat,long:selectedLocation.lng}}/>
                </>:<Stop DATA={{lat:lat,long:long}}/>
            }
        </GoogleMap>
        
      </div>
      
     
      
    </div>
  );
};

export default BusStop;
