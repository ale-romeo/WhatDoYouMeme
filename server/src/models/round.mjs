class Round {
    constructor(id, gameId, memeId, captions, status, score, answer) {
        this.id = id;
        this.gameId = gameId;
        this.memeId = memeId;
        this.captions = captions;
        this.status = status;
        this.score = score;
        this.answer = answer;
    }
}

class GuestRound {
    constructor(meme, captions, status) {
        this.meme = meme;
        this.captions = captions;
        this.status = status;
    }
}

export { Round, GuestRound };
