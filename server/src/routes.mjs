import express from "express"
import morgan from "morgan"
import path from 'path'
import ErrorHandler from "./helper.mjs"
import Authenticator from "./routes/auth.mjs"
import { UserRoutes, AuthRoutes } from "./routes/userRoutes.mjs"
import GameRoutes from "./routes/gameRoutes.mjs"
import MemeRoutes from "./routes/memeRoutes.mjs"
import CaptionRoutes from "./routes/captionRoutes.mjs"
import RoundRoutes from "./routes/roundRoutes.mjs"

const prefix = "/what-do-you-meme"

/**
 * Inizializza le rotte per l'applicazione.
 * 
 * @remarks
 * Questa funzione configura le rotte per l'applicazione.
 * Definisce le rotte per le risorse utente, autenticazione, gioco, meme, caption e round.
 * 
 * @param {express.Application} app - L'istanza dell'applicazione Express.
 */
function initRoutes(app) {
    app.use(morgan("dev")) // Logga le richieste in console
    app.use(express.json({ limit: "25mb" })) // Parsing JSON con limite di 25MB
    app.use(express.urlencoded({ limit: '25mb', extended: true })) // Parsing URL-encoded con limite di 25MB

    /**
     * L'oggetto authenticator è utilizzato per autenticare gli utenti.
     * Protegge le rotte richiedendo agli utenti di essere loggati.
     * Inoltre, protegge le rotte richiedendo agli utenti di avere il ruolo corretto.
     * Tutte le rotte devono avere l'oggetto authenticator per funzionare correttamente.
     */
    const authenticator = new Authenticator(app)
    const userRoutes = new UserRoutes(authenticator)
    const authRoutes = new AuthRoutes(authenticator)
    const gameRoutes = new GameRoutes(authenticator)
    const memeRoutes = new MemeRoutes(authenticator)
    const captionRoutes = new CaptionRoutes(authenticator)
    const roundRoutes = new RoundRoutes(authenticator)

    /**
     * Le rotte per le risorse utente, autenticazione, gioco, meme, caption e round sono definite qui.
     */
    
    // Rotta per servire file statici dalla cartella 'public'
    app.use(`${prefix}/static`, express.static(path.join(path.resolve(), 'public')));
    // Rotte per gli utenti
    app.use(`${prefix}/users`, userRoutes.getRouter())
    // Rotte per le sessioni di autenticazione
    app.use(`${prefix}/sessions`, authRoutes.getRouter())
    // Rotte per i giochi
    app.use(`${prefix}/games`, gameRoutes.getRouter())
    // Rotte per i meme
    app.use(`${prefix}/memes`, memeRoutes.getRouter())
    // Rotte per le caption
    app.use(`${prefix}/captions`, captionRoutes.getRouter())
    // Rotte per i round
    app.use(`${prefix}/rounds`, roundRoutes.getRouter())

    // Registra il gestore degli errori
    ErrorHandler.registerErrorHandler(app)
}

export default initRoutes
