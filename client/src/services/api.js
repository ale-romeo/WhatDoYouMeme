const baseURL = 'http://localhost:3001/what-do-you-meme/'

/** --------------------- Access APIs --------------------------- */

/**
 * Funzione per effettuare il login dell'utente.
 * @param {string} username - Username dell'utente.
 * @param {string} password - Password dell'utente.
 * @returns {object} - Dati dell'utente loggato.
 */
async function login(username, password) {
    let response = await fetch(baseURL + "sessions", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password },)
    })
    if (response.ok) {
        const user = await response.json()
        return user
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per effettuare il logout dell'utente.
 */
async function logout() {
    await fetch(baseURL + 'sessions/current', { method: 'DELETE', credentials: "include" });
}

/**
 * Funzione per ottenere le informazioni dell'utente corrente.
 * @returns {object} - Dati dell'utente corrente.
 */
async function getUserInfo() {
    const response = await fetch(baseURL + 'sessions/current', { credentials: "include" })
    if (response.ok) return await response.json();
    else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/** ------------------- User APIs ------------------------ */

/**
 * Funzione per registrare un nuovo utente.
 * @param {string} username - Username dell'utente.
 * @param {string} password - Password dell'utente.
 */
async function register(username, password) {
    let response = await fetch(baseURL + "users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password },)
    })
    if (response.ok) {
        return
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per eliminare l'utente corrente.
 */
async function deleteUser() {
    let response = await fetch(baseURL + "users/", {
        method: 'DELETE',
        credentials: "include"
    })
    if (response.ok) {
        return
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/** ------------------- Game APIs ------------------------ */

/**
 * Funzione per creare un nuovo gioco per l'utente registrato.
 * @returns {object} - Dati del nuovo gioco.
 */
async function createGame() {
    const response = await fetch(baseURL + 'games/new', {
        method: 'POST',
        credentials: "include"
    })
    if (response.ok) {
        const game = await response.json()
        return game
    } else {
        const errDetail = await response.json();
        if (errDetail.error === "User already has an active game.") {
            console.log('User already has an active game.')
            return null
        } else {
            throw errDetail
        }
    }
}

/**
 * Funzione per creare un nuovo gioco per un ospite.
 * @returns {object} - Dati del nuovo gioco ospite.
 */
async function createGuestGame() {
    const response = await fetch(baseURL + 'games/new-guest', {
        method: 'POST',
        credentials: "include"
    })
    if (response.ok) {
        const game = await response.json()
        return game
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere i dati di un gioco specifico.
 * @param {number} gameId - ID del gioco.
 * @returns {object} - Dati del gioco.
 */
async function getGame(gameId) {
    const response = await fetch(baseURL + 'games/' + gameId, { credentials: "include" })
    if (response.ok) {
        const game = await response.json()
        return game
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere il round corrente di un gioco specifico.
 * @param {number} gameId - ID del gioco.
 * @returns {object} - Dati del round corrente.
 */
async function getCurrentRound(gameId) {
    const response = await fetch(baseURL + 'games/' + gameId + '/round', { 
        method: 'GET',
        credentials: "include" 
    })
    if (response.ok) {
        const round = await response.json()
        return round
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per registrare il risultato di un round.
 * @param {number} gameId - ID del gioco.
 * @param {number} captionId - ID della didascalia selezionata.
 * @returns {object} - Risultato del round.
 */
async function registerRoundResult(gameId, captionId) {
    const response = await fetch(baseURL + 'games/' + gameId + '/round', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captionId: captionId },)
    })
    if (response.ok) {
        const result = await response.json()
        return result
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per terminare un gioco.
 * @param {number} gameId - ID del gioco.
 */
async function finishGame(gameId) {
    const response = await fetch(baseURL + 'games/' + gameId + '/end', {
        method: 'POST',
        credentials: "include"
    })
    if (response.ok) {
        return
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere tutti i giochi dell'utente corrente.
 * @returns {Array} - Elenco dei giochi.
 */
async function getGames() {
    const response = await fetch(baseURL + 'games/all', { method: 'GET', credentials: "include" });
    if (response.ok) {
        const games = await response.json();
        return games;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

/**
 * Funzione per ottenere il gioco attivo dell'utente corrente.
 * @returns {object} - Dati del gioco attivo.
 */
async function getActiveGame() {
    const response = await fetch(baseURL + 'games', { credentials: "include" })
    if (response.ok) {
        const game = await response.json()
        console.log('Active game:', game)
        return game
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere i dettagli di una didascalia specifica.
 * @param {number} captionId - ID della didascalia.
 * @returns {object} - Dati della didascalia.
 */
async function getCaption(captionId) {
    const response = await fetch(baseURL + 'captions/' + captionId, { credentials: "include" })
    if (response.ok) {
        const caption = await response.json()
        return caption
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere i dettagli di un meme specifico.
 * @param {number} memeId - ID del meme.
 * @returns {object} - Dati del meme.
 */
async function getMeme(memeId) {
    const response = await fetch(baseURL + 'memes/' + memeId, { credentials: "include" })
    if (response.ok) {
        const meme = await response.json()
        return meme
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

/**
 * Funzione per ottenere i dettagli di un round specifico.
 * @param {number} roundId - ID del round.
 * @returns {object} - Dati del round.
 */
async function getRound(roundId) {
    const response = await fetch(baseURL + 'rounds/' + roundId, { credentials: "include" })
    if (response.ok) {
        const round = await response.json()
        return round
    } else {
        const errDetail = await response.json();
        throw errDetail
    }
}

export { login, logout, getUserInfo, register, deleteUser, createGame, createGuestGame, getGame, getCurrentRound, registerRoundResult, finishGame, getGames, getActiveGame, getCaption, getMeme, getRound }
