import UserDAO from "../dao/userDAO.mjs";
import { UserAlreadyExistsError, UserNotFoundError } from "../errors/userErrors.mjs";

/**
 * Controller per gestire le operazioni relative agli utenti.
 */
class UserController {
  /**
   * Costruttore della classe UserController.
   * Inizializza il DAO per l'accesso ai dati relativi agli utenti.
   */
  constructor() {
    this.dao = new UserDAO();
  }

  /**
   * Crea un nuovo utente.
   * @param {string} username - Il nome utente del nuovo utente.
   * @param {string} password - La password del nuovo utente.
   * @returns {Promise<void>} - Una promessa che si risolve quando l'utente è stato creato.
   * @throws {UserAlreadyExistsError} - Se l'utente con il nome specificato esiste già.
   */
  async createUser(username, password) {
    const user = await this.dao.getUserByUsername(username);
    if (user) {
      throw new UserAlreadyExistsError();
    }
    return await this.dao.createUser(username, password);
  }

  /**
   * Elimina un utente.
   * @param {User} user - L'utente da eliminare.
   * @returns {Promise<void>} - Una promessa che si risolve quando l'utente è stato eliminato.
   * @throws {UserNotFoundError} - Se l'utente specificato non esiste.
   */
  async deleteUser(user) {
    const targetUser = await this.dao.getUserByUsername(user.username);
    if (!targetUser) {
      throw new UserNotFoundError();
    }

    return await this.dao.deleteUser(targetUser);
  }
}

export default UserController;
