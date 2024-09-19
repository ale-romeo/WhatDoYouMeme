import GameDAO from "../dao/gameDAO.mjs";
import RoundDAO from "../dao/roundDAO.mjs";
import MemeDAO from "../dao/memeDAO.mjs";
import CaptionDAO from "../dao/captionDAO.mjs";
import { Game, GuestGame } from "../models/game.mjs";
import { Round, GuestRound } from "../models/round.mjs";
import { GameNotFoundError, RoundNotFoundError, CaptionNotFoundError, ActiveGameAlreadyExistsError } from "../errors/gameErrors.mjs";

/**
 * Controller per gestire le operazioni relative ai giochi.
 */
class GameController {
    /**
     * Costruttore della classe GameController.
     * Inizializza i DAO necessari per accedere ai dati di giochi, round, meme e didascalie.
     */
    constructor() {
        this.dao = new GameDAO();
        this.roundDAO = new RoundDAO();
        this.memeDAO = new MemeDAO();
        this.captionDAO = new CaptionDAO();
    }
    
    /**
     * Crea un nuovo gioco per un utente.
     * @param {User} user - L'utente che sta creando il gioco.
     * @returns {Promise<Game>} - Il gioco creato.
     * @throws {ActiveGameAlreadyExistsError} - Se l'utente ha già un gioco attivo.
     */
    async createGame(user) {
        try {
            const game = await this.dao.getActiveGameByUsername(user.username);
            if (game) {
                throw new ActiveGameAlreadyExistsError();
            }
            return await this.dao.createGame(user.username);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Crea un nuovo gioco per un ospite.
     * @returns {Promise<GuestGame>} - Il gioco creato per l'ospite.
     */
    async createGuestGame() {
        const meme = await this.memeDAO.getRandomMeme([]);
        const captions = await this.memeDAO.getCaptionsForMeme(meme.id);
        const round = new GuestRound(meme, captions, 1);
        return new GuestGame(0, 1, round);
    }

    /**
     * Recupera un gioco per ID e verifica se appartiene all'utente.
     * @param {User} user - L'utente che sta richiedendo il gioco.
     * @param {number} gameId - L'ID del gioco da recuperare.
     * @returns {Promise<Game>} - Il gioco recuperato.
     * @throws {GameNotFoundError} - Se il gioco non esiste o non appartiene all'utente.
     */
    async getGame(user, gameId) {
        try {
            const game = await this.dao.getGameById(gameId);
            if (!game || game.username !== user.username) {
                throw new GameNotFoundError();
            }
            return game;
        } catch (error) {
            return error;
        }
    }

    /**
     * Recupera il round corrente di un gioco.
     * @param {number} gameId - L'ID del gioco.
     * @returns {Promise<Round>} - Il round corrente.
     * @throws {GameNotFoundError} - Se il gioco non esiste o è terminato.
     */
    async getCurrentRound(gameId) {
        try {
            const game = await this.dao.getGameById(gameId);
            if (!game || game.status === 0) {
                throw new GameNotFoundError();
            }
            for (let roundId of game.rounds) {
                const round = await this.roundDAO.getRoundById(roundId);
                if (round.status === 1) {
                    return round;
                }
            }
            return null;
        } catch (error) {
            return error;
        }
    }

    /**
     * Registra il risultato di un round.
     * @param {number} gameId - L'ID del gioco.
     * @param {number} captionId - L'ID della didascalia selezionata.
     * @returns {Promise<boolean>} - Se la risposta è corretta.
     * @throws {GameNotFoundError | RoundNotFoundError | CaptionNotFoundError} - Se il gioco, round o didascalia non esistono.
     */
    async registerRound(gameId, captionId) {
        try {
            const game = await this.dao.getGameById(gameId);
            if (!game || game.status === 0) {
                throw new GameNotFoundError();
            }
            let round;
            for (let roundId of game.rounds) {
                const currRound = await this.roundDAO.getRoundById(roundId);
                if (currRound.status === 1) {
                    round = currRound;
                }
            }
            if (!round || round.status === 0) {
                throw new RoundNotFoundError();
            }
            const caption = await this.captionDAO.getCaptionById(captionId);
            if (!caption) {
                throw new CaptionNotFoundError();
            }
            const result = await this.dao.registerRoundResult(gameId, round.id, captionId);
            await this.activateNextRound(gameId, round.id);
            return result;
        } catch (error) {
            return error;
        }
    }

    /**
     * Attiva il round successivo di un gioco.
     * @param {number} gameId - L'ID del gioco.
     * @param {number} currentRoundId - L'ID del round corrente.
     */
    async activateNextRound(gameId, currentRoundId) {
        const game = await this.dao.getGameById(gameId);
        const roundIndex = game.rounds.indexOf(currentRoundId);
        if (roundIndex !== -1 && roundIndex < game.rounds.length - 1) {
            const nextRoundId = game.rounds[roundIndex + 1];
            await this.roundDAO.setActiveRound(nextRoundId);
        }
    }

    /**
     * Termina un gioco.
     * @param {User} user - L'utente che sta terminando il gioco.
     * @param {number} gameId - L'ID del gioco.
     * @returns {Promise<void>}
     * @throws {GameNotFoundError} - Se il gioco non esiste, è già terminato o non appartiene all'utente.
     */
    async finishGame(user, gameId) {
        const game = await this.dao.getGameById(gameId);
        if (!game || game.status === 0 || game.username !== user.username) {
            throw new GameNotFoundError();
        }
        return await this.dao.finishGame(gameId);
    }

    /**
     * Recupera tutti i giochi di un utente.
     * @param {User} user - L'utente di cui recuperare i giochi.
     * @returns {Promise<Game[]>} - I giochi dell'utente.
     * @throws {Error} - Se non vengono trovati giochi.
     */
    async getGamesOfUser(user) {
        const games = await this.dao.getGamesByUsername(user.username);
        if (!games) {
            throw new Error('No games found');
        }
        return games;
    }

    /**
     * Recupera il gioco attivo di un utente.
     * @param {User} user - L'utente di cui recuperare il gioco attivo.
     * @returns {Promise<Game>} - Il gioco attivo.
     * @throws {GameNotFoundError} - Se non viene trovato un gioco attivo.
     */
    async getActiveGame(user) {
        const game = await this.dao.getActiveGameByUsername(user.username);
        if (!game) {
            throw new GameNotFoundError();
        }
        return game;
    }
}

export default GameController;
