import React, { useState, useEffect, Fragment } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { createGame, createGuestGame, getCurrentRound, registerRoundResult, finishGame, getActiveGame, getMeme, getCaption } from '../services/api'
import MemeCard from './MemeCard'
import RoundTable from './RoundTable'

function Game() {
  // Definizione degli stati per gestire il gioco e le sue componenti
  const [game, setGame] = useState(null)
  const [gameExists, setGameExists] = useState(true)
  const [play, setPlay] = useState(false)
  const [round, setRound] = useState(null)
  const [score, setScore] = useState(0)
  const [meme, setMeme] = useState(null)
  const [captions, setCaptions] = useState([])
  const { user } = useAuth()

  // Funzione per gestire la selezione di una didascalia
  const handleCaptionSelect = async (caption) => {
    try {
      if (!user) { // Modalità ospite
        if (caption.id === -1) setScore(0); // Se la didascalia è vuota, resetta il punteggio
        else setScore(score => score + ((caption.memeIds).includes(round.meme.id) ? 5 : 0)); // Aggiunge punti se la risposta è corretta
        setPlay(false); // Termina il gioco per l'ospite
      } else { // Modalità utente registrato
        await registerRoundResult(game.id, caption.id); // Registra il risultato del round
        const nextRound = await getCurrentRound(game.id); // Ottiene il round successivo
        if (nextRound) {
          const nextMeme = await getMeme(nextRound.memeId);
          const nextCaptions = await Promise.all((nextRound.captions).map(async captionId => await getCaption(captionId)));
          setRound(nextRound);
          setMeme(nextMeme);
          setCaptions(nextCaptions);
        } else {
          const activeGame = await getActiveGame();
          await finishGame(game.id); // Termina il gioco corrente
          setGame(activeGame);
          setScore(activeGame.score);
          setPlay(false);
        }
      }
    } catch (error) {
      console.error('Failed to register round result:', error)
    }
  }

  // Funzione per gestire l'adesione a un gioco esistente
  const handleJoinGame = async () => {
    try {
      const activeGame = await getActiveGame()
      const activeRound = await getCurrentRound(activeGame.id)
      const activeMeme = await getMeme(activeRound.memeId)
      const activeCaptions = await Promise.all((activeRound.captions).map(async captionId => await getCaption(captionId)))
      setMeme(activeMeme)
      setCaptions(activeCaptions)
      setRound(activeRound)
      setGame(activeGame)
      setGameExists(false)
    } catch (error) {
      console.error('Failed to join game:', error)
    }
  }

  // Funzione per gestire la creazione di un nuovo gioco
  const handleNewGame = async () => {
    try {
      const activeGame = await getActiveGame()
      await finishGame(activeGame.id);
      const newGame = await createGame();
      const initialRound = await getCurrentRound(newGame.id);
      const initialMeme = await getMeme(initialRound.memeId);
      const initialCaptions = await Promise.all(initialRound.captions.map(async captionId => await getCaption(captionId)));
      setScore(0);
      setMeme(initialMeme);
      setCaptions(initialCaptions);
      setRound(initialRound);
      setGame(newGame);
      setGameExists(false);
    } catch (error) {
      console.error('Failed to create new game:', error)
    }
  }

  // Funzione per avviare un nuovo gioco
  const handlePlay = async () => {
    try {
      setScore(0)
      setRound(null)
      setGame(null)
      setMeme(null)
      setCaptions([])

      let activeGame;
      if (!user) { // Modalità ospite
        activeGame = await createGuestGame()
        setGame(activeGame)
        setRound(activeGame.round)
      } else { // Modalità utente registrato
        activeGame = await createGame()
        if (!activeGame) {
          setGameExists(true)
          setPlay(true)
          return
        }
        console.log('Game created:', activeGame)
        const initialRound = await getCurrentRound(activeGame.id)
        const initialMeme = await getMeme(initialRound.memeId)
        const initialCaptions = await Promise.all(initialRound.captions.map(async captionId => await getCaption(captionId)))
        setMeme(initialMeme)
        setCaptions(initialCaptions)
        setRound(initialRound)
        setGame(activeGame)
        setGameExists(false)
      }
      setPlay(true)
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }

  // Stile del card
  const cardStyle = {
    boxShadow: '0 15px 25px rgba(129, 124, 124, 0.2)',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '15px'
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6}>
          <Card style={cardStyle}>
            {!play ?
              <Fragment>
                <Card.Header style={{ backgroundColor: '#e83f69' }} >
                  <Card.Title className='text-center'>
                    <img src="src/assets/logo_nav.png" alt="logocard" style={{ width: '200px' }} />
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {!user ?
                    <Fragment>
                      <h4 style={{ color: '#6830D7' }} className='text-center'>{'Guest Game'}</h4>
                      <h6>Last Game Score: {score}</h6>
                    </Fragment>
                    :
                    (!game ?
                      <h4 style={{ color: 'black', marginBottom: '40px', fontFamily: 'Dinofiles' }} className='text-center'>{'Welcome back, '}{user.username}</h4>
                      :
                      <Fragment>
                        <h4 style={{ color: 'black', marginBottom: '40px', fontFamily: 'Dinofiles' }} className='text-center'>{'Well played, '}{user.username}{'!'}</h4>
                        <h6 style={{ marginBottom: '40px' }}>Last Game Score: {score}</h6>
                        <RoundTable game={game} onlyCorrect={true} />
                      </Fragment>
                    )
                  }
                  <Button style={{ backgroundColor: '#6830D7', width: '100%' }} onClick={handlePlay}>
                    {'Play'}
                  </Button>
                </Card.Body>
              </Fragment>
              :
              (!user ?
                <Fragment>
                  <Card.Header style={{ backgroundColor: '#e83f69' }} >
                    <Card.Title className='text-center'>
                      <img src="src/assets/logo_nav.png" alt="logocard" style={{ width: '200px' }} />
                    </Card.Title>
                    <Card.Title className='text-center'>
                      <em style={{ color: 'aliceblue' }}>{'Guest Game'}</em>
                    </Card.Title>
                  </Card.Header>
                  <MemeCard meme={round.meme} captions={round.captions} onSelectCaption={handleCaptionSelect} />
                </Fragment>
                :
                (gameExists ?
                  <Fragment>
                    <Card.Header style={{ backgroundColor: '#e83f69' }}>
                      <Card.Title className='text-center'>
                        <img src="src/assets/logo_nav.png" alt="logocard" style={{ width: '200px' }} />
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className='text-center'>
                      <h4 style={{ color: 'black', marginBottom: '40px' }} className='text-center'>{'Welcome back, '}{user.username}</h4>
                      <p><strong>A game already exist.</strong></p>
                    </Card.Body>
                    <Card.Footer className='align-items-center'>
                      <Row className="justify-content-center align-items-center">
                        <Col md={3}>
                          <Button style={{ backgroundColor: '#6830D7', width: 'auto' }} onClick={handleJoinGame}>
                            {'Join Game'}
                          </Button>
                        </Col>
                        <Col md={3}>
                          <Button style={{ backgroundColor: '#6830D7', width: 'auto' }} onClick={handleNewGame}>
                            {'New Game'}
                          </Button>
                        </Col>
                      </Row>
                    </Card.Footer>
                  </Fragment>
                  :
                  <Fragment>
                    <Card.Header style={{ backgroundColor: '#e83f69' }} >
                      <Card.Title className='text-center'>
                        <img src="src/assets/logo_nav.png" alt="logocard" style={{ width: '200px' }} />
                      </Card.Title>
                    </Card.Header>
                    <MemeCard meme={meme} captions={captions} onSelectCaption={handleCaptionSelect} />
                  </Fragment>
                )
              )
            }
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Game
