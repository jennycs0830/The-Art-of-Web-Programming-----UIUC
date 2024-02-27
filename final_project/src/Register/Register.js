import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Input } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {app} from './../Firebase/firebase.js';
import { useNavigate } from 'react-router-dom';
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export default function Register(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [username,setUsername] = useState('');
    
    const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //NAVIGATE ONCE REGISTERED
      navigate( '/navigation' );
      console.log('User registered:', userCredential.user);
    } catch (error) {
      console.error('Registration failed:', error.message);
      console.log(email);
    }
  };

    function LoginPage(){
      navigate('../login');
    }

    return(

            <Box
            sx={{justifyContent:'center',width:'100%',height:'85vh',display:'flex',flexDirection:'column'}}
            >
               
                <Button sx={{color:'black',marginLeft:'35%',marginTop:'13%',width:'20px'}} onClick={LoginPage}>Login</Button>
                
            <h1 style={{textAlign:'center',fontWeight:'normal',fontSize:'48px',marginBottom:'37px'}}>Register</h1>
            <Input
            sx={{backgroundColor:'lightgray',width:'443px',height:'64px',marginLeft:'auto',marginRight:'auto',border:'oldlace',borderColor:'black',borderRadius:'5px', paddingLeft:'10px'}}
            placeholder="  Username"
            disableUnderline = {true}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="username"

            ></Input>
            <Input
            sx={{backgroundColor:'lightgray',width:'443px',height:'64px',marginLeft:'auto',marginRight:'auto',border:'oldlace',borderColor:'black',borderRadius:'5px',marginTop:'37px',paddingLeft:'10px'}}
            placeholder="  Email"
            disableUnderline = {true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            >

            </Input>
            <Input
            sx={{backgroundColor:'lightgray',width:'443px',height:'64px',marginLeft:'auto',marginRight:'auto',marginTop:'37px',border:'oldlace',borderColor:'black',borderRadius:'5px', paddingLeft:'10px'}}
            placeholder="  Password"
            disableUnderline = {true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            
            >

            </Input>
            
            <Box sx = {{textAlign:'center'}}>
            <Button
            sx={{backgroundColor:'#3b77bc',color:'white',
                borderRadius:'50px',
                marginTop:'30px',width: '435px',
                height: '46px',
                flexShrink:0,
                background: '#1979BB',
        
        }}
            onClick={() => {
                
                handleRegister();
                
            }}
           
            
            >Register</Button>
            
            </Box>
            <Box sx = {{textAlign:'center',flexDirection:'column'}}>
            
         
            </Box>
            </Box>
            
            

    )
}

