import React, {useState} from "react";
import "./EventCard.css";
import clock from "../../../assets/icons8-clock-100.png";
import address from "../../../assets/icons8-address-100.png";
import date from "../../../assets/icons8-calendar-100.png";
import speechBubble from "../../../assets/icons8-speech-90.png";
import coin from "../../../assets/icons8-coin-100.png";
import ticket from "../../../assets/icons8-ticket-100.png";

function EventCard(props) {
  // Define state variable for showing event description
  const [show, setShow] = useState({});
  const [attending, setAttending] = useState(false);

  console.log(props.user);

  function handleAttendingClick(eventId) {
    setAttending((prevAttending) => ({
      ...prevAttending,
      [eventId]: !prevAttending[eventId],
    }));
  }

  // Define function to handle click event on image
  function handleClick(eventId) {
    // Update the show state variable to toggle the description of the clicked event
    setShow((prevShow) => ({
      ...prevShow, // copy the previous state object
      // the below is an if statement that checks if the eventId is in the show object, if it is then it will return the opposite of the current value of the show property of the eventId, if it isn't then it will return true
      [eventId]: !prevShow[eventId], // toggle the show property of the clicked event id
    }));
  }

  // Render the EventCard component
  return (
    <>
      <div className='EventCardContainer'>
        {props.filteredData?.map(
          (
            event //'?' is 'Optional Chaining' bypasses the error from undefined. It is still undefined, however.
          ) => (
            <div key={event._id} className='event-card'>
              {/* add click event listener to toggle the description of the clicked event  */}
              <div className='TextBorder'>
                {/* <div className='img-container'> */}{" "}
                <img
                  className='event-img'
                  onClick={() => handleClick(event._id)}
                  alt='CardImage'
                  src={event.image}
                />
                {/* </div> */}
                <div className='EventTitleAndDots'>
                  <h2>{event.title}</h2>
                  {!attending[event._id] && (
                    <button
                      className='JoinButton'
                      onClick={() => {
                        handleAttendingClick(event._id);
                        props.joinEvent(event._id);
                      }}
                    >
                      Join +
                    </button>
                  )}
                  {attending[event._id] && (
                    <button
                      className='JoinedButton'
                      onClick={() => handleAttendingClick(event._id)}
                    >
                      Joined
                    </button>
                  )}
                  
                </div>
                <div className='EventDateAndCity'>
                  <img className='img-icon' src={date} alt='date-icon' />
                  <p> {event.date}</p>
                  {!show[event._id] && (
                    <>
                      <img
                        className='img-icon'
                        src={address}
                        alt='address-icon'
                      />{" "}
                      <p>{event.city}</p>
                    </>
                  )}
                </div>
                {/* show the description of the clicked event if the show property is true  */}
                {show[event._id] && (
                  <div>
                    <div className='EventDateAndCity'>
                      <img className='img-icon' src={clock} alt='date-icon' />
                      <p>{event.time}</p>
                    </div>
                    <div className='EventDateAndCity'>
                      <img
                        className='img-icon-top'
                        src={address}
                        alt='address-icon'
                      />
                      <p>
                        {event.firstLineOfAddress}, {event.city},{" "}
                        {event.postcode}
                      </p>
                    </div>
                    <div className='EventDateAndCity'>
                      <img
                        className='img-icon-top'
                        src={speechBubble}
                        alt='speech-bubble-icon'
                      />
                      <p className='EventDescription'>{event.description}</p>
                    </div>
                    <div className='PriceAndSpaces'>
                      <img
                        className='img-icon-top'
                        src={coin}
                        alt='coin-icon'
                      />
                      <p>£{event.price}</p>
                      <img
                        className='img-icon-top'
                        src={ticket}
                        alt='ticket-icon'
                      />
                      <p>{event.capacity} spaces left</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default EventCard;
