import React from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment-timezone"
import "react-big-calendar/lib/css/react-big-calendar.css"
import MyWeek from "./MyWeek"
import BookingForm from "./BookingForm"
import axios from "axios"
import { UserContext } from "../Context/Store"
import emailjs from "emailjs-com"
import { StaticQuery, graphql } from "gatsby"
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
  if (date.getDay() === 5) {
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

class BookingCalendar extends React.Component {
  state = {
    week: 0,
    isLoaded: false,
    fetchError: "",
    myEvents: [],
    modalShow: false,
    bookingDetails: {},
    userDetails: UserContext,
  }

  getEvents = week => {
    axios
      .post("https://nicole-papa-server.herokuapp.com/", {
        week: week,
      })
      .then(res => {
        // console.log(res.data.events, "fetched events")
        this.checkEvents(res.data.events)
      })
      .catch(err => {
        this.setState({ fetchError: err.message })
        this.setState({ isLoaded: true })
        //   setFetchError(err.message)
        //   setIsLoaded(true)
      })
  }
  
  checkEvents = events => {
    axios
      .post("https://nicole-papa-server.herokuapp.com/checkbusybatch", {
        events: events,
        id: this.props.data.contentfulWebsiteInformation.email,
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
                this.setState({ fetchError: err.message })
                this.setState({ isLoaded: true })
                //   setFetchError(err.message)
                //   setIsLoaded(true)
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
                this.setState({ fetchError: err.message })
                this.setState({ isLoaded: true })
                //   setFetchError(err.message)
                //   setIsLoaded(true)
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
  
        if (JSON.stringify(this.state.myEvents) !== JSON.stringify(events)) {
          this.setState({ myEvents: events })
          // setMyEvents(events)
        }
        this.setState({ isLoaded: true })
        //   setIsLoaded(true)
      })
      .catch(err => {
        this.setState({ fetchError: err.message })
        this.setState({ isLoaded: true })
        //   setFetchError(err.message)
        //   setIsLoaded(true)
      })
  }

  componentDidMount() {
    console.log("MOUNT")
    this.setState({ isLoaded: false })
    this.getEvents(this.state.week)
  }

  componentDidUpdate() {
    console.log("UPDATE")
    // this.setState({ isLoaded: false })
    // this.getEvents(this.state.week)
  }

  handleSelect = event => {
    if (event.title === "Not Available") {
      return null
    } else {
      this.setState({
        bookingDetails: {
          title: "50 minute consultation with Dr. Papadopolous",
          day: `${monthNames[event.start.getMonth()]} ${event.start.getDate()}`,
          start: `${
            event.start.getHours() > 12
              ? event.start.getHours() - 12
              : event.start.getHours()
          }:${
            event.start.getMinutes() < 10
              ? event.start.getHours() > 12
                ? `${event.start.getMinutes()}0 pm`
                : `${event.start.getMinutes()}0 am`
              : event.start.getHours() > 12
              ? `${event.start.getMinutes()} pm`
              : `${event.start.getMinutes()}am`
          }`,
          end: `${
            event.end.getHours() > 12
              ? event.end.getHours() - 12
              : event.end.getHours()
          }:${
            event.end.getMinutes() < 10
              ? event.end.getHours() > 12
                ? `${event.end.getMinutes()}0 pm`
                : `${event.end.getMinutes()}0 am`
              : event.end.getHours() > 12
              ? `${event.end.getMinutes()} pm`
              : `${event.end.getMinutes()}am`
          }`,
          id: event.eventId,
        },
      })
      this.setState({ modalShow: true })
      //   setModalShow(true)
    }
  }

  confirmBooking = async () => {
    const event = this.state.myEvents.filter(
      e => e.eventId === this.state.bookingDetails.id
    )[0]
    let checkEvent = await axios.post(
      "https://nicole-papa-server.herokuapp.com/checkbusy",
      {
        start: {
          dateTime: adjustTime(new Date(event.start), "origin"),
        },
        end: {
          dateTime: adjustTime(new Date(event.end), "origin"),
        },
        id: this.props.data.contentfulWebsiteInformation.email,
      }
    )
    let busyEvent = await checkEvent.data
    if (
      busyEvent.busyStatus === 1 ||
      event.title === "Not Available" ||
      this.state.userDetails.honey !== "clean"
    ) {
      alert("This session is no longer available. Please book another time.")
      this.setState({ isLoaded: true })
      //   setIsLoaded(true)
      return null
    }

    let res = await axios.post(
      "https://nicole-papa-server.herokuapp.com/book",
      {
        eventId: event.eventId,
        title: "Not Available",
        calId: this.props.data.contentfulWebsiteInformation.email,
        resource: {
          summary: `${this.state.userDetails.userName} ${this.state.userDetails.userPhone} at ${this.state.bookingDetails.start} to ${this.state.bookingDetails.end}`,
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
      to: this.state.userDetails.userEmail,
      bcc: this.props.data.contentfulWebsiteInformation.email,
      subject: "Your booking confirmation",
      html: `
          <h1>${
            this.state.userDetails.userName
          }, please see below confirmation of your booking with
          Dr. Nicole Papadopoulos.</h1>
          <h2>${this.state.bookingDetails.start} to ${
        this.state.bookingDetails.end
      } on ${monthNames[event.start.getMonth()]} ${event.start.getDate()}</h2>
          <p>Contact Number provided: ${this.state.userDetails.userPhone}</p>
          <p>If you would like to cancel your booking, please click the below button</p>
          <a href="https://drnicole.netlify.com/cancel/:${
            // update this for host site.
            event.eventId
          }&${data.result.data.id}+${this.state.userDetails.userName.replace(
        / +/g,
        "-"
      )}=${this.state.userDetails.userEmail}%${eventStart}*${eventEnd}~${
        monthNames[event.start.getMonth()]
      }!${event.start.getDate()}"><button>Cancel Booking</button></a>`,
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
    let newEventsList = this.state.myEvents.map(a => {
      return { ...a }
    })
    newEventsList.find(a => a.eventId === event.eventId).title = "Not Available"
    this.setState({ myEvents: newEventsList })
    this.setState({ isLoaded: true })
    // setMyEvents(newEventsList)
    // setIsLoaded(true)
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div style={{ height: "90vh" }}>
          <h1>Loading</h1>
          <img
            alt="loading"
            src={require("../assets/images/ajax-loader.gif")}
          ></img>
        </div>
      )
    } else if (this.state.fetchError) {
      return (
        <p>
          {this.state.fetchError}.. cannot load calendar.. please refresh and
          try again.
        </p>
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
                return this.setState({ week: matchHours(e) })
                // return setWeek(matchHours(e))
              } else if (e < new Date()) {
                return null
              }
              this.setState({ week: e })
              //   setWeek(e)
            }}
            localizer={localizer}
            events={this.state.myEvents}
            defaultView={Views.WEEK}
            defaultDate={
              this.state.week === 0
                ? setDay(new Date(moment().startOf("day")))
                : setDay(new Date(moment(this.state.week).startOf("day")))
            }
            components={{ toolbar: CustomToolbar }}
            views={{ week: MyWeek }}
            onSelectEvent={event => this.handleSelect(event)}
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
            show={this.state.modalShow}
            onHide={() => {
              this.setState({ modalShow: false })
              //   setModalShow(false)
            }}
            onConfirm={e => {
              e.preventDefault()
              this.confirmBooking()
              this.setState({ modalShow: false })
              this.setState({ isLoaded: false })
              //   setModalShow(false)
              //   setIsLoaded(false)
            }}
            details={this.state.bookingDetails}
          />
        </div>
      )
    }
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

export default () => (
  <StaticQuery
    query={graphql`
      query {
        contentfulWebsiteInformation {
          email
        }
      }
    `}
    render={data => <BookingCalendar data={data} />}
  />
)
