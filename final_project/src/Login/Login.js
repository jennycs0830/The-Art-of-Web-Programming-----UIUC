import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Input, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Google } from '@mui/icons-material';
import {app} from './../Firebase/firebase.js';
import { getAuth} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import {GoogleAuthProvider,signInWithRedirect} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
const provider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const user = auth.currentUser;
export default function Login(){
  const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    function Logout(){
      auth.signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }
    
    function HomePage(){
      console.log( "navigate to home page");
      navigate( '/navigation' );
    }

    function handleLogin() {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('User logged in:', user);
            HomePage();
            // ...
          })
          .catch((error) => {
          });
      };
     function handleGoogleLogin(){
      signInWithRedirect(auth, provider);
      HomePage();
      //navigate('/navbar');
  }

  function registerPage(){
    navigate( '../register' );
  }

    return(
            <Box
            sx={{justifyContent:'center',width:'100%',height:'85vh',display:'flex',flexDirection:'column'}}
            >
                
                {/* <Button sx={{color:'black',marginLeft:'35%',marginTop:'13%',width:'20px'}}>Back</Button> */}
                {/* <Button sx={{color:'black',top:'-35px',marginLeft:'25%'}} onClick={registerPage}>Register</Button> */}
                
                
            <h1 style={{textAlign:'center',fontWeight:'normal',fontSize:'48px',marginBottom:'37px'}}>Login</h1>
            
            <Input
            sx={{backgroundColor:'lightgray',width:'443px',height:'64px',marginLeft:'auto',marginRight:'auto',border:'oldlace',borderColor:'black',borderRadius:'5px', paddingLeft:'10px'}}
            placeholder="  Email"
            disableUnderline = {true}
            
            onChange={(e) => setEmail(e.target.value)}
            >

            </Input>
            <Input
            sx={{backgroundColor:'lightgray',width:'443px',height:'64px',marginLeft:'auto',marginRight:'auto',marginTop:'37px',border:'oldlace',borderColor:'black',borderRadius:'5px', paddingLeft:'10px'}}
            placeholder="  Password"
            disableUnderline = {true}
            onChange={(e) => setPassword(e.target.value)}
            
            >

            </Input>
            <Box sx={{marginTop:'19px',alignItems:'center',width:'70%',display:'flex',flexDirection:'row'}}>
            <Checkbox  sx={{marginLeft:'50%'}} disableRipple></Checkbox>
            <Typography >Remember Me</Typography>
            <Button sx={{marginLeft:'15%',color:'black',textTransform:'none'}}
            
            >
                <Typography>
                Forgot Password?
                </Typography>
            </Button>
            </Box>
            <Box sx = {{textAlign:'center'}}>
            <Button
            sx={{backgroundColor:'#3b77bc',color:'white',
                borderRadius:'50px',
                marginTop:'30px',width: '435px',
                height: '46px',
                
                background: '#1979BB',
        
        }}
            
           onClick={handleLogin}
            
            >Login</Button>
            
            </Box>
            <Box sx = {{textAlign:'center',flexDirection:'column'}}>
            
            <Button
          startIcon={<Google />}
          
          sx={{
            backgroundColor: '#4285F4',
            color: 'white',
            
            width: '230px',
            height: '44px',
            marginTop: '25px',
          }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        {/* <Button
          startIcon={<Facebook />}
          sx={{
            marginLeft:'15px',
            background: '#3C5A9A',
            color: 'white',
            width: '230px',
            height: '44px',
            marginTop: '25px',
          }}

          onClick={handleFacebookLogin}
        >
          Sign in with Facebook
        </Button> */}

            </Box>
            <Button
            
            onClick={registerPage}
            >
              Register
            </Button>
            <Button
            
            onClick={Logout}
            >
              LOGOUT
            </Button>
            
              

            </Box>
            
            

    )
}

