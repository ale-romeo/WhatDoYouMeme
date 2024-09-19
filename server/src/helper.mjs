import { validationResult } from "express-validator"
import { UserAlreadyExistsError, InvalidCredentialsError } from "./errors/userErrors.mjs"
import { ActiveGameAlreadyExistsError, GameNotFoundError, RoundNotFoundError } from "./errors/gameErrors.mjs"

/**
 * La classe ErrorHandler viene utilizzata per gestire gli errori nell'applicazione.
 */
class ErrorHandler {

    /**
     * Valida l'oggetto richiesta e restituisce un errore se l'oggetto richiesta non è formattato correttamente, secondo i middleware utilizzati durante la definizione della richiesta.
     * @param req - L'oggetto richiesta
     * @param res - L'oggetto risposta
     * @param next - La funzione next
     * @returns Restituisce la funzione next se non ci sono errori o una risposta con un codice di stato 422 se ci sono errori.
     */
    validateRequest(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let error = "I parametri non sono formattati correttamente\n\n"
            errors.array().forEach((e) => {
                error += "- Parametro: **" + e.param + "** - Motivo: *" + e.msg + "* - Posizione: *" + e.location + "*\n\n"
            })
            return res.status(422).json({ error: error })
        }
        return next()
    }

    /**
     * Registra il gestore degli errori.
     * @param router - L'oggetto router
     */
    static registerErrorHandler(router) {
        router.use((err, req, res, next) => {
            if (err instanceof InvalidCredentialsError ||
                err instanceof ActiveGameAlreadyExistsError ||
                err instanceof GameNotFoundError ||
                err instanceof RoundNotFoundError ||
                err instanceof UserAlreadyExistsError
            ) {
                return res.status(err.customCode).json({
                    error: err.customMessage,
                    status: err.customCode
                })
            }
            console.error("Errore non gestito:", err);
            return res.status(err.customCode || 503).json({
                error: err.customMessage || "Errore interno del server",
                status: err.customCode || 503
            });
        })
    }
}

export default ErrorHandler
