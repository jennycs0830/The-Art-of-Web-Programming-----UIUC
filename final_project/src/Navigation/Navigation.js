import React, { useState } from 'react';
import {useLoadScript } from '@react-google-maps/api';
//<<<<<<< wangzhe-handleConflict
import AdvSearch from '../AdvanceSearch/advsearch';
// <<<<<<< heh
// //=======
// =======
// // =======
// >>>>>>> main
// import AdvSearch from '../AdvanceSearch/advsearch.js';
//>>>>>>> main
import Map from '../Map/Map';

import Navbar from '../Navbar/Navbar';

const libraries = ['places'];
const Navigation = () => {
  const [result, setResult] = useState({});

  let callbackFunction = (childData) => {
    setResult(childData);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCG8MUFrbUkfNNxhg-gcs-DM5Rku9pSsHM',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div
    style={{


      
    }}
    
    >
        <Navbar />
        <div
        style = {{

          height:'fit-content',
        }}>
        <Map queryResult={result} ></Map>
        <AdvSearch parentCallback={callbackFunction} />

        </div>
    </div>
  );
};

export default Navigation;
