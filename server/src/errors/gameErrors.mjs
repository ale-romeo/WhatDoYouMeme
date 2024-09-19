const GAME_NOT_FOUND = "The game does not exist"
const ROUND_NOT_FOUND = "The round does not exist"
const CAPTION_NOT_FOUND = "The caption does not exist"
const ACTIVE_GAME_ALREADY_EXISTS = "User already has an active game."

class GameNotFoundError extends Error {
    constructor() {
        super()
        this.customMessage = GAME_NOT_FOUND
        this.customCode = 404
    }
}

class RoundNotFoundError extends Error {
    constructor() {
        super()
        this.customMessage = ROUND_NOT_FOUND
        this.customCode = 404
    }
}

class CaptionNotFoundError extends Error {
    constructor() {
        super()
        this.customMessage = CAPTION_NOT_FOUND
        this.customCode = 404
    }
}

class ActiveGameAlreadyExistsError extends Error {
    constructor() {
        super()
        this.customMessage = ACTIVE_GAME_ALREADY_EXISTS
        this.customCode = 409
    }
}

export { GameNotFoundError, RoundNotFoundError, CaptionNotFoundError, ActiveGameAlreadyExistsError }