import db from "../db/db.mjs";
import Caption from "../models/caption.mjs";

/**
 * Classe per l'accesso ai dati delle didascalie (captions).
 */
class CaptionDAO {
    /**
     * Recupera le didascalie associate a un determinato memeId.
     * 
     * @param {number} memeId - L'ID del meme.
     * @returns {Promise<Caption[]>} Una promessa che risolve in un array di oggetti Caption.
     */
    async getCaptionsByMemeId(memeId) {
        // SQL per selezionare didascalie uniche associate a un memeId specifico, ordinate casualmente e limitate a 2 risultati
        const sql = `SELECT DISTINCT captions.id, captions.text, captions.meme_ids FROM captions, json_each(captions.meme_ids) WHERE json_each.value = ? ORDER BY RANDOM() LIMIT 2`;
        
        return new Promise((resolve, reject) => {
            db.all(sql, [memeId], (err, rows) => {
                if (err) reject(err); // Gestione degli errori
                // Mappatura delle righe del risultato in oggetti Caption
                resolve(rows.map(row => new Caption(row.id, row.text, JSON.parse(row.meme_ids))));
            });
        });
    }

    /**
     * Recupera un numero casuale di didascalie non associate a un determinato memeId.
     * 
     * @param {number} count - Il numero di didascalie da recuperare.
     * @param {number} memeId - L'ID del meme da escludere.
     * @returns {Promise<Caption[]>} Una promessa che risolve in un array di oggetti Caption.
     */
    async getRandomCaptions(count, memeId) {
        const sql = "SELECT DISTINCT captions.id, captions.text, captions.meme_ids FROM captions";
        
        return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) reject(err); // Gestione degli errori
                // Filtra le didascalie che non includono il memeId e mappa in oggetti Caption
                const captions = rows.filter(row => !row.meme_ids.includes(memeId)).map(row => new Caption(row.id, row.text, JSON.parse(row.meme_ids)));
                
                // Shuffle delle didascalie utilizzando l'algoritmo di Fisher-Yates
                for (let i = captions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [captions[i], captions[j]] = [captions[j], captions[i]];
                }
    
                // Seleziona le prime 'count' didascalie dopo il shuffle
                const randomCaptions = captions.slice(0, count);
                resolve(randomCaptions);
            });
        });
    }

    /**
     * Recupera una didascalia specifica per ID.
     * 
     * @param {number} captionId - L'ID della didascalia.
     * @returns {Promise<Caption>} Una promessa che risolve in un oggetto Caption.
     */
    async getCaptionById(captionId) {
        const sql = "SELECT * FROM captions WHERE id = ?";
        
        return new Promise((resolve, reject) => {
            db.get(sql, [captionId], (err, row) => {
                if (err) reject(err); // Gestione degli errori
                if (!row) return resolve(new Caption(null, null, [])); // Gestione del caso in cui non esiste una didascalia con l'ID fornito
                // Risolve con un oggetto Caption costruito con i dati recuperati dal database
                resolve(new Caption(row.id, row.text, JSON.parse(row.meme_ids)));
            });
        });
    }
}

export default CaptionDAO;
