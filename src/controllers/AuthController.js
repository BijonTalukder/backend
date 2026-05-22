const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../services/Authentication/EmailService");
const BcryptHasher = require("../utility/BcryptPasswordHasher");

class AuthController {
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
        this.hasher = new BcryptHasher();
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }

            const user = await this.authService.varifyUser(email, password);

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
            console.error(error);
            next(error);
        }
    }

    async googleLogin(req, res, next) {
        try {
            const user = await this.authService.googleLogin(req.body);
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
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000);

            await this.prisma.user.update({
                where: { email },
                data: { resetToken, resetTokenExpiry },
            });

            const resetLink = `https://backend-eight-lake-96.vercel.app/api/v1/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

            await emailService.sendPasswordReset(email, resetLink);

            res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, email, newPassword } = req.body;
            if (!token || !email || !newPassword) {
                return res.status(400).json({ success: false, message: "Token, email, and new password are required" });
            }

            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
                return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
            }

            const hashedPassword = await this.hasher.hash(newPassword);

            await this.prisma.user.update({
                where: { email },
                data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
            });

            res.status(200).json({ success: true, message: "Password reset successful" });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

module.exports = AuthController;
