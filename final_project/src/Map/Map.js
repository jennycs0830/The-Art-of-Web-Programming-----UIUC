import React from 'react';
import { GoogleMap, MarkerF,DirectionsRenderer,InfoWindow, Polyline } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export var DESTINATION = '';

const Map = (props) => {
  
  let data = props.queryResult;

  console.log(data);

  // const [long, setLong] = React.useState(0);
  // const [lat, setLat] = React.useState(0);
  
  // const [navigate, setNavigate] = React.useState(false);
  const [routeCoord, setRouteCoord] = React.useState([]);
  const [currentLocation, setCurrentLocation] = React.useState({
    lat: 0,
    lng: 0,
  });
  const walkRoute = data.walk;

  // console.log(data);
  // console.log(walkRoute);
  // console.log(busRoute);
  // console.log(vehicle);

  // console.log(typeof busRoute);

  const updateRouteCoordinates = (routeCoord) => {
    

    //console.log('newBusRoute');
    if (routeCoord !== undefined) {
      let updatedRouteCoord = [];
      for (let i = 0; i < routeCoord.length; ++i) {
        
        const singleRoute = routeCoord[i];
        const pathCoordinates = singleRoute.map(point => ({
          lat: point.shape_pt_lat,
          lng: point.shape_pt_lon
        }),where => ({}));
        updatedRouteCoord = updatedRouteCoord.concat(pathCoordinates);
        //console.log("HERE"+updatedRouteCoord);
      }
      setRouteCoord(updatedRouteCoord); // Update route coordinates state
    } else {
      setRouteCoord([]); // Clear route coordinates if new data is undefined
    }
  };
  useEffect(() => {

    updateRouteCoordinates(props.queryResult.bus);
  }, [props.queryResult.bus]);



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);


      
  // const [center, setCenter] = useState({ lat:  currentLocation.lat, lng: currentLocation.lng });

  // eslint-disable-next-line no-unused-vars
  const [zoom, setZoom] = useState(16);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [dest, setDest] = useState(null);

  const handleOnClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    setSelectedLocation({ lat:clickedLat, lng:clickedLng });

  }

  const handleCloseInfoWindow = () => {
    setSelectedLocation(null);
  };

  const handleNavigate =() => {
    setDest(selectedLocation);
    DESTINATION = selectedLocation
  }
 
//  function handleChange() {
//   console.log("handle change");
//   setRouteCoord([]);

//   };
  React.componentDidMount=() =>{ 
  
    // Changing the state after 2 sec 
    // from the time when the component 
    // is rendered 
    setTimeout(() => { 
      console.log("handle change");
    }, 2000); 
  } 
  return (
    // <div style={{ height: '89vh', width: '100%', position: 'relative', zIndex: 1 }}>
    <div style={{ top: '80px', height: 'calc(100vh - 80px)', width: '100%' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={currentLocation}
          onClick={handleOnClick}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {routeCoord.length > 0 &&(
        <Polyline
        path={routeCoord}
        
        setVisible={false}
          options={{
            strokeColor: "#4285F4", // Google Maps default route color
            strokeOpacity: 1.0,
            strokeWeight: 4,
          }}
          
        />
      )}
        
          <MarkerF position={currentLocation} />
          {/* <MarkerF position={center} /> */}
          {walkRoute && (
            <DirectionsRenderer directions={walkRoute[0]} />
          )}
          
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
                  style={{zIndex:10}}
                  onClick={handleNavigate}>Navigate</button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      
    </div>
  );
};

export default Map;



