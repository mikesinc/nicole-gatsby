import React from "react"
import { useLax, useLaxElement } from "use-lax"
import Container from "react-bootstrap/Container"
import Navbar from "../Components/Navbar"
import ContactForm from "../Components/ContactForm"
import Calendar from "../Components/Calendar"
import { Store } from "../Context/Store"
import { Router } from "@reach/router"
import Cancel from "./cancel"
import { graphql } from "gatsby"
import Button from "react-bootstrap/Button"

export default ({ data }) => {
  useLax()
  const ref = useLaxElement()

  const setTop = height => {
    document.querySelector(height).scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  return (
    <>
      <Router basepath="/">
        <Cancel path="/cancel/:id" />
      </Router>
      <Store>
        <Navbar />
        <Container fluid className="overall">
          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.bannerImage.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`,
            }}
            fluid
            className="header lax"
            data-lax-bg-pos-y="8000 100, 0 -400"
            ref={ref}
          >
            <Container
              className="lax bannerText"
              data-lax-translate-y="0 0, 1000 900"
              data-lax-scale="5000 -1, 1 1"
              data-lax-opacity="0 1, 450 0"
            >
              <h1>{data.contentfulWebsiteInformation.banner}</h1>
            </Container>
          </Container>

          <Container fluid className="scrollDown">
            <h1>{data.contentfulWebsiteInformation.header}</h1>
            <h2>{data.contentfulWebsiteInformation.subHeader}</h2>
            <Button
              onClick={() => setTop(".booking")}
              style={{ marginTop: "20px", fontSize: '20pt' }}
              variant="warning"
            >
              Book Now
            </Button>
          </Container>

          <Container fluid className="about">
            <img
              alt="Nicole Papadopolous"
              src={data.contentfulWebsiteInformation.nicoleImage.file.url}
            ></img>
            <h1>{data.contentfulWebsiteInformation.name}</h1>
            <h2>{data.contentfulWebsiteInformation.qualifications}</h2>
            <p>{data.contentfulWebsiteInformation.blurb.internal.content}</p>
          </Container>

          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner2image.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`,
            }}
            fluid
            className="header lax"
            data-lax-bg-pos-y="4000 -200, -5000 0"
            ref={ref}
          >
            <Container className="bannerText">
              <h2>{data.contentfulWebsiteInformation.banner2}</h2>
            </Container>
          </Container>

          <Container fluid className="payment">
            <div>
              <h1>
                {
                  data.contentfulWebsiteInformation.workingDays.content[0]
                    .content[0].value
                }
              </h1>
              {data.contentfulWebsiteInformation.workingDays.content.map(
                item => {
                  if (
                    data.contentfulWebsiteInformation.workingDays.content.indexOf(
                      item
                    ) !== 0
                  ) {
                    return <h4>{item.content[0].value}</h4>
                  }
                  return null
                }
              )}
            </div>
            <div>
              <h1>
                {
                  data.contentfulWebsiteInformation.pricing.content[0]
                    .content[0].value
                }
              </h1>
              {data.contentfulWebsiteInformation.pricing.content.map(item => {
                if (
                  data.contentfulWebsiteInformation.pricing.content.indexOf(
                    item
                  ) !== 0
                ) {
                  return <h4>{item.content[0].value}</h4>
                }
                return null
              })}
            </div>
          </Container>

          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner3Image.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`,
            }}
            fluid
            className="header lax"
            data-lax-bg-pos-y="5000 -100, -500 50"
            ref={ref}
          >
            <Container className="bannerText">
              <h2>{data.contentfulWebsiteInformation.banner3}</h2>
            </Container>
          </Container>

          <Container fluid className="booking">
            <h1>{data.contentfulWebsiteInformation.bookingTitle}</h1>
            <Calendar />
          </Container>

          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner4Image.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`,
            }}
            fluid
            className="header lax"
            data-lax-bg-pos-y="5000 -200, -500 50"
            ref={ref}
          >
            <Container className="bannerText">
              <h2>{data.contentfulWebsiteInformation.banner4}</h2>
            </Container>
          </Container>

          <Container fluid className="location">
            <div className="leftBox">
              <h4>{data.contentfulWebsiteInformation.contactHeader}</h4>
              <ContactForm />
            </div>
            <div className="rightBox">
              <h1>{data.contentfulWebsiteInformation.address}</h1>
              <h2>{data.contentfulWebsiteInformation.addressLine2}</h2>
            </div>
          </Container>

          <Container fluid className="author">
            <p>website by mikesinc</p>
            <a
              href="https://github.com/mikesinc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../assets/images/github.png")}
                alt="GitHubLogo"
                width="50px"
              ></img>
            </a>
          </Container>
        </Container>
      </Store>
    </>
  )
}

export const query = graphql`
  {
    contentfulWebsiteInformation {
      banner
      banner2
      banner3
      banner4
      bookingTitle
      contactHeader
      header
      name
      qualifications
      subHeader
      address
      addressLine2
      pricing {
        content {
          content {
            value
          }
        }
      }
      workingDays {
        content {
          content {
            value
          }
        }
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
      banner3Image {
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
