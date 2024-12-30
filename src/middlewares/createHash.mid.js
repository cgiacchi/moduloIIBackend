import { createHashUtil } from "../utils/hash.util.js";

function createHash(req, res, next) {
        try {
            const hashedPassword = createHashUtil(password);
            req.body.password = hashedPassword;
        return next()
    } catch (error) {
        return next(error);
    }
}

export default createHash;