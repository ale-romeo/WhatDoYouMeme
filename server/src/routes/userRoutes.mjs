import express from "express"
import { body, param } from "express-validator"
import ErrorHandler from "../helper.mjs"
import UserController from "../controllers/userController.mjs"

/**
 * Classe che definisce le rotte per la gestione degli utenti.
 */
class UserRoutes {
    /**
     * Costruttore della classe UserRoutes.
     * @param {Authenticator} authenticator - L'oggetto di autenticazione usato per l'autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.router = express.Router() // Router di Express
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.controller = new UserController() // Controller per la gestione degli utenti
        this.initRoutes() // Inizializza le rotte
    }

    /**
     * Restituisce l'istanza del router.
     * @returns {express.Router} L'istanza del router.
     */
    getRouter(){
        return this.router
    }

    /**
     * Inizializza le rotte per il router degli utenti.
     * 
     * @remarks
     * Questo metodo configura le rotte HTTP per la creazione, il recupero, l'aggiornamento e l'eliminazione dei dati degli utenti.
     * Può (e dovrebbe) applicare middleware di autenticazione, autorizzazione e validazione per proteggere le rotte.
     */
    initRoutes() {

        /**
         * Rotta per la creazione di un utente.
         * Non richiede autenticazione.
         * Richiede i seguenti parametri nel body della richiesta:
         * - username: string. Non può essere vuoto e deve essere unico (un username esistente non può essere usato per creare un nuovo utente).
         * - password: string. Non può essere vuoto.
         * Ritorna un codice di stato 200.
         */
        this.router.post(
            "/",
            body("username").notEmpty().isString(), // Validazione del parametro username
            body("password").notEmpty().isString(), // Validazione del parametro password
            this.errorHandler.validateRequest, // Validazione della richiesta
            (req, res, next) => this.controller.createUser(req.body.username, req.body.password)
                .then((user) => res.status(200).end()) // Risposta con codice di stato 200 se l'utente è stato creato con successo
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
        
        /**
         * Rotta per l'eliminazione di un utente.
         * Ritorna un codice di stato 200.
         */
        this.router.delete(
            "/",
            this.authService.isLoggedIn.bind(this.authService), // Verifica dell'autenticazione dell'utente
            (req, res, next) => this.controller.deleteUser(req.user)
                .then(() => res.status(200).end()) // Risposta con codice di stato 200 se l'utente è stato eliminato con successo
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )
    }
}

/**
 * Classe che definisce le rotte di autenticazione per l'applicazione.
 */
class AuthRoutes {
    /**
     * Costruttore della classe AuthRoutes.
     * @param {Authenticator} authenticator - L'oggetto di autenticazione usato per l'autenticazione.
     */
    constructor(authenticator) {
        this.authService = authenticator // Servizio di autenticazione
        this.errorHandler = new ErrorHandler() // Gestore degli errori
        this.router = express.Router(); // Router di Express
        this.initRoutes(); // Inizializza le rotte
    }

    /**
     * Restituisce l'istanza del router.
     * @returns {express.Router} L'istanza del router.
     */
    getRouter() {
        return this.router
    }

    /**
     * Inizializza le rotte di autenticazione.
     * 
     * @remarks
     * Questo metodo configura le rotte HTTP per il login, il logout e il recupero dell'utente loggato.
     * Può (e dovrebbe) applicare middleware di autenticazione, autorizzazione e validazione per proteggere le rotte.
     */
    initRoutes() {

        /**
         * Rotta per il login di un utente.
         * Non richiede autenticazione.
         * @param username: string. Non può essere vuoto.
         * @param password: string. Non può essere vuoto.
         * Ritorna un errore se l'username rappresenta un utente non esistente o se la password è errata.
         * Ritorna l'utente loggato.
         */
        this.router.post(
            "/",
            body("username").notEmpty().isString(), // Validazione del parametro username
            body("password").notEmpty().isString(), // Validazione del parametro password
            this.errorHandler.validateRequest, // Validazione della richiesta
            (req, res, next) => this.authService.login(req, res, next)
                .then((user) => res.status(200).json(user)) // Risposta con codice di stato 200 e l'utente in formato JSON se il login ha successo
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        /**
         * Rotta per il logout dell'utente attualmente loggato.
         * Richiede che l'utente sia loggato.
         * @returns Un codice di stato 200 se l'utente è stato disconnesso con successo.
         */
        this.router.delete(
            "/current",
            this.authService.isLoggedIn.bind(this.authService), // Verifica dell'autenticazione dell'utente
            (req, res, next) => this.authService.logout(req, res, next)
                .then(() => res.status(200).end()) // Risposta con codice di stato 200 se il logout ha successo
                .catch((err) => next(err)) // Passaggio dell'errore al middleware successivo
        )

        /**
         * Rotta per recuperare l'utente attualmente loggato.
         * Richiede che l'utente sia loggato.
         * Ritorna l'utente loggato.
         */
        this.router.get(
            "/current",
            this.authService.isLoggedIn.bind(this.authService), // Verifica dell'autenticazione dell'utente
            (req, res) => res.status(200).json(req.user) // Risposta con codice di stato 200 e l'utente in formato JSON
        )
    }
}

export { UserRoutes, AuthRoutes }
