import React from 'react';
import "../css/Header.css";
import logo from "../assets/logo.png"

function Header(){
    return (
        <header className='app-header'>
            <img src = {logo} className='app-logo' alt='logo'/>
            <h1> PokeAPI </h1>
        </header>
    );
}

export default Header;  