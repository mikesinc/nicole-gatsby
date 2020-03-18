import React from "react"
import { graphql } from "gatsby"
import Container from "react-bootstrap/Container"
import { useLax, useLaxElement } from "use-lax"
import "bootstrap/dist/css/bootstrap.min.css"

export default ({ data }) => {
  useLax()
  const ref = useLaxElement()
  return (
    <Container fluid className="overall" style={{ margin: "0", padding: "0" }}>
      <Container
        style={{
          backgroundImage: `url(${data.contentfulWebsiteInformation.bannerImage.file.url}), linear-gradient(to bottom, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6))`,
        }}
        fluid
        className="banner lax"
        data-lax-bg-pos-y="0 -300, 1500 -250"
        ref={ref}
      ></Container>
      <Container fluid className="scrollDown">
        <h1>Uh oh, looks like there's nothing here!</h1>
        <h2>Page not found: 404</h2>
      </Container>
    </Container>
  )
}

export const query = graphql`
  {
    contentfulWebsiteInformation {
      bannerImage {
        file {
          url
        }
      }
    }
  }
`
