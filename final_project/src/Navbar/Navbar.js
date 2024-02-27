import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import TodayIcon from '@mui/icons-material/Today';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import {app} from './../Firebase/firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton  } from '@mui/base/MenuButton';
import { MenuItem  } from '@mui/base/MenuItem';
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../User/User.js';
import { backendURL } from '../Backend/Backend.js';
const auth = getAuth(app);
// const user = auth.currentUser;
export default function Navbar(){
    const { handleSetEvents } = useUser();
    const [img,setImg] = React.useState('');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [UserLogin, setUserLogin] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
      setMenuOpen( !menuOpen );
    }
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currUser) => {
            if (currUser) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              setImg(currUser.photoURL);
              loadEvents(currUser.uid);
              setUserLogin(true);
              // console.log(currUser.photoURL);
              // ...
            } else {
              // User is signed out
              // ...
              setImg('');
              handleSetEvents('', []);
              setUserLogin(false);
            }
          });
        return unsubscribe;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      const loadEvents = (userId) => {
        // Load events from session storage
        const storedData = sessionStorage.getItem(userId) || '[]';
        const events = JSON.parse(storedData);
        // If there are no events in session storage, fetch from backend
        if (events.length === 0) {
          fetchEventsFromBackend(userId);
        } else {
          const eventsWithDate = events.map((event) => {
            return {
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            };
          });
          handleSetEvents(userId, eventsWithDate);
        }
      };
      const fetchEventsFromBackend = (userId) => {
        fetch(`${backendURL}/events/${userId}`, {
          method: 'GET'
        })
          .then(response => {
            if (!response.ok) {
              // User not found in the database
              if (response.status === 404) {
                console.log('User not found in the database');
                return {events: []};
              } else {
                // Handle other non-success status codes
                console.error(`Error fetching events: ${response.status}`);
              }
            }
            return response.json();
          })
          .then(data => {
            sessionStorage.setItem(userId, JSON.stringify(data.events));
            const events = data.events.map((event) => {
              return {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
              };
            });
            handleSetEvents(userId, events);
          })
          .catch(error => {
            // Handle fetch errors or non-success status codes
            console.error('Fetch error:', error);
          });
      };
      function Logout(){
        auth.signOut().then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
        navigate('/');
      }
      function Login(){
        navigate('/login');
      }
      function handleHome(){
        navigate('/');
      }
    return (
      <div>
        <AppBar position="static" sx={{bgcolor:"#13294B", height:"80px"}}>
            <Toolbar disableGutters sx={{minHeight:"80px", alignItems: 'center', justifyContent: 'space-between'}}>
                <IconButton aria-label="Icon" size="largae" sx={{ color:"#E84A27", fontSize:"40px" }}> 
                    <DirectionsBusIcon sx={{fontSize:"inherit"}}/> 
                </IconButton>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize:"40px",
                        letterSpacing: '.1rem',
                        color: '#E84A27',
                        textDecoration: 'none',
                        lineHeight: "80px"
                    }}
                    onClick={handleHome}
                >
                    UIUC BusNav
                </Typography>

                <Box sx={{flexGrow:1}}/>
                <IconButton aria-label="search" size="medium" sx={{ color:"#E84A27", fontSize:"35px", mr:"10px" }}
                onClick = {() => {if(location.pathname !== '/navigation') navigate('/navigation')}}
                > 
                    <SearchIcon sx={{fontSize:"inherit"}}/> 
                </IconButton>
                <IconButton aria-label="bus stop" size="medium" sx={{ color:"#E84A27", fontSize:"35px", mr:"10px" }}
                onClick = {() => {if(location.pathname !== '/busStop') navigate('/busStop')}}
                > 
                    <PlaceIcon sx={{fontSize:"inherit"}}/> 
                </IconButton>
                <IconButton aria-label="calendar" size="medium" sx={{ color:"#E84A27", fontSize:"35px", mr:"10px" }}
                onClick = {() => {if(location.pathname !== '/calendar') navigate('/calendar')}}
                > 
                    <TodayIcon sx={{fontSize:"inherit"}}/> 
                </IconButton>
                    
                <Dropdown>
                <MenuButton
                  style={{
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                  }}
                  onClick={toggleMenu}
                > 
                    {
                        img ?
                        <img src={img} alt="profile" width="50px" height="50px" style={{borderRadius:"50%",}}/>
                        : 
                        (<AccountCircleIcon style={{
                        width: "35px",
                        height: "35px",
                        color: "#E84A27"
                        }}/>)
                    } 
                </MenuButton>
                
                {menuOpen && (
                  <Menu slots={{ listbox: 'ol' }}
                    style={{
                        backgroundColor: "white",
                        width: '150px',
                        height: 'auto',
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        zIndex:'2'
                    }
                  }
                  >
                    {/* <MenuItem onClick={createHandleMenuClick('Profile')}>Profile</MenuItem>
                    <MenuItem onClick={createHandleMenuClick('Language settings')}>
                      Language
                    </MenuItem> */}
                    <MenuItem onClick={UserLogin? Logout: Login}>
                      {UserLogin? 'Logout': 'Login'}
                    </MenuItem>
                  </Menu>
                )}
                </Dropdown>    
                    

                
            </Toolbar>
            
        </AppBar>
      </div>
    );
}