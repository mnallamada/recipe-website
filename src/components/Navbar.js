import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.png'; // Import the logo

const AppNavbar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const checkUser = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setIsAdmin(userDoc.data().role === 'admin');
                    setUserName(userDoc.data().name);
                }
            } else {
                setIsAdmin(false);
                setUserName(null);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, checkUser);
        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchText);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="ps-3">
            <Navbar.Brand href="/">
                <img
                    src={logo}
                    alt="Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                />
                Recipe Website
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
                <Nav className="me-auto">
                    {isAdmin && (
                        <LinkContainer to="/add-recipe">
                            <Nav.Link>Add Recipe</Nav.Link>
                        </LinkContainer>
                    )}
                </Nav>
                <Form className="d-flex" onSubmit={handleSearch}>
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button variant="outline-light" type="submit">Search</Button>
                </Form>
                <Nav className="ms-auto">
                    {userName ? (
                        <NavDropdown title={userName} id="user-dropdown">
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <>
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/register">
                                <Nav.Link>Register</Nav.Link>
                            </LinkContainer>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
