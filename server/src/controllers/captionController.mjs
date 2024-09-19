import CaptionDAO from '../dao/captionDAO.mjs';

/**
 * Controller per gestire le operazioni relative alle didascalie (captions).
 */
class CaptionController {
    /**
     * Costruttore della classe CaptionController.
     * Inizializza l'oggetto DAO per l'accesso ai dati delle didascalie.
     */
    constructor() {
        this.dao = new CaptionDAO();
    }
    
    /**
     * Recupera una didascalia dal database utilizzando il suo ID.
     * 
     * @param {number} captionId - L'ID della didascalia da recuperare.
     * @returns {Promise<Caption>} Una promessa che risolve nella didascalia recuperata.
     */
    async getCaptionById(captionId) {
        return await this.dao.getCaptionById(captionId);
    }
}

export default CaptionController;
