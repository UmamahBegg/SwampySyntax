import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserProvider, UserContext} from "./contexts/user.context";
import HomePage from "../src/Components/HomePage/HomePage";
import LandingPage from "../src/Components/LandingPage/LandingPage";
import Login from "./Pages/Login.Page";
import PrivateRoute from "./Pages/PrivateRoute.Page";
import Signup from "./Pages/SignUp.Page";
import CreateEventPage from "./Components/CreateEventPage/CreateEventPage";
import ProfilePage from "./Components/ProfilePage/profilePage";
import NavBar from "./Components/NavBar/NavBar";
import {useEffect, useState, useCallback, useContext} from "react";
import Map from "./Components/Map/Map";

const REACT_APP_URL = process.env.REACT_APP_URL;

function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [events, setEvents] = useState([]);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const {user} = useContext(UserContext);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [toggle, setToggle] = useState(false);

  const joinEvent = useCallback(
    async (eventId) => {
      try {
        if (!user) {
          console.log("User not available");
          return;
        }
        const response = await fetch(`${REACT_APP_URL}events/${eventId}`, {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({userId: user.id}),
        });
        const data = await response.json();

        console.log(data);
        fetchData();
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
    function success(position) {
      console.log(position);
      setUserLat(position.coords.latitude);
      setUserLng(position.coords.longitude);
      console.log(`Latitude: ${userLat}, Longitude: ${userLng}`);
    }
    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  const fetchData = useCallback(() => {
    fetch(`${REACT_APP_URL}events`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredData(data);
        setEvents(data);

        if (user) {
          const filteredJoinedEvents = data.filter((event) =>
            event.joinedUsers.includes(user.id)
          );
          setJoinedEvents(filteredJoinedEvents);
        }
      })

      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, toggle]);

  const haversineDistance = useCallback(
    (event, userLocation, isMiles = false) => {
      if (!userLocation) return 0;

      function toRad(x) {
        return (x * Math.PI) / 180;
      }
      let radius = 6371;
      let x1 = event.latitude - userLocation.latitude;
      let dLat = toRad(x1);
      let x2 = event.longitude - userLocation.longitude;
      let dLon = toRad(x2);
      let haversine =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(event.latitude)) *
          Math.cos(toRad(userLocation.longitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
      let diameter = radius * c;
      if (isMiles) diameter /= 1.60934;
      return diameter;
    },
    [user]
  );

  useEffect(() => {
    const userLocation = {latitude: userLat, longitude: userLng};
    const maxDistance = 900;
    const nearbyEvents = events.filter((event) => {
      if (!userLocation) return false;

      const eventLocation = {
        latitude: Number(event.latitude),
        longitude: Number(event.longitude),
      };
      const distance = haversineDistance(eventLocation, userLocation);
      return distance <= maxDistance;
    });
    setFilteredData(nearbyEvents);
  }, [events, userLat, userLng, haversineDistance]);

  function handleFilteredData(event) {
    const inputValue = event.target.value;
    const filteredData = events.filter((event) =>
      event.title.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredData(filteredData);
  }

  const addNewEvent = useCallback(
    async (newEvent) => {
      console.log("APP.JS LINE 68 ", newEvent);
      try {
        const response = await fetch(`${REACT_APP_URL}events`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(newEvent),
        });
        const data = await response.json();
        console.log(data);
        fetchData();
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [fetchData]
  );

  return (
    <BrowserRouter>
      <NavBar handleFilteredData={handleFilteredData} />
      <Routes>
        <Route
          exact
          path='/'
          element={<LandingPage filteredData={filteredData} />}
        />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route
            exact
            path='/homepage'
            element={
              <HomePage
                setToggle={setToggle}
                toggle={toggle}
                joinEvent={joinEvent}
                events={events}
                filteredData={filteredData}
              />
            }
          />
          <Route
            exact
            path='/Map'
            element={
              <Map
                userLng={userLng}
                userLat={userLat}
                nearbyEvents={filteredData}
              />
            }
          />
          <Route
            exact
            path='/createeventpage'
            element={<CreateEventPage addNewEvent={addNewEvent} />}
          />
          <Route
            exact
            path='/profilePage'
            element={<ProfilePage joinedEvents={joinedEvents} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
