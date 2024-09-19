import db from "../db/db.mjs";
import CaptionDAO from "./captionDAO.mjs";
import Meme from "../models/meme.mjs";

/**
 * Classe per l'accesso ai dati dei meme (memes).
 */
class MemeDAO {
    /**
     * Costruttore della classe MemeDAO.
     * Inizializza l'oggetto DAO per le didascalie.
     */
    constructor() {
        this.captionDAO = new CaptionDAO();
    }

    /**
     * Recupera un meme casuale che non è incluso negli ID specificati.
     * 
     * @param {number[]} excludeMemeIds - Un array di ID di meme da escludere.
     * @returns {Promise<Meme>} Una promessa che risolve in un oggetto Meme.
     */
    async getRandomMeme(excludeMemeIds) {
        let sql;
        let params;
        if (excludeMemeIds.length === 0) {
            sql = "SELECT * FROM memes ORDER BY RANDOM() LIMIT 1";
            params = [];
        } else {
            const placeholders = excludeMemeIds.map(() => '?').join(',');
            sql = `SELECT * FROM memes WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`;
            params = excludeMemeIds;
        }
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                if (!row) return reject(null);
                resolve(new Meme(row.id, row.imageUrl));
            });
        });
    }

    /**
     * Recupera le didascalie per un meme specificato.
     * Combina didascalie corrette e casuali, quindi le mescola.
     * 
     * @param {number} memeId - L'ID del meme.
     * @returns {Promise<Caption[]>} Una promessa che risolve in un array di didascalie.
     */
    async getCaptionsForMeme(memeId) {
        const correctCaptions = await this.captionDAO.getCaptionsByMemeId(memeId);
        const randomCaptions = await this.captionDAO.getRandomCaptions(5, memeId);
        return this.shuffleArray([...correctCaptions, ...randomCaptions]);
    }

    /**
     * Mescola un array in ordine casuale.
     * 
     * @param {any[]} array - L'array da mescolare.
     * @returns {any[]} L'array mescolato.
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Recupera un meme per ID.
     * 
     * @param {number} memeId - L'ID del meme.
     * @returns {Promise<Meme>} Una promessa che risolve in un oggetto Meme.
     */
    getMemeById(memeId) {
        const sql = "SELECT * FROM memes WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [memeId], (err, row) => {
                if (err) reject(err);
                if (!row) return reject(null);
                resolve(new Meme(row.id, row.imageUrl));
            });
        });
    }
}

export default MemeDAO;
