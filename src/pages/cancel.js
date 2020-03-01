import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"
import axios from "axios"

export default (id) => {
  useEffect(() => {
      console.log(id);
    axios
      .post("http://localhost:3001/cancel", {
        eventId: id
      })
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])

  return (
    <Container fluid className="overall" style={{ margin: "0", padding: "0" }}>
      Booking Cancelled!
    </Container>
  )
}
