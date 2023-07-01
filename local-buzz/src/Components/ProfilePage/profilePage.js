import {useEffect, useState} from "react";
import "../HomePage/EventCard/EventCard.css";
import clock from "../../assets/icons8-clock-100.png";
import address from "../../assets/icons8-address-100.png";
import date from "../../assets/icons8-calendar-100.png";
import speechBubble from "../../assets/icons8-speech-90.png";
import coin from "../../assets/icons8-coin-100.png";
import ticket from "../../assets/icons8-ticket-100.png";
import "./profilePage.css";

export default function ProfilePage(props) {
  const [show, setShow] = useState({});

  function handleClick(eventId) {
    setShow((prevShow) => ({
      ...prevShow,
      [eventId]: !prevShow[eventId],
    }));
  }

  // useEffect(() => {
  //   setJoinedEvents(props.joinedEvents);
  // }, []);

  // if (!props.joinedEvents) {
  //   // Handle the scenario when joinedEvents is null or undefined
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      <h1 className='myEvents'>My Events</h1>
      <div className='EventCardContainer'>
        {props.joinedEvents.map((event) => (
          <div key={event._id} className='event-card'>
            <div className='TextBorder'>
              <img
                className='event-img'
                onClick={() => handleClick(event._id)}
                alt='CardImage'
                src={event.image}
              />
              <div className='EventTitle'>
                <h2>{event.title}</h2>
              </div>
              <div className='EventDateAndCity'>
                <img className='img-icon' src={date} alt='date-icon' />
                <p>{event.date}</p>
                {!show[event._id] && (
                  <>
                    <img
                      className='img-icon'
                      src={address}
                      alt='address-icon'
                    />
                    <p>{event.city}</p>
                  </>
                )}
              </div>
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
                      {event.firstLineOfAddress}, {event.city}, {event.postcode}
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
                    <img className='img-icon-top' src={coin} alt='coin-icon' />
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
        ))}
      </div>
    </>
  );
}
