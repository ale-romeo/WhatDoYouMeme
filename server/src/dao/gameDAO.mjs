import db from "../db/db.mjs";
import { Game } from "../models/game.mjs";
import RoundDAO from "./roundDAO.mjs";
import MemeDAO from "./memeDAO.mjs";
import CaptionDAO from "./captionDAO.mjs";

/**
 * Classe per l'accesso ai dati dei giochi (games).
 */
class GameDAO {
    /**
     * Costruttore della classe GameDAO.
     * Inizializza gli oggetti DAO per i round, i meme e le caption.
     */
    constructor() {
        this.roundDAO = new RoundDAO();
        this.memeDAO = new MemeDAO();
        this.captionDAO = new CaptionDAO();
    }

    /**
     * Crea un nuovo gioco per un utente specificato.
     * 
     * @param {string} username - Il nome utente per il quale creare il gioco.
     * @returns {Promise<Game>} Una promessa che risolve in un oggetto Game.
     */
    async createGame(username) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO games (username, score, status, rounds) VALUES (?, ?, ?, ?)";
            const copyThis = this;

            db.run(sql, [username, 0, 1, JSON.stringify([])], async function (err) {
                if (err) return reject(err);
                const gameId = this.lastID;
                const roundIds = [];
                let memes = [];
                try {
                    for (let i = 0; i < 3; i++) {
                        const meme = await copyThis.memeDAO.getRandomMeme(memes);
                        if (!meme) return reject("No memes found");
                        memes.push(meme.id);
                        const round = await copyThis.roundDAO.createRound(gameId, meme.id);
                        if (!round.id) return reject("Error creating round");
                        roundIds.push(round.id);
                    }
                    await copyThis.roundDAO.setActiveRound(roundIds[0]);
                    await copyThis.updateGameWithRounds(gameId, roundIds);
                    resolve(new Game(gameId, username, 0, 1, roundIds));
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }

    /**
     * Aggiorna un gioco con i round specificati.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @param {number[]} roundIds - Un array di ID dei round.
     * @returns {Promise<void>} Una promessa che risolve quando l'aggiornamento è completato.
     */
    async updateGameWithRounds(gameId, roundIds) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE games SET rounds = ? WHERE id = ?";
            db.run(sql, [JSON.stringify(roundIds), gameId], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /**
     * Recupera un gioco per ID.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @returns {Promise<Game>} Una promessa che risolve in un oggetto Game.
     */
    async getGameById(gameId) {
        const sql = "SELECT * FROM games WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [gameId], (err, row) => {
                if (err) reject(err);
                if (!row) return resolve(null);
                resolve(new Game(row.id, row.username, row.score, row.status, JSON.parse(row.rounds)));
            });
        });
    }

    /**
     * Registra il risultato di un round.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @param {number} roundId - L'ID del round.
     * @param {number} captionId - L'ID della didascalia selezionata.
     * @returns {Promise<boolean>} Una promessa che risolve in un booleano che indica se la didascalia selezionata era corretta.
     */
    async registerRoundResult(gameId, roundId, captionId) {
        const memeId = await this.roundDAO.getMemeIdByRoundId(roundId);
        const caption = await this.captionDAO.getCaptionById(captionId);
        
        const copyThis = this;
        return new Promise((resolve, reject) => {
            const sql = "UPDATE rounds SET score = ?, answer = ?, status = ? WHERE id = ?";
            db.run(sql, [(caption.memeIds).includes(memeId) ? 5 : 0, captionId, 0, roundId], async function (err) {
                if (err) reject(err);
                await copyThis.updateScore(gameId, (caption.memeIds).includes(memeId) ? 5 : 0);
                resolve((caption.memeIds).includes(memeId) ? true : false);
            });
        });
    }

    /**
     * Aggiorna il punteggio di un gioco.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @param {number} score - Il punteggio da aggiungere.
     * @returns {Promise<void>} Una promessa che risolve quando l'aggiornamento è completato.
     */
    async updateScore(gameId, score) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE games SET score = score + ? WHERE id = ?";
            db.run(sql, [score, gameId], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /**
     * Termina un gioco impostandone lo stato a 0.
     * 
     * @param {number} gameId - L'ID del gioco.
     * @returns {Promise<void>} Una promessa che risolve quando l'aggiornamento è completato.
     */
    async finishGame(gameId) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE games SET status = 0 WHERE id = ?";
            db.run(sql, [gameId], function (err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /**
     * Recupera tutti i giochi di un utente.
     * 
     * @param {string} username - Il nome utente.
     * @returns {Promise<Game[]>} Una promessa che risolve in un array di oggetti Game.
     */
    async getGamesByUsername(username) {
        const sql = "SELECT * FROM games WHERE username = ?";
        return new Promise((resolve, reject) => {
            db.all(sql, [username], (err, rows) => {
                if (err) reject(err);
                if (!rows) return resolve([]);
                resolve(rows.map(row => new Game(row.id, row.username, row.score, row.status, JSON.parse(row.rounds))));
            });
        });
    }

    /**
     * Recupera il gioco attivo di un utente.
     * 
     * @param {string} username - Il nome utente.
     * @returns {Promise<Game>} Una promessa che risolve in un oggetto Game o null se non esiste un gioco attivo.
     */
    async getActiveGameByUsername(username) {
        const sql = "SELECT * FROM games WHERE username = ? AND status = 1";
        return new Promise((resolve, reject) => {
            db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                if (!row) return resolve(null);
                resolve(new Game(row.id, row.username, row.score, row.status, JSON.parse(row.rounds)));
            });
        });
    }
}

export default GameDAO;
