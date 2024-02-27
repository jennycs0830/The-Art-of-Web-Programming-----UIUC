import React from "react";
import  Box from "@mui/material/Box";
import { Button } from "@mui/material";



function Avatar({ data }) {
  return (
    
      <Box
      sx={{
        display:'table',
        marginLeft:'-120px',
        
      }}>
        {data.map((item) => (
        <Box key={item.id}>
          <Box
          sx={{
            
            
          
          }}>
          <h3
          style={{marginTop:-2}}>{item.name}</h3>
          <p style={{marginTop:-20}}>{item.email}</p>
          <p style={{marginTop:-18}}>{item.sirName}</p>
          </Box>
          <hr></hr>
        </Box>
      ))}
      
      </Box>
    
  );
}

export default function Results({ data }) {
  


  return (
    // <div style={{ position: 'relative', zIndex: 2 }}>
    <Box>
      {
        data.length>0?
        (<Box
          sx={
              {
                  position: 'relative',
                  top: '10px',
                  left: '0px',
                  zIndex: '2',
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
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      
                  }}
                  >
                    <Button
                      sx={{
                          position: 'relative',
                          color: 'black',
                          backgroundColor: '#D9D9D9',
                          borderRadius: '5px',
                          width: '265px',
                          height: '30px',
                          
                          
      
      
                          
                      }}
                      >
      
                          
                          <p
                          style={{
                              position: 'relative',
                              right: '80px',
                          }}
                          >Results</p>
                      </Button>
                      
                      <Avatar data={data} />
                      
                      
              
          
          </Box>
          </Box>):null
      }
    </Box>
    // </div>
  );
}