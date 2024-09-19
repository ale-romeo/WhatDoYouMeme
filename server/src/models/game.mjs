class Game {
    constructor(id, username, score, status, rounds) {
        this.id = id;
        this.username = username;
        this.score = score;
        this.status = status;
        this.rounds = rounds;
    }
}

class GuestGame {
    constructor(score, status, round) {
        this.score = score;
        this.status = status;
        this.round = round;
    }
}

export { Game, GuestGame };