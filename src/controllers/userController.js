class UserController {
    constructor(userService) {
      this.userService = userService; 
    }
  
    // Create a new user
    async createUser(req, res, next) {
      try {
        const result = await this.userService.createUser(req.body);
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
          { id: result.id, email: result.email, role: result.role },
          "key123",
          { expiresIn: "1h" }
        );
        res.status(201).json({
          success: true,
          message: 'Login successful',
          token,
          user: result,
        });
      } catch (error) {
        if (error.message === "User already exists with this email") {
          return res.status(409).json({ success: false, message: error.message });
        }
        next(error);
      }
    }

    // Get all users
    async getAllUsers(req, res, next) {
      try {
        const result = await this.userService.getAllUsers();
        console.log(result)
        res.status(200).json({
          success: true,
          message: 'Users fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    // Get a single user by ID
    async getSingleUser(req, res, next) {
      try {
        const userId = req.params.id; 
        const result = await this.userService.getSingleUser(userId);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} fetched successfully`,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    // Update a user by ID
    async updateUser(req, res, next) {
      try {
        const userId = req.params.id; 
        const result = await this.userService.updateUser(userId, req.body);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} updated successfully`,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  
    // Delete a user by ID
    async deleteUser(req, res, next) {
      try {
        const userId = req.params.id; 
        await this.userService.deleteUser(userId);
        res.status(200).json({
          success: true,
          message: `User with ID ${userId} deleted successfully`,
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = UserController;
  