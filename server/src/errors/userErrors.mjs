const USER_NOT_FOUND = "The user does not exist"
const USER_ALREADY_EXISTS = "The username already exists"
const INVALID_CREDENTIALS = "Invalid credentials"

/**
 * Represents an error that occurs when a user is not found.
 */
class UserNotFoundError extends Error {
    constructor() {
        super()
        this.customMessage = USER_NOT_FOUND
        this.customCode = 404
    }
}


/**
 * Represents an error that occurs when a username is already in use.
 */
class UserAlreadyExistsError extends Error {
    constructor() {
        super()
        this.customMessage = USER_ALREADY_EXISTS
        this.customCode = 409
    }
}

class InvalidCredentialsError extends Error {
    constructor() {
        super()
        this.customMessage = INVALID_CREDENTIALS
        this.customCode = 401
    }
}

export { UserNotFoundError, UserAlreadyExistsError, InvalidCredentialsError }