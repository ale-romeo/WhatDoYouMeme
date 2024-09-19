import roundDAO from '../dao/roundDAO.mjs';

/**
 * Controller per gestire le operazioni relative ai round.
 */
class RoundController {
    /**
     * Costruttore della classe RoundController.
     * Inizializza il DAO per l'accesso ai dati relativi ai round.
     */
    constructor() {
        this.dao = new roundDAO();
    }

    /**
     * Recupera un round specifico per ID.
     * @param {number} roundId - L'ID del round da recuperare.
     * @returns {Promise<Round>} - Il round recuperato.
     */
    async getRound(roundId) {
        return await this.dao.getRoundById(roundId);
    }
}

export default RoundController;
