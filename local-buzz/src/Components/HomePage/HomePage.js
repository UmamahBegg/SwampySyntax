import "../../App.css";
import "./HomePage.css";
import {Button} from "@mui/material";
import {useContext} from "react";
import {UserContext} from "../../contexts/user.context";
import CreateEventBtn from "./CreateEventBtn/CreateEventBtn";
import EventCard from "./EventCard/EventCard";
import {useNavigate} from "react-router-dom";

const REACT_APP_URL = process.env.REACT_APP_URL;

export default function HomePage(props) {
  const navigate = useNavigate();
  const {logOutUser, user} = useContext(UserContext);

  // This function is called when the user clicks the "Logout" button.
  const logOut = () => {
    logOutUser()
      .then((loggedOut) => {
        if (loggedOut) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <div className='header-container'>
        <button className='map-view' onClick={() => navigate("/Map")}>
          Map View
        </button>
        <Button
          variant='contained'
          onClick={logOut}
          sx={{
            fontFamily: "josefin sans",
            display: "inline-block",
            backgroundColor: "#5aaaa6",
            borderRadius: "25px",
            border: "1px solid #47474782",
            padding: "0.1rem 0.8rem",
            color: "white",
            textTransform: "capitalize",
            fontSize: "1rem",
            fontWeight: "bold",
            maxHeight: "30px",
            minHeight: "30px",
            marginLeft: "3rem",
            maxWidth: "140px",
            minWidth: "100px",
            boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
          }}
        >
          Logout
        </Button>
      </div>
      <p className='welcome-member'>
        Welcome to the community!<br></br> Let's explore some more.
      </p>
      <EventCard
        setToggle={props.setToggle}
        toggle={props.toggle}
        events={props.events}
        user={user}
        joinEvent={props.joinEvent}
        filteredData={props.filteredData}
      />
      <CreateEventBtn />
    </>
  );
}
