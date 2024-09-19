import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getGames } from '../services/api';
import GameTable from './GameTable';

const Profile = () => {
  // Stato per memorizzare i giochi dell'utente
  const [games, setGames] = useState([]);
  
  // Ottieni il contesto di autenticazione
  const { user, deleteUser } = useAuth();
  const navigate = useNavigate();

  // Effetto per recuperare i giochi dell'utente quando il componente viene montato
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Recupera i giochi dell'utente
        const userGames = await getGames();
        setGames(userGames); // Aggiorna lo stato con i giochi recuperati
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };

    // Recupera i giochi solo se l'utente è autenticato
    if (user) {
      fetchGames();
    }
  }, [user]);

  // Funzione per gestire la cancellazione dell'utente
  const handleDeleteUser = async () => {
    try {
      await deleteUser(); // Cancella l'utente
      navigate('/'); // Naviga alla home page
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Stile personalizzato per la card
  const cardStyle = {
    boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '15px'
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={8}>
          <Card style={cardStyle} >
            <Card.Header style={{ backgroundColor: '#e83f69' }} >
              <Card.Title className='text-center' style={{ color: 'aliceblue' }}><strong>{'Profile'}</strong></Card.Title>
            </Card.Header>
            <Card.Body>
              {games.length === 0
                ? <p className='text-center'>No games found</p>
                :
                <Table striped bordered hover className="table-custom">
                  <thead>
                    <tr>
                      <th>Game ID</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <GameTable games={games} onlyCorrect={false}/>
                  </tbody>
                </Table>
              }
            </Card.Body>
            <Card.Footer className='text-end'>
              <Button className='btn btn-danger' onClick={handleDeleteUser}>Delete User</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile;
