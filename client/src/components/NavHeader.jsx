import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Navbar, Button, Modal } from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import { IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

function NavHeader() {
    // Stato per gestire la visibilità del modal di logout
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    // Ottieni le informazioni sull'utente e la funzione di logout dal contesto di autenticazione
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Funzione per gestire il logout
    const handleLogout = () => {
        logout()
            .then(() => {
                setShowLogoutModal(false); // Chiudi il modal di logout
                navigate('/'); // Naviga alla pagina principale
            })
            .catch((error) => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#e83f69' }}>
            <Container fluid>
                <Row className="align-items-center" style={{ width: '100%' }}>
                    <Col>
                        <Navbar.Brand>
                            {user ?
                                <Link to="/game">
                                    <img src='src/assets/logo_nav.png' size={32} style={{ color: 'aliceblue', marginBottom: '4px', width: '40px' }} />
                                </Link>
                                :
                                <Link to="/">
                                    <img src='src/assets/logo_nav.png' size={32} style={{ color: 'aliceblue', marginBottom: '4px', width: '40px' }} />
                                </Link>
                            }
                        </Navbar.Brand>
                    </Col>
                    <Col className="text-end">
                        {user ? (
                            <>
                                <Navbar.Text style={{ color: 'aliceblue', marginRight: '10px' }}>
                                    Hi, {user.username}
                                </Navbar.Text>
                                <Navbar.Brand>
                                    <Link to="/profile">
                                        <PersonFill size={24} style={{ color: 'aliceblue' }} />
                                    </Link>
                                </Navbar.Brand>
                                <Navbar.Brand onClick={() => setShowLogoutModal(true)}>
                                    <IoLogOutOutline size={24} style={{ color: 'aliceblue', cursor: 'pointer' }} />
                                </Navbar.Brand>
                                {/* Modal di conferma del logout */}
                                <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirm Logout</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure you want to logout?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        ) : (
                            <Navbar.Brand>
                                <Link to="/login">
                                    <PersonFill size={24} style={{ color: 'aliceblue' }} />
                                </Link>
                            </Navbar.Brand>
                        )}
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default NavHeader;
