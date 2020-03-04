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

export default ({ data }) => {
  useLax()
  const ref = useLaxElement()

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
            data-lax-bg-pos-y="5000 500, 150 -50"
            ref={ref}
          >
            <h1>{data.contentfulWebsiteInformation.banner}</h1>
          </Container>

          <Container fluid className="scrollDown">
            <h1>{data.contentfulWebsiteInformation.header}</h1>
            <h2>{data.contentfulWebsiteInformation.subHeader}</h2>
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

          <Container fluid className="booking">
            <h1>{data.contentfulWebsiteInformation.bookingTitle}</h1>
            <Calendar />
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
        </Container>
      </Store>
    </>
  )
}

export const query = graphql`
  {
    contentfulWebsiteInformation {
      banner
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
      nicoleImage {
        file {
          url
        }
      }
    }
  }
`
