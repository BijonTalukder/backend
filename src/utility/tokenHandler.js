const jwt = require("jsonwebtoken");

class TokenHandler{
    generateToken(data,key,expiresIn){
        jwt.sign(data,key,{expiresIn},(err,token)=>{
            if(err) {
                throw new Error('Token generation failed');
            }
            return token;
        });
    }
    verifyToken(token, key) {
        try {
            return jwt.verify(token, key);
        } catch (error) {
            throw new Error('Token verification failed');
        }
    }
    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Token decoding failed');
        }
    }

}
module.exports = TokenHandler;