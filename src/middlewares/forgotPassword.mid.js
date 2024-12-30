import { readByEmail, update } from "../data/mongo/managers/user.manager.js";
import envUtil from "../utils/env.util.js";
import { sendResetPasswordEmail } from "../utils/nodemailer.util.js";
import { createTokenUtil, verifyTokenUtil } from "../utils/token.util.js";
import { createHashUtil } from "../utils/hash.util.js";

const {API_BASE_URL} = envUtil;

async function sendTokenEmail(req, res, next){
    const {email} = req.body;
    try {
        const one = await readByEmail(email);
        if (one) {
        const data = {userId : one._id};
        const token = createTokenUtil(data) 
        const url = `${API_BASE_URL}/api/sessions/passwordreset?t=${token}`;
        await sendResetPasswordEmail(one.email, url);    }
    } catch (error) {
        return next(error);
        }
}


async function confirmResetPassword(req,res,next){
    const {token, newPassword} = req.body;
    try {
        const verifies = verifyTokenUtil(token);
        const userId = verifies.userId;
        const hashedPwd = createHashUtil(newPassword)
        await update(userId, {password: hashedPwd});
        return next();
    } catch (error) {
        return next(error)
    }
}

export {sendTokenEmail, confirmResetPassword};