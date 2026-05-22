const express = require('express');
const router = express.Router();
const DeleteAccountService = require('../services/DeleteAccount/DeleteAccountService');
const DeleteAccountController = require('../controllers/deleteAccountController');

const service = new DeleteAccountService();
const controller = new DeleteAccountController(service);

// Public
router.post('/delete-account-request', (req, res, next) => controller.createRequest(req, res, next));

// Admin (protected)
router.get('/delete-account-requests', (req, res, next) => controller.getAllRequests(req, res, next));
router.patch('/delete-account-requests/:id/status', (req, res, next) => controller.updateStatus(req, res, next));

module.exports = router;
