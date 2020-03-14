import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"
import axios from "axios"
import { useLax, useLaxElement } from "use-lax"
import emailjs from "emailjs-com"
import { graphql } from "gatsby"

export default ({ location: { pathname }, data }) => {
  useLax()
  const ref = useLaxElement()

  useEffect(() => {
    const ids = pathname.split(":").pop()
    const day = ids.split("!").pop()
    const month = ids
      .split("~")
      .pop()
      .split("!")
      .shift()
    const start = ids
      .split("%")
      .pop()
      .split("*")
      .shift()
    const end = ids
      .split("*")
      .pop()
      .split("~")
      .shift()
    const username = ids
      .split("+")
      .pop()
      .split("=")
      .shift()
      .replace("-", " ")
    const email = ids
      .split("=")
      .pop()
      .split("%")
      .shift()
    const mainCalEventId = ids
      .split("&")
      .pop()
      .split("+")
      .shift()
    const id = ids.split("&").shift()

    axios
      .post("http://localhost:3001/cancel", {
        eventId: id,
        mainCalEventId: mainCalEventId,
        calId: data.contentfulWebsiteInformation.email
      })
      .then(response => console.log(response))
      .catch(error => console.log(error))

    const templateParams = {
      to: email,
      bcc: data.contentfulWebsiteInformation.email,
      subject: `${username}, your booking has been cancelled`,
      html: `
            <h1>${username}, you have cancelled your booking with Dr. Papadopoulos: </h1>
            <h2>${start} to ${end} on ${month} ${day}</h2 `,
    }
    emailjs
      .send(
        "default_service",
        "cancel",
        templateParams,
        process.env.GATSBY_EMAILJS_USER_ID
      )
      .then(
        response => {
          console.log("sent", response.status, response.text)
        },
        err => console.log(err, "error")
      )
    // eslint-disable-next-line
  }, [])

  return (
    <Container fluid className="overall" style={{ margin: "0", padding: "0" }}>
      <Container
        style={{backgroundImage: `url(${data.contentfulWebsiteInformation.bannerImage.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`}}
        fluid
        className="header lax"
        data-lax-bg-pos-y="8000 100, 0 -400"
        ref={ref}
      ></Container>
      <Container fluid className="scrollDown">
        <h1>Booking Cancelled</h1>
        <h2>You may close this window.</h2>
      </Container>
    </Container>
  )
}

export const query = graphql`
  {
    contentfulWebsiteInformation {
      email
      bannerImage {
        file {
          url
        }
      }
    }
  }
`
