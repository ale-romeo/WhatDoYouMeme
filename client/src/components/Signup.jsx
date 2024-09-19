import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  // Stati per gestire il username, la password, gli errori di signup e la visualizzazione del modal
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Hook di autenticazione per accedere alla funzione di signup
  const { signup } = useAuth();

  // Hook di navigazione per la gestione della navigazione programmatica
  const navigate = useNavigate();

  // Funzione per gestire il cambiamento di valore del campo username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Funzione per gestire il cambiamento di valore del campo password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Funzione per gestire il submit del form di signup
  const handleSubmit = (e) => {
    e.preventDefault();

    // Esegue la funzione di signup
    signup(username, password)
      .then(() => {
        // Mostra il modal di successo
        setShowModal(true);
        setTimeout(() => {
          // Chiude il modal e naviga alla pagina di gioco dopo 2 secondi
          setShowModal(false);
          navigate('/game');
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        // Imposta il messaggio di errore e mostra il modal
        setSignupError(error.error);
        setShowModal(true);
      });
  };

  // Funzione per gestire la chiusura del modal
  const handleCloseModal = () => {
    setShowModal(false);
    if (!signupError) {
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
              <Card.Title className='text-center' style={{ fontFamily: 'Dinofiles' }}>{'Sign Up'}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" style={{ marginBottom: '10px' }}>
                  <Form.Label>Username:</Form.Label>
                  <Form.Control type="username" value={username} onChange={handleUsernameChange} placeholder='Insert username...' />
                </Form.Group>
                <Form.Group controlId="formPassword" style={{ marginBottom: '10px' }}>
                  <Form.Label>Password:</Form.Label>
                  <Form.Control type="password" value={password} onChange={handlePasswordChange} placeholder='Insert password...' />
                </Form.Group>
                <Button type="submit" style={{ marginTop: '5px', marginBottom: '10px', backgroundColor: '#6830D7', width: '100%' }}>
                  {'Sign Up'}
                </Button>
              </Form>

              {/* Modal per mostrare il risultato del signup */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>{signupError ? 'Signup failed' : 'Signup successful'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>{signupError ? signupError : 'Successfully registered!'}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <Link to="/login">
                <p style={{ cursor: 'pointer', color: '#8961D9' }}>
                  {'Already have an account? Login'}
                </p>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
