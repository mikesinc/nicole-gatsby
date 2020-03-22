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
  if(date.getDay() === 5) {
    date.setDate(date.getDate() - ((6 + 7 - date.getDay()) % 7))
  } else {
    date.setDate(date.getDate() + ((4 + 7 - date.getDay()) % 7))
  }
  return date
}

const matchHours = date => {
  date = new Date(date.getTime())
  date.setDate(new Date().getDate())
  date.setHours(new Date().getHours(), new Date().getMinutes(), 0)
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
  const [fetchError, setFetchError] = useState("")
  const [myEvents, setMyEvents] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({})
  const [userDetails] = useContext(UserContext)

  useEffect(() => {
    const getEvents = week => {
      axios
        .post("https://nicole-papa-server.herokuapp.com/", {
          week: week,
        })
        .then(res => {
          // console.log(res.data.events, "fetched events")
          checkEvents(res.data.events)
        })
        .catch(err => {
          setFetchError(err.message)
          setIsLoaded(true)
        })
    }

    const checkEvents = events => {
      axios
        .post("https://nicole-papa-server.herokuapp.com/checkbusybatch", {
          events: events,
          id: queryData.contentfulWebsiteInformation.email,
        })
        .then(res => {
          const checkEvents = res.data.busyArray

          checkEvents.forEach(checkedEvent => {
            // console.log(checkedEvent, "checked event")
            if (checkedEvent.busyStatus === 1) {
              // console.log("patching, 1")
              axios
                .post("https://nicole-papa-server.herokuapp.com/patch", {
                  eventId: checkedEvent.eventId,
                  title: "Not Available",
                })
                .catch(err => {
                  setFetchError(err.message)
                  setIsLoaded(true)
                })
            } else if (
              checkedEvent.busyStatus === 0 &&
              events.filter(event => event.eventId === checkedEvent.eventId)[0]
                .title !== "Available"
            ) {
              // console.log("patching, 2")
              axios
                .post("https://nicole-papa-server.herokuapp.com/patch", {
                  eventId: checkedEvent.eventId,
                  title: "Available",
                })
                .catch(err => {
                  setFetchError(err.message)
                  setIsLoaded(true)
                })
            }
          })

          events.forEach(event => {
            event.start = new Date(event.start)
            adjustTime(event.start, "melb")
            event.end = new Date(event.end)
            adjustTime(event.end, "melb")
          })
          // console.log(events, "checked events")

          if (JSON.stringify(myEvents) !== JSON.stringify(events)) {
            setMyEvents(events)
          }
          setIsLoaded(true)
        })
        .catch(err => {
          setFetchError(err.message)
          setIsLoaded(true)
        })
    }
    setIsLoaded(false)
    getEvents(week)
  }, [week, queryData.contentfulWebsiteInformation.email])

  const handleSelect = event => {
    if (event.title === "Not Available") {
      return null
    } else {
      setBookingDetails({
        title: "50 minute consultation with Dr. Papadopolous",
        day: `${monthNames[event.start.getMonth()]} ${event.start.getDate()}`,
        start: `${event.start.getHours() > 12 ? event.start.getHours() - 12 : event.start.getHours()}:${
          event.start.getMinutes() < 10
            ? event.start.getHours() > 12 ? `${event.start.getMinutes()}0 pm`: `${event.start.getMinutes()}0 am`
            : event.start.getHours() > 12 ? `${event.start.getMinutes()} pm` : `${event.start.getMinutes()}am`
        }`,
        end: `${event.end.getHours() > 12 ? event.end.getHours() - 12 : event.end.getHours()}:${
          event.end.getMinutes() < 10
            ? event.end.getHours() > 12 ? `${event.end.getMinutes()}0 pm`: `${event.end.getMinutes()}0 am`
            : event.end.getHours() > 12 ? `${event.end.getMinutes()} pm` : `${event.end.getMinutes()}am`
        }`,
        id: event.eventId,
      })
      setModalShow(true)
    }
  }

  const confirmBooking = async () => {
    const event = myEvents.filter(e => e.eventId === bookingDetails.id)[0]
    let checkEvent = await axios.post(
      "https://nicole-papa-server.herokuapp.com/checkbusy",
      {
        start: {
          dateTime: adjustTime(new Date(event.start), "origin"),
        },
        end: {
          dateTime: adjustTime(new Date(event.end), "origin"),
        },
        id: queryData.contentfulWebsiteInformation.email,
      }
    )
    let busyEvent = await checkEvent.data
    if (
      busyEvent.busyStatus === 1 ||
      event.title === "Not Available" ||
      userDetails.honey !== "clean"
    ) {
      alert("This session is no longer available. Please book another time.")
      setIsLoaded(true)
      return null
    }

    let res = await axios.post(
      "https://nicole-papa-server.herokuapp.com/book",
      {
        eventId: event.eventId,
        title: "Not Available",
        calId: queryData.contentfulWebsiteInformation.email,
        resource: {
          summary: `${userDetails.userName} ${userDetails.userPhone} at ${bookingDetails.start} to ${bookingDetails.end}`,
          start: {
            dateTime: adjustTime(new Date(event.start), "origin").toISOString(),
          },
          end: {
            dateTime: adjustTime(new Date(event.end), "origin").toISOString(),
          },
        },
      }
    )
    let data = await res.data
    // console.log(data)

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

    const templateParams = {
      to: userDetails.userEmail,
      bcc: queryData.contentfulWebsiteInformation.email,
      subject: "Your booking confirmation",
      html: `
          <h1>${
            userDetails.userName
          }, please see below confirmation of your booking with
          Dr. Nicole Papadopoulos.</h1>
          <h2>${bookingDetails.start} to ${bookingDetails.end} on ${monthNames[event.start.getMonth()]} ${event.start.getDate()}</h2>
          <p>Contact Number provided: ${userDetails.userPhone}</p>
          <p>If you would like to cancel your booking, please click the below button</p>
          <a href="https://drnicolepapadopoulos.netlify.com/cancel/:${ // update this for host site.
            event.eventId
          }&${data.result.data.id}+${userDetails.userName.replace(/ +/g, "-")}=${
        userDetails.userEmail
      }%${eventStart}*${eventEnd}~${monthNames[event.start.getMonth()]}!${event.start.getDate()}"><button>Cancel Booking</button></a>`,
    }

    emailjs
      .send(
        "default_service",
        "template_iAFYVnVx",
        templateParams,
        process.env.GATSBY_EMAILJS_USER_ID
      )
      .then(
        response => {
          console.log("sent", response.status, response.text)
        },
        err => console.log(err, "error")
      )
    alert(
      "Booking confirmed, a confirmation email will be sent to you shortly."
    )
    let newEventsList = myEvents.map(a => {
      return { ...a }
    })
    newEventsList.find(a => a.eventId === event.eventId).title = "Not Available"
    setMyEvents(newEventsList)
    setIsLoaded(true)
  }

  if (!isLoaded) {
    return (
      <div style={{height: "90vh"}}>
        <h1>Loading</h1>
        <img
          alt="loading"
          src={require("../assets/images/ajax-loader.gif")}
        ></img>
      </div>
    )
  } else if (fetchError) {
    return (
      <p>{fetchError}.. cannot load calendar.. please refresh and try again.</p>
    )
  } else if (window.document.documentMode) {
    return (
      <>
      <p>Please use Chrome, Mozilla or Edge to make a booking!</p>
      <p>Internet Explorer is not supported.</p>
      </>
    )
 } else {
    return (
      <div>
        <Calendar
          onNavigate={e => {
            if (
              new Date().getDate() === e.getDate() ||
              new Date().getDate() === e.getDate() + 1
            ) {
              return setWeek(matchHours(e))
            } else if (e < new Date()) {
              return null
            }
            setWeek(e)
          }}
          localizer={localizer}
          events={myEvents}
          defaultView={Views.WEEK}
          defaultDate={
            week === 0
              ? setDay(new Date(moment().startOf("day")))
              : setDay(new Date(moment(week).startOf("day")))
          }
          components={{ toolbar: CustomToolbar }}
          views={{ week: MyWeek }}
          onSelectEvent={event => handleSelect(event)}
          getNow={() => setDay(new Date(moment().startOf("day")))}
          min={new Date(0, 0, 0, 10, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          scrollToTime={new Date(0, 0, 0, 0, 0, 0)}
          eventPropGetter={event => ({
            style: {
              backgroundColor:
                event.title === "Not Available" ? "grey" : "#3594a4",
              color: event.title === "Not Available" ? "black" : "white",
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
