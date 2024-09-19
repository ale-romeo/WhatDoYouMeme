import express from "express"
import { param } from "express-validator"
import ErrorHandler from "../helper.mjs"
import RoundController from "../controllers/roundController.mjs"

/**
 * Classe che definisce le rotte per la gestione dei round.
 */
class RoundRoutes {
    /**
     * Costruttore della classe RoundRoutes.
     * @param {Authenticator} authenticator - Il servizio di autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.router = express.Router() // Router di Express
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.controller = new RoundController() // Controller per i round
        this.initRoutes() // Inizializzazione delle rotte
    }

    /**
     * Restituisce il router di Express.
     * @returns {express.Router} Il router di Express.
     */
    getRouter() {
        return this.router
    }

    /**
     * Inizializza le rotte per la gestione dei round.
     */
    initRoutes() {
        // Rotta per ottenere un round specifico
        this.router.get(
            "/:roundId",
            param("roundId").notEmpty().isString(), // Validazione del parametro roundId
            this.errorHandler.validateRequest, // Validazione della richiesta
            this.authService.isLoggedIn.bind(this.authService), // Verifica dell'autenticazione dell'utente
            (req, res, next) => this.controller.getRound(req.params.roundId)
                .then((round) => res.status(200).json(round)) // Risposta con lo stato 200 e il round in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
    }
}

export default RoundRoutes;
