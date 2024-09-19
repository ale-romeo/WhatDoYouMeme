import React, { Fragment, useState, useEffect } from 'react'
import { Card, ListGroup } from 'react-bootstrap'

function MemeCard(props) {
  // Destruttura le proprietà passate al componente
  const { meme, captions, onSelectCaption } = props
  // Definisci gli stati del componente
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [timer, setTimer] = useState(30)
  const [showCorrectCaptions, setShowCorrectCaptions] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);

  // Gestisce la selezione di una didascalia
  const handleSelection = async (caption) => {
    if (!isRoundActive) return; // Se il round non è attivo, esci dalla funzione

    setIsRoundActive(false); // Disabilita il round

    setSelectedCaption(caption);
    if ((caption.memeIds).includes(meme.id)) {
      setCorrect(true); // Selezione corretta
    } else {
      setShowCorrectCaptions(true); // Mostra le didascalie corrette
      setCorrect(false); // Selezione errata
      setWrongChoice(true); // Imposta lo stato di scelta errata
    }
    // Reimposta gli stati dopo 3 secondi
    setTimeout(() => {
      onSelectCaption(caption);
      setSelectedCaption(null);
      setCorrect(null);
      setWrongChoice(false);
      setShowCorrectCaptions(false);
    }, 3000);
  };

  useEffect(() => {
    // Gestisce il timeout della selezione
    const handleTimeout = () => {
      handleSelection({ memeIds: [], id: -1 });
    };

    // Inizia il timeout per il round corrente
    const startRoundTimeout = () => {
      setTimer(30); // Resetta il timer
      setIsRoundActive(true); // Attiva il round
      const timeoutId = setTimeout(handleTimeout, 30000);
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1; // Decrementa il timer ogni secondo
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    };

    const cleanup = startRoundTimeout();
    return cleanup;
  }, [meme, captions]); // Esegui questo effetto ogni volta che il meme o le didascalie cambiano

  return (
    <Fragment>
      <Card.Img
        variant="top"
        src={`http://localhost:3001/what-do-you-meme/static/${meme.imageUrl}`}
        alt="Meme"
        style={{
          width: '100%',
          height: '500px',
          objectFit: 'contain'
        }}
      />
      <Card.Body>
        <ListGroup>
          {captions.map(caption => (
            <ListGroup.Item
              key={caption.id}
              action
              onClick={() => handleSelection(caption)}
              style={{
                backgroundColor: selectedCaption && selectedCaption.id === caption.id
                  ? correct ? '#5ED897' : '#D85E5E' // Colore per selezione corretta o errata
                  : showCorrectCaptions && (caption.memeIds).includes(meme.id)
                    ? '#FFA07A' // Colore per mostrare le didascalie corrette
                    : ''
              }}
            >
              {caption.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
        {wrongChoice && (
          <h6 style={{ color: 'red', marginTop: '10px' }} className='text-center'>Wrong Choice! The correct caption(s) is/are highlighted in orange.</h6>
        )}
      </Card.Body>
      <Card.Footer className='text-center' style={{ backgroundColor: '#e83f69' }} >
        <h6 style={{ color: 'aliceblue' }}>{`Time left: ${timer} seconds`}</h6>
      </Card.Footer>
    </Fragment>
  )
}

export default MemeCard
