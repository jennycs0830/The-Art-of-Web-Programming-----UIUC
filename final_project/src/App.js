import './App.css';
import Login from './Login/Login.js';
import Register from './Register/Register.js';
import AdvSearch from './AdvanceSearch/advsearch.js';
import { Bus } from './Bus/bus.js';
import { Stop } from './Bus/stop.js';
import BusStop from './Map/busStop.js';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { UserProvider } from './User/User.js';
import EventCalendar from './Calender/EventCalendar.js';
import Navigation from './Navigation/Navigation.js';


function App() {

  const router = createBrowserRouter([
    {
      id: "root",

      path: "/",
      Component: Login,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/calendar",
      Component: EventCalendar,
    },
    {
      path: "/advsearch",
      Component: AdvSearch,
    },
    {
      path: "/bus",
      Component: Bus,
    },
    {
      path: "/stop",
      Component: Stop,
    },
    {
      path: "/navigation",
      Component: Navigation,
    },
    {
      path: "/busStop",
      Component: BusStop,
    },
   
    

  ], {
    basename: "/final_project"
  });







  return (
    <div className="App">
      <UserProvider>
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
      </UserProvider>
    </div>

  );
}

export default App;