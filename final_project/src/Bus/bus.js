import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

export function Bus({DATA}){
const [busData, setBusData] = React.useState([]);
React.useEffect(() => {
    async function getStopData() {
      const URL = `https://developer.mtd.org/api/v2.2/json/getdeparturesbystop?key=ca74c75b34e64cc9bde55c9714918493&stop_id=${DATA.stop_id}&count=8`;
      
      try {
        const response = await fetch(URL);
      const data = await response.json();
      const stops = data.departures.map(departure => departure.headsign);
      setBusData(stops);
      console.log(stops);
      } catch (error) {
        console.error('Error fetching stop data: ', error);
      }
    }

    getStopData();
  }, [DATA]);
return(
    <Box>
    
        <Box
    sx={
        {
            position: 'absolute',
            top: '150px',
            left: '20px',
        
        }
    }
    >
        
        <Box
            sx={{
                
                height: 'auto',
                width: '265px',
                backgroundColor: '#ABABAB',
                opacity: '0.9',
                borderRadius: '5px',
                paddingBottom: '10px',
                
            }}
            >
                <Button
                sx={{
                    position: 'relative',
                    color: 'black',
                    backgroundColor: '#D9D9D9',
                    width: '265px',
                    height: '30px',  
                }}
                >

                    
                    <p
                    style={{
                        position: 'relative',
                        right: '90px',
                    }}
                    >Bus</p>
                </Button>
                <Button>
                
                </Button>
                
        <ul
        style={{
            listStyleType: 'none',
            display: 'grid',
            gap: '10px',


        
        }}
        >
            {busData.map((bus, key)=>(
                <li>{bus}</li>
            ))}
        </ul>
    
    </Box>
    </Box>
    
    </Box>
)


}