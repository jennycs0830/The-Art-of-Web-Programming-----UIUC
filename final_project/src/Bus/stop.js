import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { Marker } from '@react-google-maps/api';
import { Bus } from './bus.js';

export function Stop({ DATA }) {
  const [stopData, setStopData] = useState([]);
  const [closestStop, setClosestStop] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function getStopData() {
      const URL = `https://developer.mtd.org/api/v2.2/json/getstopsbylatlon?key=ca74c75b34e64cc9bde55c9714918493&lat=${DATA.lat}&lon=${DATA.long}&count=5`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        const stops = data.stops;
        setStopData(stops);

        // Determine closest stop
        if (stops.length > 0) {
          const closest = calculateClosestStop(stops, DATA.lat, DATA.long);
          setClosestStop(closest);

          // Create markers for each bus stop
          const stopMarkers = stops.map(stop => ({
            position: { lat: stop.stop_points[0].stop_lat, lng: stop.stop_points[0].stop_lon },
            icon: {
              url: stop === closest ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
          }));
          setMarkers(stopMarkers);
        }
      } catch (error) {
        console.error('Error fetching stop data: ', error);
      }
    }

    getStopData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DATA.lat, DATA.long]);
  // Function to calculate closest stop based on coordinates
  const calculateClosestStop = (stops, lat, lon) => {
    let closest = stops[0];
    let minDistance = distance(stops[0].stop_points[0].stop_lat, stops[0].stop_points[0].stop_lon, lat, lon);

    for (let i = 1; i < stops.length; i++) {
      const stop = stops[i];
      const dist = distance(stop.stop_points[0].stop_lat, stop.stop_points[0].stop_lon, lat, lon);
      if (dist < minDistance) {
        minDistance = dist;
        closest = stop;
      }
    }

    return closest;
  };


  // Function to calculate distance between two points (latitude and longitude)
  const distance = (lat1, lon1, lat2, lon2) => {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515; // distance in miles

    return dist;
  };

  return (
    <Box>
      {closestStop && <Bus DATA={closestStop} />}
      <Box
        sx={{
          position: 'absolute',
          top: '500px',
          left: '20px',
          zIndex: '1',
        }}
      >
        {DATA && Array.isArray(stopData) && stopData.length > 0 ? (
        <Box
          sx={{
            height: 'auto',
            width: '265px',
            backgroundColor: '#ABABAB',
            borderRadius: '5px',
            opacity: '0.9',
            paddingBottom: '10px',
          }}
        >
          <Button
            sx={{
              position: 'relative',
              color: 'black',
              backgroundColor: '#D9D9D9',
              width: '265px',
              borderRadius: '5px',
              height: '30px',
            }}
          >
            <p
              style={{
                position: 'relative',
                right: '90px',
              }}
            >
              Stops
            </p>
          </Button>
          <Button></Button>

          <ul
            style={{
              listStyleType: 'none',
              display: 'grid',
              gap: '10px',
            }}
          >
            {/* console.log( stopData ); */}
            {stopData.map((stop, key) => (
              <li key={key}>{stop.stop_name}</li>
            ))}
          </ul>
        </Box>
        ):null}
      </Box>

      {/* Render markers for each bus stop */}
      {markers.map((marker, index) => (
        <Marker key={index} {...marker} />

      ))}
    </Box>
  );
}
