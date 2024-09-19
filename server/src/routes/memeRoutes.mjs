import express from "express"
import { param } from "express-validator"
import ErrorHandler from "../helper.mjs"
import MemeController from "../controllers/memeController.mjs"

/**
 * Classe che definisce le rotte per la gestione dei meme.
 */
class MemeRoutes {
    /**
     * Costruttore della classe MemeRoutes.
     * @param {Authenticator} authenticator - Il servizio di autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.router = express.Router() // Router di Express
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.controller = new MemeController() // Controller per i meme
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
     * Inizializza le rotte per la gestione dei meme.
     */
    initRoutes() {
        // Rotta per ottenere un meme specifico
        this.router.get(
            "/:memeId",
            param("memeId").notEmpty().isString(), // Validazione del parametro memeId
            (req, res, next) => this.controller.getMemeById(req.params.memeId)
                .then((meme) => res.status(200).json(meme)) // Risposta con lo stato 200 e il meme in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
    }
}

export default MemeRoutes;
