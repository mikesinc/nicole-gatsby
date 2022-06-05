import React, { useEffect } from "react"
import lax from 'lax.js'
import Container from "react-bootstrap/Container"
import Navbar from "../Components/Navbar"
import Calendar from "../Components/Calendar"
import { Store } from "../Context/Store"
import { Router } from "@reach/router"
import Cancel from "./cancel"
import { graphql } from "gatsby"
import Button from "react-bootstrap/Button"
import Seo from "../Components/Seo"
import "bootstrap/dist/css/bootstrap.min.css"

const Main = ({ data }) => {
  const setTop = height => {
    document.querySelector(height).scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  useEffect(() => {
    lax.init();

    lax.addDriver('scrollY', 
      () => {                     
        return window.scrollY
      }
    );


    lax.addElements('.laxheader', {
      scrollY: {
        opacity: [
          ["elCenterY", "elOutY"],
          [1, 0]
        ]
      }
    });

    lax.addElements('.laxheadertext', {
      scrollY: {
        opacity: [
          ["elCenterY", "elOutY"],
          [1, 0]
        ],
        translateY: [
          ["elInY", "elOutY"],
          [-250, 250]
        ]
      }
    });

    lax.addElements('.lax', {
      scrollY: {
        translateY: [
          ["elInY", "elOutY"],
          ['-screenHeight/4', 'screenHeight/4']
        ]
      }
    });

    lax.addElements('.laxtext', {
      scrollY: {
        translateY: [
          ["elInY", "elOutY"],
          [250, -250]
        ]
      }
    });

  }, [])

  return (
    <>
      <Seo title={data.contentfulWebsiteInformation.name} />
      <Router basepath="/">
        <Cancel path="/cancel/:id" />
      </Router>
      <Store>
        <Navbar />
        <Container fluid className="overall">
          <Container
            fluid
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.bannerImage.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`
            }}
            className="banner laxheader"
          >
            <Container
              className="laxheadertext bannerText"
              fluid
            >
              <h1>{data.contentfulWebsiteInformation.banner}</h1>
            </Container>
          </Container>

          <Container fluid className="scrollDown">
            <Button
              onClick={() => setTop(".booking")}
              className="bookButton"
              variant="info"
              style={{color: 'white'}}
            >
              Book Now
            </Button>
            <span
              style={{
                borderBottom: "ridge",
                borderColor: "rgba(53, 148, 164, 0.3)",
                width: "50%",
              }}
            ></span>
            <h1>{data.contentfulWebsiteInformation.header}</h1>
            <h2>{data.contentfulWebsiteInformation.subHeader}</h2>
          </Container>

          <Container fluid className="about">
            <img
              alt="Nicole Papadopoulos"
              src={data.contentfulWebsiteInformation.nicoleImage.file.url}
            ></img>
            <Container className="aboutTextWrapper" fluid>
              <h1>{data.contentfulWebsiteInformation.name}</h1>
              <span
                style={{
                  borderBottom: "ridge",
                  borderColor: "rgba(53, 148, 164, 0.3)",
                  width: "50%",
                  marginBottom: "20px",
                }}
              ></span>
              <h2>{data.contentfulWebsiteInformation.qualifications}</h2>
              <p>{data.contentfulWebsiteInformation.blurb.internal.content}</p>
            </Container>
          </Container>

          <div style={{overflow: 'hidden'}}>
            <Container
              style={{
                backgroundImage: `url(${data.contentfulWebsiteInformation.banner2image.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
                scale: '1.1'
              }}
              fluid
              className="banner lax"
            >
              <Container className="laxtext bannerText" fluid>
                  <h2>{data.contentfulWebsiteInformation.banner2}</h2>
              </Container>
            </Container>
          </div>

          <Container fluid className="payment">
            <div className="consulting">
              <img
                src={require('../assets/images/talk.png').default}
                alt="talk"
                height="100px"
                style={{ marginBottom: "40px" }}
              ></img>
              <h1>
                {
                  JSON.parse(data.contentfulWebsiteInformation.workingDays.raw).content[0].content[0].value
                }
              </h1>
              <span
                style={{
                  borderBottom: "ridge",
                  borderColor: "rgba(53, 148, 164, 0.3)",
                  width: "50%",
                  margin: "0px 0px 20px",
                }}
              ></span>
              {JSON.parse(data.contentfulWebsiteInformation.workingDays.raw).content.map(
                (item, index) => {
                  if (
                    JSON.parse(data.contentfulWebsiteInformation.workingDays.raw).content.indexOf(
                      item
                    ) !== 0
                  ) {
                    return <h4 key={index}>{item.content[0].value}</h4>
                  }
                  return null
                }
              )}
            </div>
            <div className="consulting">
              <img
                src={require("../assets/images/payment.png").default}
                alt="payment"
                height="100px"
                style={{ marginBottom: "40px" }}
              ></img>
              <h1>
                {
                  JSON.parse(data.contentfulWebsiteInformation.pricing.raw).content[0].content[0].value
                }
              </h1>
              <span
                style={{
                  borderBottom: "ridge",
                  borderColor: "rgba(53, 148, 164, 0.3)",
                  width: "50%",
                  margin: "0px 0px 20px",
                }}
              ></span>
              {JSON.parse(data.contentfulWebsiteInformation.pricing.raw).content.map(
                (item, index) => {
                  if (
                    JSON.parse(data.contentfulWebsiteInformation.pricing.raw).content.indexOf(
                      item
                    ) !== 0
                  ) {
                    return <h4 key={index}>{item.content[0].value}</h4>
                  }
                  return null
                }
              )}
            </div>
          </Container>

          <Container fluid className="booking">
            <img
              src={require("../assets/images/calendar.png").default}
              alt="calendar"
              height="100px"
              style={{ margin: "20px 0px 20px" }}
            ></img>
            <h1>{data.contentfulWebsiteInformation.bookingTitle}</h1>
            <span
              style={{
                borderBottom: "ridge",
                borderColor: "rgba(53, 148, 164, 0.3)",
                width: "50%",
                margin: "0px 0px 50px",
              }}
            ></span>
            {/* <Calendar /> */}
            <div>
              <h3>I am currently on leave until further notice.</h3>
            </div>
          </Container>

          <div style={{overflow: 'hidden'}}>
            <Container
              style={{
                backgroundImage: `url(${data.contentfulWebsiteInformation.banner4Image.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
                scale: '1.1'
              }}
              fluid
              className="banner lax"
            >
              <Container className="laxtext bannerText" fluid>
                <h2>{data.contentfulWebsiteInformation.banner4}</h2>
              </Container>
            </Container>
          </div>

          <Container fluid className="location">
            <div className="leftBox">
              <img
                src={require("../assets/images/idea.png").default}
                alt="idea"
                height="100px"
                style={{ margin: "20px 0px 20px" }}
              ></img>
              <h3>Specialisation</h3>
              <div
                style={{
                  borderBottom: "ridge",
                  borderColor: "rgba(53, 148, 164, 0.3)",
                  width: "50%",
                  margin: "0px auto 20px",
                }}
              ></div>
              <div
                className="specialisationText"
                dangerouslySetInnerHTML={{
                  __html:
                    data.contentfulWebsiteInformation.specialisations
                      .childMarkdownRemark.html,
                }}
              ></div>
              <div
                className="therapeuticText"
                dangerouslySetInnerHTML={{
                  __html:
                    data.contentfulWebsiteInformation.therapeuticPractice
                      .childMarkdownRemark.html,
                }}
              ></div>
            </div>

            <div fluid className="rightBox">
              <img
                src={require("../assets/images/contact.png").default}
                alt="contact"
                height="100px"
                style={{ margin: "20px 0px 20px" }}
              ></img>
              <h3>Contact</h3>
              <div
                style={{
                  borderBottom: "ridge",
                  borderColor: "rgba(53, 148, 164, 0.3)",
                  width: "50%",
                  margin: "0px auto 20px",
                }}
              ></div>
              <h1>{data.contentfulWebsiteInformation.address}</h1>
              <h2>{data.contentfulWebsiteInformation.addressLine2}</h2>
              <h2>Tel: {data.contentfulWebsiteInformation.contactNumber}</h2>
              <iframe
                title="googlemap"
                className="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3150.123313931144!2d145.12954531532!3d-37.85740497974449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad6407bd983af63%3A0x49a8178116f80c65!2s429%20Highbury%20Rd%2C%20Burwood%20East%20VIC%203151!5e0!3m2!1sen!2sau!4v1586841181822!5m2!1sen!2sau"
                frameBorder="0"
                style={{ border: "0" }}
                allowFullScreen=""
                aria-hidden="false"
                // tabindex="0"
              ></iframe>
            </div>
          </Container>
          <Container fluid className="author">
            <div>
              <a
                href="https://github.com/mikesinc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>website by mikesinc</p>
              </a>
              <div style={{ fontSize: "6px" }}>
                Icons made by{" "}
                <a
                  href="https://www.flaticon.com/authors/freepik"
                  title="Freepik"
                >
                  Freepik
                </a>{" "}
                from{" "}
                <a href="https://www.flaticon.com/" title="Flaticon">
                  www.flaticon.com
                </a>
              </div>
            </div>
          </Container>
        </Container>
      </Store>
    </>
  )
}
export default Main;

export const query = graphql`
  {
    contentfulWebsiteInformation {
      banner
      banner2
      banner4
      bookingTitle
      specialisations {
        childMarkdownRemark {
          html
        }
      }
      therapeuticPractice {
        childMarkdownRemark {
          html
        }
      }
      header
      name
      qualifications
      subHeader
      contactNumber
      address
      addressLine2
      pricing {
        raw
      }
      workingDays {
        raw
      }
      blurb {
        internal {
          content
        }
      }
      bannerImage {
        file {
          url
        }
      }
      banner2image {
        file {
          url
        }
      }
      banner4Image {
        file {
          url
        }
      }
      nicoleImage {
        file {
          url
        }
      }
    }
  }
`
