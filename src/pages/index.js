import React, { useEffect } from "react"
import lax from "lax.js"
import Container from "react-bootstrap/Container"
import Navbar from "../Components/Navbar"
import ContactForm from "../Components/ContactForm"
import Calendar from "../Components/Calendar"
import { Store } from "../Context/Store"
import { Router } from "@reach/router"
import Cancel from "./cancel"
import { graphql } from "gatsby"
import Button from "react-bootstrap/Button"
import SEO from "../Components/Seo"
import "bootstrap/dist/css/bootstrap.min.css"

export default ({ data }) => {
  const setTop = height => {
    document.querySelector(height).scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  useEffect(() => {
    if (window.document.documentMode) {
      return null
    } else {
      lax.setup({
        breakpoints: { small: 0, large: 1370 },
      }) // init
      const updateLax = () => {
        lax.update(window.pageYOffset)
        window.requestAnimationFrame(updateLax)
      }
      window.requestAnimationFrame(updateLax)
      document.querySelectorAll(".lax").forEach(element => {
        lax.addElement(element)
      })
      window.addEventListener("resize", function() {
        lax.updateElements()
      })
    }
  })

  return (
    <>
      <SEO title={data.contentfulWebsiteInformation.name} />
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
            className="banner lax"
            data-lax-bg-pos-y_large="0 (-0.2*vh), vh (-0.1*vh)"
            data-lax-bg-pos-y_small="0 0, 0 0"
          >
            <Container
              className="lax bannerText"
              data-lax-translate-y_large="0 0, vh (0.6*elw)"
              data-lax-translate-y_small="0 0, 0 0"
              data-lax-opacity_large="0 1, (0.5*vh) 0"
              data-lax-opacity_small="0 1, 0 1"
            >
              <h1>{data.contentfulWebsiteInformation.banner}</h1>
            </Container>
          </Container>

          <Container fluid className="scrollDown">
            <h1>{data.contentfulWebsiteInformation.header}</h1>
            <h2>{data.contentfulWebsiteInformation.subHeader}</h2>
            <Button
              onClick={() => setTop(".booking")}
              className="bookButton"
              variant="warning"
            >
              Book Now
            </Button>
          </Container>

          <Container fluid className="about">
            <img
              alt="Nicole Papadopoulos"
              src={data.contentfulWebsiteInformation.nicoleImage.file.url}
            ></img>
            <h1>{data.contentfulWebsiteInformation.name}</h1>
            <h2>{data.contentfulWebsiteInformation.qualifications}</h2>
            <div className="iewrap-fix">
              <p>{data.contentfulWebsiteInformation.blurb.internal.content}</p>
            </div>
          </Container>

          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner2image.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
            }}
            fluid
            className="banner lax"
            data-lax-bg-pos-y_large="vh (-0.05*elh), -vh (0.05*elh)"
            data-lax-bg-pos-y_small="0 0, 0 0"
            data-lax-anchor="self"
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
                (item, index) => {
                  if (
                    data.contentfulWebsiteInformation.workingDays.content.indexOf(
                      item
                    ) !== 0
                  ) {
                    return <h4 key={index}>{item.content[0].value}</h4>
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
              {data.contentfulWebsiteInformation.pricing.content.map(
                (item, index) => {
                  if (
                    data.contentfulWebsiteInformation.pricing.content.indexOf(
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

          <Container
            style={{
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner3Image.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
            }}
            fluid
            className="banner lax"
            data-lax-bg-pos-y_large="vh (-0.05*elh), -vh (0.05*elh)"
            data-lax-bg-pos-y_small="0 0, 0 0"
            data-lax-anchor="self"
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
              backgroundImage: `url(${data.contentfulWebsiteInformation.banner4Image.file.url}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
            }}
            fluid
            className="banner lax"
            data-lax-bg-pos-y_large="vh (-0.05*elh), -vh (0.05*elh)"
            data-lax-bg-pos-y_small="0 0, 0 0"
            data-lax-anchor="self"
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
            <div>
              <a
                href="https://github.com/mikesinc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>website by mikesinc</p>
              </a>
              <a href="https://icons8.com/">
                <p style={{ fontSize: "6px" }}>icon by icons8</p>
              </a>
            </div>
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
