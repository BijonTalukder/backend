const crypto = require("crypto");
const BcryptHasher = require("../../utility/BcryptPasswordHasher");

const SALT_ROUNDS = 10;

class UserService extends BcryptHasher {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  // ✅ Create User
  async createUser(data) {
    try {
      const hashedPassword = await this.hash(data.password, SALT_ROUNDS);

      const user = await this.prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          phone: data.phone,
          role: data.role || "user",
          name: data.name,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("Create User Error:", error);
      throw new Error("Database error: Unable to create user");
    }
  }

  // ✅ Get All Users
  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Prisma Error:", error);
      throw new Error("Database error: Unable to fetch users");
    }
  }

  // ✅ Get Single User
  async getSingleUser(userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(error.message || "Database error: Unable to fetch user");
    }
  }

  // ✅ Update User
  async updateUser(userId, data) {
    try {
      if (data.password) {
        data.password = await this.hash(data.password, SALT_ROUNDS);
      }

      if (data.email) {
        data.email = data.email.toLowerCase();
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Database error: Unable to update user");
    }
  }

  // ✅ Delete User (with transaction)
  async deleteUser(userId) {
    try {
      await this.prisma.$transaction([
        this.prisma.userAreaPermission.deleteMany({
          where: { userId },
        }),
        this.prisma.user.delete({
          where: { id: userId },
        }),
      ]);

      return { message: `User with ID ${userId} deleted successfully` };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Database error: Unable to delete user");
    }
  }

  // ✅ Request Password Reset (secure)
  async requestPasswordReset(email) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // 🔐 Prevent email enumeration attack
      if (!user) {
        return {
          message: "If this email exists, a reset link has been sent",
        };
      }

      const token = crypto.randomBytes(32).toString("hex");

      // 👉 store HASHED token (more secure)
      const hashedToken = await this.hash(token, SALT_ROUNDS);

      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry,
        },
      });

      // TODO: send email with raw token (not hashed)
      // Example: `${FRONTEND_URL}/reset-password?token=${token}`

      return {
        message: "If this email exists, a reset link has been sent",
      };
    } catch (error) {
      console.error("Error generating reset token:", error);
      throw new Error("Database error: Unable to generate reset token");
    }
  }

  // ✅ Reset Password
  async resetPassword(token, newPassword) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          resetTokenExpiry: { gte: new Date() },
        },
      });

      let matchedUser = null;

      // 🔐 compare hashed token
      for (const user of users) {
        const isMatch = await this.compare(token, user.resetToken);
        if (isMatch) {
          matchedUser = user;
          break;
        }
      }

      if (!matchedUser) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await this.hash(newPassword, SALT_ROUNDS);

      await this.prisma.user.update({
        where: { id: matchedUser.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return { message: "Password has been reset successfully" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error(error.message || "Unable to reset password");
    }
  }
}

module.exports = UserService;