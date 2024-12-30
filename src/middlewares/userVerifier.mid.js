import { readByEmail, update } from "../data/mongo/managers/user.manager.js";


async function verifyCode(req, res, next){
    const {email, verificationCode} = req.body;
    const user = await readByEmail(email); 
    let verifies = user.verificationCode === verificationCode;
    if(verifies){
        await update(user._id, {verifiedUser : true})
        return next();
    }else{
        const error = new Error('CODE DOES NOT VERIFY');
        error.statusCode = 401;
        return next(error);
    }
}

export default verifyCode;