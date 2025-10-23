const express = require('express');

const { PrismaClient } = require('@prisma/client');
const AuthController = require('../controllers/AuthController');
const AuthService = require('../services/Authentication/AuthService');

const prisma = new PrismaClient();

const authRouter = express.Router();
const authService = new AuthService(prisma,);
const authController = new AuthController(authService);
authRouter.post("/google",(req, res, next)=>authController.googleLogin(req,res,next))


module.exports = authRouter;
