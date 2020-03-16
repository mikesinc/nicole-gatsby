import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { useStaticQuery, graphql } from "gatsby"

const NavBar = () => {
  const data = useStaticQuery(graphql`
    {
      contentfulWebsiteInformation {
        nav2Pricing
        nav3Bookings
        nav4Contact
        navAbout
        name
      }
    }
  `)

  const [isTop, setIsTop] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const setTop = height => {
    document.querySelector(height).scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    setIsExpanded(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight * 0.4) {
        setIsTop(false)
        document.querySelectorAll(".nav-link").forEach(item => {
          item.classList.add("black")
        })
      } else {
        document.querySelectorAll(".nav-link").forEach(item => {
          item.classList.remove("black")
        })
        setIsTop(true)
      }
    })
  })

  return (
    <>
      <Navbar
        className="navy"
        fixed="top"
        bg={isTop ? "transparent" : "light"}
        variant={isTop ? "dark" : "light"}
        collapseOnSelect="true"
        expand="lg"
        expanded={isExpanded}
      >
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <Navbar.Collapse className="toggled" id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Brand>
              {data.contentfulWebsiteInformation.name}
            </Navbar.Brand>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link onClick={() => setTop(".about")}>
              {data.contentfulWebsiteInformation.navAbout}
            </Nav.Link>
            <Nav.Link onClick={() => setTop(".payment")}>
              {data.contentfulWebsiteInformation.nav2Pricing}
            </Nav.Link>
            <Nav.Link onClick={() => setTop(".booking")}>
              {data.contentfulWebsiteInformation.nav3Bookings}
            </Nav.Link>
            <Nav.Link onClick={() => setTop(".location")}>
              {data.contentfulWebsiteInformation.nav4Contact}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default NavBar
