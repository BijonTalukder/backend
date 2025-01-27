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
            
            console.log(user);
            
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            console.log(user)
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                "key123", // Use a secure secret stored in environment variables
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
}



module.exports =AuthController