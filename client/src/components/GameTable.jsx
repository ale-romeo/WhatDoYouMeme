import { Button } from 'react-bootstrap';
import { useState } from 'react';
import RoundTable from './RoundTable';
import { Fragment } from 'react';

function GameTable(props) {
    const { games } = props; // Estrae i giochi passati come proprietà
    const [expandedGame, setExpandedGame] = useState(null) // Stato per tracciare il gioco espanso

    // Funzione per ottenere il testo dello stato del gioco
    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return 'Active';
            case 0:
                return 'Finished';
            default:
                return 'Unknown';
        }
    };

    // Funzione per espandere o comprimere la visualizzazione dei round del gioco
    const toggleExpand = (gameId) => {
        setExpandedGame(expandedGame === gameId ? null : gameId) // Se il gioco è già espanso, lo comprime e viceversa
    }

    return (
        games.map(game => (
            <Fragment key={game.id}>
                {/* Riga principale del gioco */}
                <tr onClick={() => toggleExpand(game.id)}>
                    <td>{game.id}</td>
                    <td>{game.score}</td>
                    <td>{getStatusText(game.status)}</td>
                    <td>
                        <Button
                            style={{ backgroundColor: '#6830D7' }}
                            onClick={() => toggleExpand(game.id)}>
                            {expandedGame === game.id ? 'Hide Rounds' : 'Show Rounds'} {/* Testo del pulsante cambia a seconda dello stato */}
                        </Button>
                    </td>
                </tr>
                {/* Riga espandibile per i round del gioco */}
                {expandedGame === game.id && (
                    <tr>
                        <td colSpan="4">
                            <RoundTable game={game} onlyCorrect={false} /> {/* Visualizza la tabella dei round */}
                        </td>
                    </tr>
                )}
            </Fragment>
        ))
    );
}

export default GameTable;
