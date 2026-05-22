const express = require('express');

const { PrismaClient } = require('@prisma/client');
const AuthController = require('../controllers/AuthController');
const AuthService = require('../services/Authentication/AuthService');
const BcryptHasher = require('../utility/BcryptPasswordHasher');

const prisma = new PrismaClient();

const authRouter = express.Router();
const hasher = new BcryptHasher();
const authService = new AuthService(prisma, hasher);
const authController = new AuthController(authService, prisma);

authRouter.post("/google", (req, res, next) => authController.googleLogin(req, res, next));
authRouter.post("/forgot-password", (req, res, next) => authController.forgotPassword(req, res, next));
authRouter.post("/reset-password", (req, res, next) => authController.resetPassword(req, res, next));

authRouter.get("/reset-password", (req, res) => {
  const { token, email } = req.query;
  res.send(`
    <!DOCTYPE html>
    <html><head><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Reset Password</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:-apple-system,sans-serif;background:#0a0a14;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
      .card{background:#141422;border-radius:16px;padding:32px;width:100%;max-width:400px;border:1px solid rgba(255,255,255,0.08)}
      h2{margin-bottom:8px}.sub{color:#64748b;font-size:14px;margin-bottom:24px}
      input{width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.05);color:#e2e8f0;font-size:15px;outline:none;margin-bottom:16px}
      button{width:100%;padding:12px;border:none;border-radius:10px;background:#7c3aed;color:#fff;font-size:15px;font-weight:600;cursor:pointer}
      button:hover{background:#6d28d9}
      #msg{margin-top:16px;text-align:center;font-size:14px}
    </style></head><body>
    <div class="card">
      <h2>Reset password</h2>
      <p class="sub">Enter your new password</p>
      <input type="password" id="password" placeholder="New password" autocomplete="new-password" />
      <input type="password" id="confirm" placeholder="Confirm new password" />
      <button onclick="reset()">Reset Password</button>
      <div id="msg"></div>
    </div>
    <script>
      async function reset(){
        const p=document.getElementById('password').value;
        const c=document.getElementById('confirm').value;
        const m=document.getElementById('msg');
        if(!p||!c){m.style.color='#ef4444';m.textContent='Please fill in both fields';return}
        if(p!==c){m.style.color='#ef4444';m.textContent='Passwords do not match';return}
        if(p.length<6){m.style.color='#ef4444';m.textContent='Password must be at least 6 characters';return}
        try{
          const r=await fetch('/api/v1/auth/reset-password',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({token:'${token}',email:'${email}',newPassword:p})
          });
          const d=await r.json();
          if(d.success){m.style.color='#22c55e';m.textContent='Password reset successful! You can close this page.'}
          else{m.style.color='#ef4444';m.textContent=d.message||'Reset failed'}
        }catch(e){m.style.color='#ef4444';m.textContent='Network error'}
      }
    </script></body></html>
  `);
});

module.exports = authRouter;
