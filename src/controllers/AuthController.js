const jwt = require("jsonwebtoken");


class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });

            }

            const user = await this.authService.varifyUser(email, password)
            // console.log("---asdf",user)
            
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                "key123", 
                { expiresIn: "1h" } 
              );
              return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user
              });

        } catch (error) {
            console.error(error)
            next(error)
        }
    }

    async googleLogin(req,res,next){
        try {
        // const { email, firebaseUid, name, avatar, authProvider } = req.body;

            const user = await this.authService.googleLogin(req.body)
             if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                "key123", 
                { expiresIn: "1h" } 
              );
              return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user
              });

            
        } catch (error) {
            next(error)
            
        }

    }
}



module.exports =AuthController