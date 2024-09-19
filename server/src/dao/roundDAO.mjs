import db from "../db/db.mjs";
import { Round } from "../models/round.mjs";
import MemeDAO from "./memeDAO.mjs";
import CaptionDAO from "./captionDAO.mjs";

/**
 * Classe per l'accesso ai dati dei round (turni).
 */
class RoundDAO {
    /**
     * Costruttore della classe RoundDAO.
     * Inizializza gli oggetti DAO per i meme e le didascalie.
     */
    constructor() {
        this.memeDAO = new MemeDAO();
        this.captionDAO = new CaptionDAO();
    }

    /**
     * Crea un nuovo round per un determinato gioco e meme.
     * Recupera le didascalie per il meme specificato e le inserisce nel database.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @param {number} memeId - L'ID del meme.
     * @returns {Promise<Round>} Una promessa che risolve in un oggetto Round.
     */
    async createRound(gameId, memeId) {
        const captions = (await this.memeDAO.getCaptionsForMeme(memeId)).map(caption => caption.id);

        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO rounds (game_id, meme_id, captions, status) VALUES (?, ?, ?, ?)";
            db.run(sql, [gameId, memeId, JSON.stringify(captions), 0], function (err) {
                if (err) reject(err);
                resolve(new Round(this.lastID, gameId, memeId, captions, 0, 0, null));
            });
        });
    }

    /**
     * Imposta un round come attivo.
     * 
     * @param {number} roundId - L'ID del round.
     * @returns {Promise<void>} Una promessa che si risolve quando l'operazione è completata.
     */
    async setActiveRound(roundId) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE rounds SET status = 1 WHERE id = ?";
            db.run(sql, [roundId], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /**
     * Recupera un round per ID.
     * 
     * @param {number} roundId - L'ID del round.
     * @returns {Promise<Round>} Una promessa che risolve in un oggetto Round.
     */
    async getRoundById(roundId) {
        const sql = "SELECT * FROM rounds WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [roundId], (err, row) => {
                if (err) reject(err);
                if (!row) return reject(null);
                resolve(new Round(row.id, row.game_id, row.meme_id, JSON.parse(row.captions), row.status, row.score, row.answer));
            });
        });
    }

    /**
     * Recupera l'ID del meme associato a un determinato round.
     * 
     * @param {number} roundId - L'ID del round.
     * @returns {Promise<number>} Una promessa che risolve in un ID di meme.
     */
    async getMemeIdByRoundId(roundId) {
        console.log(roundId)
        const sql = "SELECT meme_id FROM rounds WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [roundId], (err, row) => {
                if (err) reject(err);
                if (!row) return reject(null);
                resolve(row.meme_id);
            });
        });
    }
}

export default RoundDAO;
