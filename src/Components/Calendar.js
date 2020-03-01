import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyWeek from "./MyWeek";
import BookingForm from "./BookingForm";
import axios from "axios";
import { UserContext } from "../Context/Store";
import Button from "react-bootstrap/Button";
import emailjs from 'emailjs-com';

// const { emailjs } = window;
const localizer = momentLocalizer(moment);
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const BookingCalendar = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [userDetails] = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/")
      .then(res => {
        res.data.events.forEach(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        setMyEvents(res.data.events);
        setIsLoaded(true);
      })
      .catch(err => console.log(err.detail));
  }, [isLoaded]);

  const setDay = date => {
    date = new Date(date.getTime());
    date.setDate(date.getDate() + ((4 + 7 - date.getDay()) % 7));
    return date;
  };

  const handleSelect = event => {
    if (event.title === "booked") {
      return null;
    } else {
      setBookingDetails({
        title: "50 minute consultation with Dr. Papadopolous",
        day: `${monthNames[event.start.getMonth()]} ${event.start.getDate()}`,
        start: `${event.start.getHours()}:${
          event.start.getMinutes() < 10
            ? event.start.getMinutes() + "0"
            : event.start.getMinutes()
        }`,
        end: `${event.end.getHours()}:${
          event.end.getMinutes() < 10
            ? event.end.getMinutes() + "0"
            : event.end.getMinutes()
        }`,
        event: event
      });
      setModalShow(true);
    }
  };

  const confirmBooking = event => {
    setIsLoaded(false);
    axios
      .post("http://localhost:3001/patch", {
        eventId: event.eventId,
        title: "booked",
        resource: {
          summary: `${userDetails.userName} at ${event.start.getHours()}:${
            event.start.getMinutes() < 10
              ? event.start.getMinutes() + "0"
              : event.start.getMinutes()
          } to ${event.end.getHours()}:${
            event.end.getMinutes() < 10
              ? event.end.getMinutes() + "0"
              : event.end.getMinutes()
          }`,
          start: {
            dateTime: event.start.toISOString()
          },
          end: {
            dateTime: event.end.toISOString()
          }
        }
      })
      .then(response => console.log(response))
      .catch(error => console.log(error));

    const handleClick = () => {
        console.log('clicked');
    }

    const templateParams = {
      to: userDetails.userEmail,
      subject: "Your booking confirmation",
      html: `
          <h1>${
            userDetails.userName
          }, please see below confirmation of your booking with
          Dr. Nicole Papadopolous.</h1>
          <h2>${event.start.getHours()}:${
        event.start.getMinutes() < 10
          ? event.start.getMinutes() + "0"
          : event.start.getMinutes()
      }
          to ${event.end.getHours()}:${
        event.end.getMinutes() < 10
          ? event.end.getMinutes() + "0"
          : event.end.getMinutes()
      }
          on ${monthNames[event.start.getMonth()]} ${event.start.getDate()}</h2>
          <p>If you would like to cancel your booking, please click the below button</p>
          <a href="http://localhost:8000/cancel/"><Button onclick={handleClick()}>Cancel Booking</Button></a>`
    };

    emailjs
      .send(
        "default_service",
        "template_E2Z1PJQP",
        templateParams,
        process.env.GATSBY_USER_ID
      )
      .then(
        response => {
          console.log("sent", response.status, response.text);
        },
        err => console.log(err, "error")
      );
  };

  if (isLoaded) {
    return (
      <div>
        <Calendar
          localizer={localizer}
          now={new Date(0)}
          events={myEvents}
          defaultView={Views.WEEK}
          defaultDate={setDay(new Date(moment().startOf("day")))}
          views={{ week: MyWeek }}
          style={{ height: "60vh", width: "30vw" }}
          onSelectEvent={event => handleSelect(event)}
          getNow={() => setDay(new Date(moment().startOf("day")))}
          min={new Date(0, 0, 0, 10, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          scrollToTime={new Date(0, 0, 0, 0, 0, 0)}
          eventPropGetter={event => ({
            style: {
              backgroundColor: event.title === "booked" ? "grey" : "#ffbd00",
              color: "black",
              cursor: event.title === "booked" ? "default" : "pointer"
            }
          })}
        />
        <BookingForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          onConfirm={e => {
            e.preventDefault();
            confirmBooking(bookingDetails.event);
            setModalShow(false);
          }}
          details={bookingDetails}
        />
      </div>
    );
  } else {
    return (
      <>
        <h1>Loading</h1>
        <img
          alt="loading"
          src={require("../assets/images/ajax-loader.gif")}
        ></img>
      </>
    );
  }
};
export default BookingCalendar;