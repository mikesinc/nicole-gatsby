import React, { useContext } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { UserContext } from "../Context/Store"

const BookingForm = props => {
  const [, setUserDetails] = useContext(UserContext)
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="myModal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.details.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please fill in your details below to confirm your booking.</p>
        <Container fluid className="form_container" style={{ padding: "0" }}>
          <Form onSubmit={props.onConfirm}>
            <fieldset>
              <Form.Group as={Row}>
                <Form.Label as="legend" column sm={{ span: 2, offset: 0 }}>
                  Session
                </Form.Label>
                <Col xs={12} sm={10} lg={10}>
                  <Form.Check
                    type="checkbox"
                    label={`${props.details.start} to ${props.details.end} on ${props.details.day}`}
                    name="description"
                    value={`${props.details.start} to ${props.details.end} on ${props.details.day}`}
                    id="formHorizontalRadios1"
                    checked
                    readOnly
                  />
                </Col>
              </Form.Group>
            </fieldset>
            <Form.Group as={Row}>
              <Form.Label column sm={{ span: 2, offset: 0 }}>
                Full Name*
              </Form.Label>
              <Col xs={12} sm={8} lg={5}>
                <Form.Control
                  style={{ background: "transparent" }}
                  type="name"
                  name="name"
                  placeholder="Full Name"
                  required
                  onInput={e => {
                    setUserDetails({ type: "NAME", payload: [e.target.value] })
                  }}
                />
                <Form.Control.Feedback>Valid!</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Control
                style={{
                  background: "transparent",
                  opacity: "0",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  height: "0",
                  width: "0",
                  zIndex: "-1",
                }}
                tabIndex="-1"
                name="email"
                autoComplete="off"
                placeholder="Your e-mail here"
                id="email"
                type="email"
                onInput={e => {
                  setUserDetails({ type: "HUNAY", payload: [e.target.value] })
                }}
              />
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={{ span: 2, offset: 0 }}>
                Email*
              </Form.Label>
              <Col xs={12} sm={8} lg={5}>
                <Form.Control
                  style={{ background: "transparent" }}
                  type="email"
                  name="_replyto"
                  placeholder="example@gmail.com"
                  required
                  onInput={e =>
                    setUserDetails({ type: "EMAIL", payload: [e.target.value] })
                  }
                />
                <Form.Control.Feedback>Valid!</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={{ span: 2, offset: 0 }}>
                Phone*
              </Form.Label>
              <Col xs={12} sm={8} lg={5}>
                <Form.Control
                  style={{ background: "transparent" }}
                  type="tel"
                  name="tel"
                  required
                  onInput={e =>
                    setUserDetails({ type: "TEL", payload: [e.target.value] })
                  }
                />
              </Col>
            </Form.Group>
            <p style={{ padding: "0%", paddingTop: "1%" }}>
              (*) required fields
            </p>
            <Form.Group as={Row}>
              <Col sm={{ span: 5, offset: 2 }} lg={{ span: 3, offset: 2 }}>
                <Button type="submit" variant="info">
                  confirm booking
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BookingForm
