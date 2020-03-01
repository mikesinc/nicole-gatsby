import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import '../styles/Navbar.css';

const NavBar = () => {
    const [isTop, setIsTop] = useState(true);

    const setTop = (height) => {
        document.querySelector(height).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                setIsTop(false);
                document.querySelectorAll('.nav-link').forEach(item => {
                    item.classList.add('black');
                })
            } else {
                document.querySelectorAll('.nav-link').forEach(item => {
                    item.classList.remove('black');
                })
                setIsTop(true);
            }
        })
    })

    return (
        <>
            <Navbar className="navy" fixed="top" bg={isTop ? "transparent" : "light"} variant={isTop ? "dark" : "light"} collapseonselect='true' expand='sm'>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse className='toggled' id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Navbar.Brand>Dr. Nicole Papadopolous</Navbar.Brand>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={() => setTop('.about')}>About</Nav.Link>
                        <Nav.Link onClick={() => setTop('.payment')}>Pricing</Nav.Link>
                        <Nav.Link onClick={() => setTop('.booking')}>Bookings</Nav.Link>
                        <Nav.Link onClick={() => setTop('.location')}>Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBar;