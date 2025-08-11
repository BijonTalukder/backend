const BcryptHasher = require("../../utility/BcryptPasswordHasher");

class AdminService extends BcryptHasher {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async createAdmin(data) {
    try {
      const hashedPassword = await this.hash(data.password,10)
       
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

  async createUserWithPermissions(data) {
    try {
      const hashedPassword = await this.hash(data.password, 10);
      const permissions = data.permissions ||{};

      console.log(permissions);
      await this.prisma.userAreaPermission.create({
        data: {
          userId: data.userId,
          areaId: data.areaId,
          permissions: permissions,
          status: data.status || true,
        }
      
      })
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: data.role || "user",
          name: data.name,

        }
      });
    } catch (error) {
      console.log(error);
      throw new Error('Database error: Unable to create user with permissions');
    }
  }
}

module.exports = AdminService;
