import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Hook di navigazione per la gestione della navigazione programmatica
  const navigate = useNavigate();

  // Funzione per gestire il submit del pulsante di login
  const handleSubmitLogin = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del submit
    navigate('/login'); // Naviga alla pagina di login
  }

  // Funzione per gestire il submit del pulsante di gioco come ospite
  const handleSubmitGuest = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del submit
    navigate('/game'); // Naviga alla pagina di gioco come ospite
  }

  // Stile personalizzato per la card
  const cardStyle = {
    boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
    width: '100%'
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={4}>
          <Card style={cardStyle}>
            <Card.Body style={{ margin: '20px' }}>
              <Card.Title style={{ fontFamily: 'Dinofiles', color: 'black' }} className='text-center'>{'Choose the way to go'}</Card.Title>
              <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Col md={6}>
                  <Card.Text className='text-center'>{'Login to play games with 3 rounds and save your scores.'}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className='text-center'>{'Play as guest with 1 round and no scores saved.'}</Card.Text>
                </Col>
              </Row>
              <Row style={{ marginBottom: '10px' }}>
                <Col md={6}>
                  <Button type="submit" style={{ backgroundColor: '#6830D7', width: '100%' }} onClick={handleSubmitLogin}>
                    {'Login'}
                  </Button>
                </Col>
                <Col md={6}>
                  <Button type="submit" style={{ backgroundColor: '#6830D7', width: '100%' }} onClick={handleSubmitGuest}>
                    {'Guest'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
