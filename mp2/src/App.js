import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import ListView from './components/listView';
import GalleryView from './components/galleryView';
import DetailView from './components/detailView';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
        <Header/>
        <nav>
          <div className='nav-container'>
            <NavLink to = "/" className={ ({isActive}) => (isActive ? 'active': '') }> List View </NavLink>
            <NavLink to = "/gallery" className={ ({isActive}) => (isActive ? 'active': '') }> Gallery View </NavLink>
          </div>        
        </nav>

        <Routes>
          <Route path = "/" element = {<ListView />} />
          <Route path = "/gallery" element = {<GalleryView />} />
          <Route path = "/detail/:id" element = {<DetailView />} />
          <Route element = {<h1> 404: Page Not Found </h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
