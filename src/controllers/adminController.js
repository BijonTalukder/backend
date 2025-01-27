class AdminController {
    constructor(adminService) {
      this.adminService = adminService;
    }
  
    async createAdmin(req, res, next) {
      try {
        const result = await this.adminService.createAdmin(req.body);
        res.status(201).json({
          success: true,
          message: 'Admin created successfully',
          data: result,
        });
      } catch (error) {
     
        next(error);
      }
    }
  }
  
  module.exports = AdminController;
  