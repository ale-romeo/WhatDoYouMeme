import express from "express"
import { body, param } from "express-validator"
import ErrorHandler from "../helper.mjs"
import GameController from "../controllers/gameController.mjs"

/**
 * Classe che definisce le rotte per la gestione dei giochi.
 */
class GameRoutes {
    /**
     * Costruttore della classe GameRoutes.
     * @param {Authenticator} authenticator - Il servizio di autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.router = express.Router() // Router di Express
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.controller = new GameController() // Controller per i giochi
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
     * Inizializza le rotte per la gestione dei giochi.
     */
    initRoutes() {
        // Rotta per la creazione di un nuovo gioco per utenti autenticati
        this.router.post(
            "/new",
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.createGame(req.user)
                .then((game) => res.status(200).json(game)) // Risposta con lo stato 200 e il gioco in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per la creazione di un nuovo gioco per utenti ospiti
        this.router.post(
            "/new-guest",
            (req, res, next) => this.controller.createGuestGame()
                .then((game) => res.status(200).json(game)) // Risposta con lo stato 200 e il gioco in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per ottenere tutti i giochi di un utente autenticato
        this.router.get(
            "/all",
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.getGamesOfUser(req.user)
                .then((games) => res.status(200).json(games)) // Risposta con lo stato 200 e i giochi in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        );
        
        // Rotta per ottenere un gioco specifico per un utente autenticato
        this.router.get(
            "/:gameId",
            param("gameId").notEmpty().isString(), // Validazione del parametro gameId
            this.errorHandler.validateRequest, // Gestione degli errori di validazione
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.getGame(req.user, req.params.gameId)
                .then((game) => res.status(200).json(game)) // Risposta con lo stato 200 e il gioco in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per ottenere il round corrente di un gioco specifico per un utente autenticato
        this.router.get(
            "/:gameId/round",
            param("gameId").notEmpty().isString(), // Validazione del parametro gameId
            this.errorHandler.validateRequest, // Gestione degli errori di validazione
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.getCurrentRound(req.params.gameId)
                .then((round) => res.status(200).json(round)) // Risposta con lo stato 200 e il round in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per registrare il risultato di un round specifico per un gioco specifico per un utente autenticato
        this.router.post(
            "/:gameId/round",
            param("gameId").notEmpty().isString(), // Validazione del parametro gameId
            body("captionId").notEmpty().isNumeric(), // Validazione del parametro captionId
            this.errorHandler.validateRequest, // Gestione degli errori di validazione
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.registerRound(req.params.gameId, req.body.captionId)
                .then((result) => res.status(200).json(result)) // Risposta con lo stato 200 e il risultato in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per terminare un gioco specifico per un utente autenticato
        this.router.post(
            "/:gameId/end",
            param("gameId").notEmpty().isString(), // Validazione del parametro gameId
            this.errorHandler.validateRequest, // Gestione degli errori di validazione
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.finishGame(req.user, req.params.gameId)
                .then(() => res.status(200).end()) // Risposta con lo stato 200 e nessun contenuto
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        // Rotta per ottenere il gioco attivo di un utente autenticato
        this.router.get(
            "/",
            this.authService.isLoggedIn.bind(this.authService), // Middleware di autenticazione
            (req, res, next) => this.controller.getActiveGame(req.user)
                .then((game) => res.status(200).json(game)) // Risposta con lo stato 200 e il gioco in formato JSON
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
        
    }
}

export default GameRoutes;
