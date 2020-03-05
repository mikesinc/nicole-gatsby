import React, { useState, useEffect, useContext } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import MyWeek from "./MyWeek"
import BookingForm from "./BookingForm"
import axios from "axios"
import { UserContext } from "../Context/Store"
import emailjs from "emailjs-com"
import { useStaticQuery, graphql } from "gatsby"
import Toolbar from 'react-big-calendar/lib/Toolbar';

const localizer = momentLocalizer(moment)
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
  "December",
]

const BookingCalendar = () => {
  const queryData = useStaticQuery(graphql`
    {
      contentfulWebsiteInformation {
        email
      }
    }
  `)

  const [isLoaded, setIsLoaded] = useState(false)
  const [myEvents, setMyEvents] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({})
  const [userDetails] = useContext(UserContext)

  const getEvents = async () => {
    let res = await fetch("http://localhost:3001/")
    let data = await res.json()
    data.events.forEach(event => {
      event.start = new Date(event.start)
      event.end = new Date(event.end)
    })
    setMyEvents(data.events)
    setIsLoaded(true)
  }

  useEffect(() => {
    getEvents()
  }, [modalShow, isLoaded])

  const setDay = date => {
    date = new Date(date.getTime())
    date.setDate(date.getDate() + ((4 + 7 - date.getDay()) % 7))
    return date
  }

  const handleSelect = event => {
    if (event.title === "booked") {
      return null
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
        event: event,
      })
      setModalShow(true)
    }
  }

  const confirmBooking = async () => {
    const event = myEvents.filter(
      e => e.eventId === bookingDetails.event.eventId
    )[0]
    if (event.title === "booked") {
      alert("This session is no longer available. Please book another time.")
      return null
    }

    let res = await axios.post("http://localhost:3001/patch", {
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
          dateTime: event.start.toISOString(),
        },
        end: {
          dateTime: event.end.toISOString(),
        },
      },
    })
    let data = await res.data
    let mainCalEventId = data.result.data.id

    let eventStart = `${event.start.getHours()}${
      event.start.getMinutes() < 10
        ? event.start.getMinutes() + "0"
        : event.start.getMinutes()
    }`
    let eventEnd = `${event.end.getHours()}${
      event.end.getMinutes() < 10
        ? event.end.getMinutes() + "0"
        : event.end.getMinutes()
    }`
    let eventMonth = `${monthNames[event.start.getMonth()]}`
    let eventDay = `${event.start.getDate()}`

    const templateParams = {
      to: userDetails.userEmail,
      bcc: queryData.contentfulWebsiteInformation.email,
      subject: "Your booking confirmation",
      html: `
          <h1>${
            userDetails.userName
          }, please see below confirmation of your booking with
          Dr. Nicole Papadopolous.</h1>
          <h2>${eventStart} to ${eventEnd} on ${eventMonth} ${eventDay}</h2>
          <p>If you would like to cancel your booking, please click the below button</p>
          <a href="http://localhost:8000/cancel/:${
            event.eventId
          }&${mainCalEventId}+${userDetails.userName.replace(/ +/g, "-")}=${
        userDetails.userEmail
      }%${eventStart}*${eventEnd}~${eventMonth}!${eventDay}"><button>Cancel Booking</button></a>`,
    }

    emailjs
      .send(
        "default_service",
        "template_E2Z1PJQP",
        templateParams,
        process.env.GATSBY_USER_ID
      )
      .then(
        response => {
          console.log("sent", response.status, response.text)
        },
        err => console.log(err, "error")
      )
  }

  if (isLoaded) {
    return (
      <div>
        <Calendar
          localizer={localizer}
          now={new Date(0)}
          events={myEvents}
          defaultView={Views.WEEK}
          defaultDate={setDay(new Date(moment().startOf("day")))}
          components = {{toolbar : CustomToolbar}}
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
              cursor: event.title === "booked" ? "default" : "pointer",
            },
          })}
        />
        <BookingForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          onConfirm={e => {
            e.preventDefault()
            confirmBooking()
            setModalShow(false)
            setIsLoaded(false)
          }}
          details={bookingDetails}
        />
      </div>
    )
  } else {
    return (
      <>
        <h1>Loading</h1>
        <img
          alt="loading"
          src={require("../assets/images/ajax-loader.gif")}
        ></img>
      </>
    )
  }
}

class CustomToolbar extends Toolbar {
  render() {
    return (
      <div className='rbc-toolbar'>
        <span className="rbc-btn-group">
          <button type="button" onClick={() => this.navigate('TODAY')} >This Week</button>
          <button type="button" onClick={() => this.navigate('PREV')}>Back</button>
          <button type="button" onClick={() => this.navigate('NEXT')}>Next</button>
        </span>
        <span className="rbc-toolbar-label">{this.props.label}</span>
      </div>
    );
  }
  navigate = action => {
      
      this.props.onNavigate(action)
    }
  }
export default BookingCalendar
