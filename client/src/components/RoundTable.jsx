import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getRound, getMeme, getCaption } from '../services/api';

function RoundTable(props) {
    const { game, onlyCorrect } = props;
    // URL di base per le immagini dei meme
    const baseURL = 'http://localhost:3001/what-do-you-meme/static/';
    // Stati per memorizzare i dettagli dei meme, dei round, delle risposte e per indicare se sono state trovate risposte corrette
    const [memes, setMemes] = useState({});
    const [rounds, setRounds] = useState({});
    const [answers, setAnswers] = useState({});
    const [hasCorrectAnswers, setHasCorrectAnswers] = useState(false);

    // Recupera i dettagli del round, del meme e della risposta per ogni round del gioco
    useEffect(() => {
        const fetchMemes = async () => {
            const roundsData = {}; // Oggetto per memorizzare i dettagli dei round
            const memesData = {}; // Oggetto per memorizzare i dettagli dei meme
            let correctAnswersFound = false; // Flag per indicare se sono state trovate risposte corrette

            try {
                for (const roundId of game.rounds) {
                    // Recupera i dettagli del round
                    const roundDetails = await getRound(roundId);
                    roundsData[roundId] = roundDetails;

                    // Recupera i dettagli del meme se non sono già stati recuperati
                    if (!memesData[roundDetails.memeId]) {
                        const memeDetails = await getMeme(roundDetails.memeId);
                        memesData[roundDetails.memeId] = memeDetails;
                    }

                    // Recupera la risposta del round
                    if (roundDetails.answer) {
                        const answer = await getCaption(roundDetails.answer);
                        setAnswers((prevAnswers) => ({ ...prevAnswers, [roundId]: answer.text }));

                        // Verifica se la risposta è corretta
                        if ((answer.memeIds || []).includes(roundDetails.memeId)) {
                            correctAnswersFound = true;
                        }
                    } else {
                        setAnswers((prevAnswers) => ({ ...prevAnswers, [roundId]: 'No answer' }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch games:', error);
            }

            // Aggiorna gli stati con i dati recuperati
            setRounds(roundsData);
            setMemes(memesData);
            setHasCorrectAnswers(correctAnswersFound);
        };

        // Avvia il recupero dei dati
        fetchMemes();
    }, [game]);

    // Se `onlyCorrect` è vero e non ci sono risposte corrette, non mostra nulla
    if (onlyCorrect && !hasCorrectAnswers) {
        return '';
    }

    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Meme</th>
                    <th>Answer</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {game.rounds.map((roundId) => (
                    // Verifica se i dati del round e del meme sono stati recuperati e se esiste una risposta per il round
                    rounds[roundId] && memes[rounds[roundId].memeId] && answers.hasOwnProperty(roundId) ? (
                        onlyCorrect ?
                            // Mostra solo i round con punteggio positivo se `onlyCorrect` è vero
                            (rounds[roundId].score > 0 ?
                                <tr key={roundId}>
                                    <td>
                                        <img
                                            src={baseURL + `${memes[rounds[roundId].memeId].imageUrl}`}
                                            alt="Meme"
                                            style={{ width: 50, height: 50 }}
                                        />
                                    </td>
                                    <td>{answers[roundId]}</td>
                                    <td>{rounds[roundId].score}</td>
                                </tr>
                                :
                                '')
                            :
                            // Mostra tutti i round
                            <tr key={roundId}>
                                <td>
                                    <img
                                        src={baseURL + `${memes[rounds[roundId].memeId].imageUrl}`}
                                        alt="Meme"
                                        style={{ width: 50, height: 50 }}
                                    />
                                </td>
                                <td>{answers[roundId]}</td>
                                <td>{rounds[roundId].score}</td>
                            </tr>
                    ) : (
                        ''
                    )
                ))}
            </tbody>
        </Table>
    );
}

export default RoundTable;
