const TokenHandler = require("./tokenHandler");

const auth =(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
   const tokenHandler = new TokenHandler();
   const decode=  tokenHandler.verifyToken(token,"key123");
   console.log(decode);
    if (!decode) {
        return res.status(401).json({ message: 'Invalid token' });
    }
   
   req.user=decode;

    next();
   

}
module.exports = auth;