import express from "express"
import { param } from "express-validator"
import ErrorHandler from "../helper.mjs"
import CaptionController from "../controllers/captionController.mjs"

/**
 * Classe che definisce le rotte per la gestione delle caption.
 */
class CaptionRoutes {
    /**
     * Costruttore della classe CaptionRoutes.
     * @param {Authenticator} authenticator - Il servizio di autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.router = express.Router() // Router di Express
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.controller = new CaptionController() // Controller per le caption
        this.initRoutes() // Inizializzazione delle rotte
    }

    /**
     * Restituisce il router di Express.
     * @returns {express.Router} Il router di Express.
     */
    getRouter(){
        return this.router
    }

    /**
     * Inizializza le rotte per la gestione delle caption.
     */
    initRoutes() {
        this.router.get(
            "/:captionId",
            param("captionId").notEmpty().isString(), // Validazione del parametro captionId
            (req, res, next) => this.controller.getCaptionById(req.params.captionId)
                .then((caption) => res.status(200).json(caption)) // Risposta con lo stato 200 e la caption in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
    }
}

export default CaptionRoutes
