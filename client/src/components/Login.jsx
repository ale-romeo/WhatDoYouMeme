import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'

function Login() {
  // Stati locali per gestire username, password, errori di registrazione e la visibilità del modal
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Funzioni dal contesto di autenticazione e navigazione
  const { login } = useAuth()
  const navigate = useNavigate()

  // Gestisce il cambiamento del campo username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Gestisce il cambiamento del campo password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Gestisce il submit del form di registrazione
  const handleSubmit = async (e) => {
    e.preventDefault()
    login(username, password)
      .then(() => {
        // Mostra il modal di successo e reindirizza al gioco dopo 2 secondi
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/game');
        }, 2000);
      })
      .catch((error) => {
        // Mostra il modal di errore in caso di fallimento
        setLoginError(error.error);
        setShowModal(true);
      });
  }

  // Gestisce la chiusura del modal
  const handleCloseModal = () => {
    setShowModal(false);
    if (!loginError) {
      navigate('/game');
    }
  };

  // Stile personalizzato per la card
  const cardStyle = {
    boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '15px',
    width: '100%'
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={3}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title className='text-center' style={{ fontFamily: 'Dinofiles' }}>{'Login'}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" style={{ marginBottom: '10px' }}>
                  <Form.Label> <strong>Username:</strong> </Form.Label>
                  <Form.Control type="username" value={username} onChange={handleUsernameChange} placeholder='Insert username...' />
                </Form.Group>
                <Form.Group controlId="formPassword" style={{ marginBottom: '10px' }}>
                  <Form.Label> <strong>Password:</strong> </Form.Label>
                  <Form.Control type="password" value={password} onChange={handlePasswordChange} placeholder='Insert password...' />
                </Form.Group>
                <Button type="submit" style={{ marginTop: '5px', marginBottom: '10px', backgroundColor: '#6830D7', width: '100%' }}>
                  {'Login'}
                </Button>
              </Form>

              {/* Modal per mostrare il risultato del login */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>{loginError ? 'Login failed' : 'Login successful'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>{loginError ? loginError : 'Successfully logged in!'}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <Link to="/signup">
                <p style={{ cursor: 'pointer', color: '#8961D9' }}>
                  {'Don\'t have an account? Sign Up'}
                </p>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login
