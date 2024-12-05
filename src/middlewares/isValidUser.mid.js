import { readByEmail } from "../data/mongo/managers/user.manager.js";

async function isValidUser(req, res, next) {
    try {
        const { email, password } = req.body
        const one = await readByEmail(email);
        if (one) {
            return next()
        }
        const error = new Error("Invalid password")
        error.statusCode = 401
        throw error
    } catch (error) {
        return next(error);
    }
}

export default isValidUser;