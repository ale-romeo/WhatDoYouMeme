import express from "express"
import UserDAO from "../dao/userDAO.mjs"
import session from "express-session"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { InvalidCredentialsError } from "../errors/userErrors.mjs"

/**
 * Rappresenta una classe che definisce le rotte per la gestione dell'autenticazione.
 */
class Authenticator {
    /**
     * Costruisce una nuova istanza della classe Authenticator.
     * @param {express.Application} app - L'applicazione Express.
     */
    constructor(app) {
        this.app = app
        this.dao = new UserDAO()
        this.initAuth()
    }

    /**
     * Inizializza il middleware di autenticazione e configura le strategie di passport.
     * Questo metodo deve essere chiamato prima di utilizzare qualsiasi rotta protetta.
     */
    initAuth() {
        this.app.use(session({
            secret: "giusiepebuonasersa", // Chiave segreta per la sessione
            resave: false, // Non salvare la sessione se non modificata
            saveUninitialized: false, // Non salvare sessioni non inizializzate
            maxAge: 7 * 24 * 60 * 60 * 1000 // Durata della sessione: 7 giorni
        }))

        this.app.use(passport.initialize()) // Inizializza passport
        this.app.use(passport.session()) // Inizializza la sessione di passport

        const copyThis = this

        /**
         * Configura la strategia locale per passport.
         * La strategia locale utilizza UserDAO per verificare se l'utente è autenticato recuperando l'utente dal database e confrontando le password.
         * Se l'utente è autenticato, viene restituito, altrimenti viene restituito un messaggio di errore.
         */
        passport.use(new LocalStrategy(
            async (username, password, done) => {
                try {
                    const user = await copyThis.dao.getUserByUsername(username);
                    const authenticated = await copyThis.dao.getIsUserAuthenticated(username, password);
                    if (authenticated) return done(null, user);
                    else throw new InvalidCredentialsError();
                } catch (err) {
                    return done(err)
                }
            }
        ))

        /**
         * Serializza l'utente nella sessione.
         * Questo metodo viene chiamato quando un utente è autenticato e viene serializzato nella sessione.
         */
        passport.serializeUser((user, done) => done(null, user))

        /**
         * Deserializza l'utente dalla sessione.
         * Questo metodo viene chiamato quando un utente viene deserializzato dalla sessione.
         * Recupera l'utente dal database e lo restituisce.
         * Se l'utente non viene trovato, viene restituito un errore.
         */
        passport.deserializeUser((user, done) => {
            this.dao.getUserByUsername(user.username)
             .then((user) => done(null, user))
              .catch((err) => done(null, err))
        })
    }

    /**
     * Effettua il login di un utente.
     * @param {any} req - L'oggetto richiesta.
     * @param {any} res - L'oggetto risposta.
     * @param {any} next - La funzione next.
     * @returns Una Promise che si risolve con l'utente loggato o si rigetta con un messaggio di errore.
     * @remarks Questo metodo utilizza il metodo passport.authenticate per effettuare il login di un utente.
     * Restituisce una Promise che si risolve con l'utente loggato o si rigetta con un messaggio di errore.
     * Se l'utente è loggato, l'utente viene serializzato nella sessione.
     * Se l'utente non è loggato, viene restituito un messaggio di errore.
     */
    login(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate("local", (err, user, info) => {
                if (err) return reject(err)
                if (!user) return reject(info)

                req.login(user, (err) => {
                    if (err) return reject(err)
                    return resolve(req.user)
                })
            })(req, res, next)
        })
    }

    /**
     * Effettua il logout dell'utente.
     * @param req - L'oggetto richiesta.
     * @param res - L'oggetto risposta.
     * @param next - La funzione middleware successiva.
     * @returns Una Promise che si risolve con null.
     */
    logout(req, res, next) {
        return new Promise((resolve, reject) => {
            req.logout(() => resolve(null))
        })
    }

    /**
     * Funzione middleware per verificare se l'utente è loggato.
     * 
     * @param req - L'oggetto richiesta.
     * @param res - L'oggetto risposta.
     * @param next - La funzione middleware successiva.
     * Se l'utente è autenticato, chiama la funzione middleware successiva. Altrimenti, restituisce una risposta di errore 401.
     */
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next()
        return res.status(401).json({ error: "Unauthenticated user", status: 401 })
    }

}

export default Authenticator
