class DeleteAccountController {
  constructor(service) {
    this.service = service;
  }

  // Public endpoint — anyone can submit a request
  async createRequest(req, res, next) {
    try {
      const { email, reason } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      const result = await this.service.createRequest(email, reason || '');
      res.status(201).json({ success: true, message: 'Delete request submitted', data: result });
    } catch (error) {
      next(error);
    }
  }

  // Admin — list all requests
  async getAllRequests(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;
      const result = await this.service.getAllRequests(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  // Admin — mark as resolved / rejected
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['pending', 'resolved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      const result = await this.service.updateStatus(id, status);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeleteAccountController;
