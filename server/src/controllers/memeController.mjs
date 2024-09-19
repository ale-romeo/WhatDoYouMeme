import MemeDAO from "../dao/memeDAO.mjs";

/**
 * Controller per gestire le operazioni relative ai meme.
 */
class MemeController {
    /**
     * Costruttore della classe MemeController.
     * Inizializza il DAO per l'accesso ai dati relativi ai meme.
     */
    constructor() {
        this.dao = new MemeDAO();
    }
    
    /**
     * Recupera un meme specifico per ID.
     * @param {number} memeId - L'ID del meme da recuperare.
     * @returns {Promise<Meme>} - Il meme recuperato.
     */
    async getMemeById(memeId) {
        return await this.dao.getMemeById(memeId);
    }
}

export default MemeController;
