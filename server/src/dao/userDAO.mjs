import db from "../db/db.mjs";
import User from "../models/user.mjs";
import crypto from "crypto";

/**
 * Classe per l'accesso ai dati degli utenti.
 */
class UserDAO {
    
    /**
     * Verifica se l'utente è autenticato confrontando la password fornita con quella memorizzata nel database.
     * 
     * @param {string} username - Il nome utente.
     * @param {string} plainPassword - La password in chiaro.
     * @returns {Promise<boolean>} Una promessa che risolve in true se l'utente è autenticato, altrimenti false.
     */
    getIsUserAuthenticated(username, plainPassword) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT username, password, salt FROM users WHERE username = ?";
            db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                // Se non esiste un utente con il nome utente fornito, o se il sale non è memorizzato, l'utente non è autenticato.
                if (!row || row.username !== username || !row.salt) {
                    resolve(false);
                } else {
                    // Hash della password in chiaro utilizzando il sale, poi confronto con la password hashata memorizzata nel database
                    const hashedPassword = crypto.scryptSync(plainPassword, row.salt, 16);
                    const passwordHex = Buffer.from(row.password, "hex");
                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) resolve(false);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Crea un nuovo utente nel database.
     * 
     * @param {string} username - Il nome utente.
     * @param {string} password - La password.
     * @returns {Promise<boolean>} Una promessa che risolve in true se l'utente è stato creato con successo.
     */
    createUser(username, password) {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync(password, salt, 16);
            const sql = "INSERT INTO users(username, password, salt) VALUES(?, ?, ?)";
            db.run(sql, [username, hashedPassword, salt], (err) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    /**
     * Recupera un utente dal database tramite il nome utente.
     * 
     * @param {string} username - Il nome utente.
     * @returns {Promise<User|null>} Una promessa che risolve in un oggetto User se l'utente è trovato, altrimenti null.
     */
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE username = ?";
            db.get(sql, [username], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new User(row.username, undefined));
            });
        });
    }

    /**
     * Elimina un utente dal database.
     * 
     * @param {User} user - L'utente da eliminare.
     * @returns {Promise<boolean>} Una promessa che risolve in true se l'utente è stato eliminato con successo.
     */
    async deleteUser(user) {
        return new Promise(async (resolve, reject) => {
            await this.deleteUserGames(user.username);

            db.run(`DELETE FROM users WHERE username = ?`, [user.username], function (err) {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    /**
     * Elimina tutti i giochi associati a un utente.
     * 
     * @param {string} username - Il nome utente.
     * @returns {Promise<void>} Una promessa che si risolve quando l'operazione è completata.
     */
    async deleteUserGames(username) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(`SELECT username FROM games WHERE username = ?`, [username], (err, games) => {
                    if (err) reject(err);
                    db.run(`DELETE FROM games WHERE username = ?`, [username], function (err) {
                        if (err) reject(err);
                        resolve();
                    });
                });
            });
        });
    }
}

export default UserDAO;
