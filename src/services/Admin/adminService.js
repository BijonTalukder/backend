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
  const permissions = data.permissions || {};

  try {
    const hashedPassword = await this.hash(data.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const userData = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: data.role || "user",
          name: data.name,
        },
      });

      console.log(permissions, "permissions");

      if (Array.isArray(permissions) && permissions.length > 0) {
        // If permissions is an array, create many permission records
        // Make sure each permission object includes required fields (areaId, status, permissions JSON)
        // If areaId and status are constant, adjust accordingly
        const permissionData = permissions.map((perm) => ({
          userId: userData.id,
          areaId: perm.areaId || data.areaId,
          permissions: perm.permissions || perm, // or however your permissions structure is
          status: perm.status ?? data.status ?? true,
        }));

        await tx.userAreaPermission.createMany({
          data: permissionData,
        });
      } else {
        // Single permission object
        await tx.userAreaPermission.create({
          data: {
            userId: userData.id,
            areaId: data.areaId,
            permissions: permissions,
            status: data.status ?? true,
          },
        });
      }

      return userData;
    });

    return result;

  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to create user with permissions");
  }
}

}

module.exports = AdminService;
