import React, { useState, useEffect, useContext } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment-timezone"
import "react-big-calendar/lib/css/react-big-calendar.css"
import MyWeek from "./MyWeek"
import BookingForm from "./BookingForm"
import axios from "axios"
import { UserContext } from "../Context/Store"
import emailjs from "emailjs-com"
import { useStaticQuery, graphql } from "gatsby"
import Toolbar from "react-big-calendar/lib/Toolbar"

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

const adjustTime = (time, zone) => {
  const timeZoneOffset = -(time.getTimezoneOffset() / 60)
  const melbOffset =
    moment(time)
      .tz("Australia/Melbourne")
      .utcOffset() / 60
  if (zone === "melb") {
    time.setHours(time.getHours() + (melbOffset - timeZoneOffset))
  } else {
    time.setHours(time.getHours() - (melbOffset - timeZoneOffset))
  }
  return time
}

const setDay = date => {
  date = new Date(date.getTime())
  date.setDate(date.getDate() + ((4 + 7 - date.getDay()) % 7))
  return date
}

const BookingCalendar = () => {
  const queryData = useStaticQuery(graphql`
    {
      contentfulWebsiteInformation {
        email
      }
    }
  `)

  const [week, setWeek] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [myEvents, setMyEvents] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({})
  const [userDetails] = useContext(UserContext)

  useEffect(() => {
    const getEvents = async week => {
      let fetchEvents = await axios.post("http://localhost:3001/", {
        week: week,
      })
      let res = await fetchEvents.data
      // console.log(res.events, "fetched events")
      checkEvents(res.events)
    }

    const checkEvents = async events => {
      events.forEach(async event => {
        let res = await axios.post("http://localhost:3001/checkbusy", {
          start: {
            dateTime: new Date(event.start),
          },
          end: {
            dateTime: new Date(event.end),
          },
          id: queryData.contentfulWebsiteInformation.email,
        })
        let busyData = await res.data
        if (busyData.busyStatus === 1) {
          axios.post("http://localhost:3001/patch", {
            eventId: event.eventId,
            title: "Not Available",
          })
        } else if (busyData.busyStatus === 0 && event.title !== "Available") {
          axios.post("http://localhost:3001/patch", {
            eventId: event.eventId,
            title: "Available",
          })
        }
      })
      // console.log(events, "checked events")
      localiseEvents(events)
    }

    const localiseEvents = events => {
      events.forEach(event => {
        event.start = new Date(event.start)
        adjustTime(event.start, "melb")
        event.end = new Date(event.end)
        adjustTime(event.end, "melb")
      })
      // console.log(events, "localised + checked events (state)")
      setMyEvents(events)
      setIsLoaded(true)
    }

    getEvents(week)
  }, [week, queryData.contentfulWebsiteInformation.email, isLoaded])

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
        id: event.eventId,
      })
      setModalShow(true)
    }
  }

  const confirmBooking = async () => {
    const event = myEvents.filter(
      e => e.eventId === bookingDetails.id
    )[0]
      //make sure cant double book
    let checkEvent = await axios.post("http://localhost:3001/checkbusy", {
      start: {
        dateTime: adjustTime(new Date(event.start), "origin"),
      },
      end: {
        dateTime:  adjustTime(new Date(event.end), "origin"),
      },
      id: queryData.contentfulWebsiteInformation.email,
    })
    let busyEvent = await checkEvent.data
    console.log(busyEvent)
    if (busyEvent.busyStatus === 1 || event.title === "Not Available" || userDetails.honey !== "clean") {
      alert("This session is no longer available. Please book another time.")
      return null
    }

    let res = await axios.post("http://localhost:3001/book", {
      eventId: event.eventId,
      title: "Not Available",
      calId: queryData.contentfulWebsiteInformation.email,
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
          dateTime: adjustTime(new Date(event.start), "origin").toISOString(),
        },
        end: {
          dateTime: adjustTime(new Date(event.end), "origin").toISOString(),
        },
      },
    })
    let data = await res.data
    console.log(data)
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

    // emailjs
    //   .send(
    //     "default_service",
    //     "template_iAFYVnVx",
    //     templateParams,
    //     process.env.GATSBY_EMAILJS_USER_ID
    //   )
    //   .then(
    //     response => {
    //       console.log("sent", response.status, response.text)
    //     },
    //     err => console.log(err, "error")
    //   )
    alert(
      "Booking confirmed, a confirmation email will be sent to you shortly."
    )
    setIsLoaded(true)
  }

  if (!isLoaded) {
    return (
      <>
        <h1>Loading</h1>
        <img
          alt="loading"
          src={require("../assets/images/ajax-loader.gif")}
        ></img>
      </>
    )
  } else {
    return (
      <div>
        <Calendar
          onNavigate={e => {
            if(e < Date.now()) return null
            setWeek(e)
            setIsLoaded(false)
          }}
          localizer={localizer}
          now={new Date(0)}
          events={myEvents}
          defaultView={Views.WEEK}
          defaultDate={
            week === 0 ? setDay(new Date(moment().startOf("day"))) : week
          }
          components={{ toolbar: CustomToolbar }}
          views={{ week: MyWeek }}
          style={{ height: "70vh", width: "30vw" }}
          onSelectEvent={event => handleSelect(event)}
          getNow={() => setDay(new Date(moment().startOf("day")))}
          min={new Date(0, 0, 0, 10, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          scrollToTime={new Date(0, 0, 0, 0, 0, 0)}
          eventPropGetter={event => ({
            style: {
              backgroundColor:
                event.title === "Not Available" ? "grey" : "#ffbd00",
              color: "black",
              cursor: event.title === "Not Available" ? "default" : "pointer",
            },
          })}
        />
        <p>All times shown are in AET</p>
        <BookingForm
          show={modalShow}
          onHide={() => {
            setModalShow(false)
          }}
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
  }
}

class CustomToolbar extends Toolbar {
  render() {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => this.navigate("TODAY")}>
            This Week
          </button>
          <button type="button" onClick={() => this.navigate("PREV")}>
            Back
          </button>
          <button type="button" onClick={() => this.navigate("NEXT")}>
            Next
          </button>
        </span>
        <span className="rbc-toolbar-label">{this.props.label}</span>
      </div>
    )
  }
  navigate = action => {
    this.props.onNavigate(action)
  }
}
export default BookingCalendar
