const BcryptHasher = require("../../utility/BcryptPasswordHasher");

class UserService extends BcryptHasher{
    constructor(prismaClient) {
        super();
        this.prisma = prismaClient;
      }
      async createUser(data) {
        try {
          const hashedPassword = await this.hash(data.password,10)
          console.log(hashedPassword);
           
          return await this.prisma.user.create({
            data: {
              email: data.email,
              password: hashedPassword,
              phone: data.phone,
              role: data.role,
              name: data.name,
            }
          });
        } catch (error) {
          console.log(error);
          
          throw new Error('Database error: Unable to create admin');
        }
      }

      async getAllUsers() {
        try {
          return await this.prisma.user.findMany();
        } catch (error) {
          console.error("Error fetching users:", error);
          throw new Error("Database error: Unable to fetch users");
        }
      }
    
      // Get a single user by ID
      async getSingleUser(userId) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });
    
          if (!user) {
            throw new Error(`User with ID ${userId} not found`);
          }
    
          return user;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("Database error: Unable to fetch user");
        }
      }
    
      // Update a user by ID
      async updateUser(userId, data) {
        try {
          if (data.password) {
            // Hash the password if it's being updated
            data.password = await this.hash(data.password, 10);
          }
    
          const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data,
          });
    
          return updatedUser;
        } catch (error) {
          console.error("Error updating user:", error);
          throw new Error("Database error: Unable to update user");
        }
      }
    
      // Delete a user by ID
      async deleteUser(userId) {
        try {
          await this.prisma.user.delete({
            where: { id: userId },
          });
    
          return { message: `User with ID ${userId} deleted successfully` };
        } catch (error) {
          console.error("Error deleting user:", error);
          throw new Error("Database error: Unable to delete user");
        }
      }
}

module.exports = UserService;