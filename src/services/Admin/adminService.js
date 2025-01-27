const BcryptHasher = require("../../utility/BcryptPasswordHasher");

class AdminService extends BcryptHasher {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async createAdmin(data) {
    try {
      const hashedPassword = await this.hash(data.password,10)
      console.log(hashedPassword);
       
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: data.role || "admin",
          name: data.name,
        }
      });
    } catch (error) {
      console.log(error);
      
      throw new Error('Database error: Unable to create admin');
    }
  }
}

module.exports = AdminService;
