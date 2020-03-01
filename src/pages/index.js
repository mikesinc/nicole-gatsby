import React from "react"
import { useLax, useLaxElement } from "use-lax"
import Container from "react-bootstrap/Container"
import Navbar from "../Components/Navbar"
import ContactForm from "../Components/ContactForm"
import Calendar from "../Components/Calendar"
import { Store } from "../Context/Store";
// import '../styles/global.css'

export default () => {
    useLax()
    const ref = useLaxElement()

  return (
    <Store>
      <Container
        fluid
        className="overall"
        style={{ margin: "0", padding: "0" }}
      >
        <Navbar />

        <Container
          fluid
          className="header "
          data-lax-bg-pos-y="1000 500, 0 0"
          ref={ref}
        >
          <h1>Affordable, private counseling</h1>
        </Container>

        <Container fluid className="scrollDown">
          <h1>Professional Clinical Psychologist</h1>
          <h2>Book your first consultation today and rediscover yourself</h2>
        </Container>

        <Container fluid className="about">
          <img
            alt="Nicole Papadopolous"
            src={require("../assets/images/nicole_papa.jpg")}
          ></img>
          <h1>Doctor Nicole Papadopolous</h1>
          <h2>[Qualifications]</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </Container>

        <Container fluid className="payment">
          <div>
            <h1>Consulting Days</h1>
            <h4>Thursday: 4.30pm - 7.30pm</h4>
            <h4>Friday: 10am - 7.00pm</h4>
          </div>
          <div>
            <h1>Pricing</h1>
            <h4>50 minute consultation: $200</h4>
            <h4>$26.50 medicare rebate available</h4>
          </div>
        </Container>

        <Container fluid className="booking">
          <h1>Book your consultation</h1>
          <Calendar />
        </Container>

        <Container fluid className="location">
          <div className="leftBox">
            <h4>
              If you would prefer to simply just get in touch, please don't
              hesitate to contact me below and I will get back to you as soon as
              possible.
            </h4>
            <ContactForm />
          </div>
          <div className="rightBox">
            <h1>Blackburn South Medical Centre</h1>
            <h2>5/195 Whitehorse Rd, Blackburn VIC 3130, Australia</h2>
          </div>
        </Container>
      </Container>
    </Store>
  )
}
