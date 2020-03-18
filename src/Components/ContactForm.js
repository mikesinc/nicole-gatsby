import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useStaticQuery, graphql } from "gatsby"

const ContactForm = () => {
  const data = useStaticQuery(graphql`
    {
      contentfulWebsiteInformation {
        email
      }
    }
  `)
  return (
    <div>
      <Container fluid className="form_container" style={{ padding: "0" }}>
        <Form
          action={`https://formspree.io/${data.contentfulWebsiteInformation.email}`}
          method="POST"
        >
          <Form.Group as={Row}>
            <Form.Label column sm={{ span: 2, offset: 0 }} style={{fontWeight: 'normal'}}>
              Name*
            </Form.Label>
            <Col xs={12} sm={10} lg={10} xl={5}>
              <Form.Control
                style={{ background: "transparent", color: "black" }}
                type="name"
                placeholder="Full Name"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={{ span: 2, offset: 0 }} style={{fontWeight: 'normal'}}>
              Email*
            </Form.Label>
            <Col xs={12} sm={10} lg={10} xl={5}>
              <Form.Control
                style={{ background: "transparent", color: "black" }}
                type="email"
                name="_replyto"
                placeholder="Email"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={{ span: 2, offset: 0 }} style={{fontWeight: 'normal'}}>
              Phone
            </Form.Label>
            <Col xs={12} sm={10} lg={10} xl={5}>
              <Form.Control
                style={{ background: "transparent", color: "black" }}
                type="tel"
                name="tel"
                placeholder="(optional)"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} id="description">
            <Form.Label column sm={{ span: 2, offset: 0 }} style={{fontWeight: 'normal'}}>
              Message*
            </Form.Label>
            <Col xs={12} sm={10} lg={10}>
              <Form.Control
                style={{ background: "transparent", color: "black" }}
                name="description"
                size="md"
                as="textarea"
                rows="10"
                placeholder={`Your message... `}
                required
              />
              <p style={{ padding: "0%", paddingTop: "1%" }} style={{fontWeight: 'normal'}}>
                (*) required fields
              </p>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm={{ span: 3, offset: 2 }} lg={{ span: 5, offset: 2 }}>
              <Button type="submit" variant="warning">
                send message
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};

export default ContactForm;