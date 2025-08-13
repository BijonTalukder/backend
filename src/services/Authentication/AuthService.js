class AuthService {
    prisma
    constructor(prismaClient, hasher) {
        this.prisma = prismaClient;
        this.hasher = hasher;
    }

    async varifyUser(email, password) {
        try {
            
            const user = await this.prisma.user.findUnique(
                {
                    where: {
                        email
                    },
                    include: {
                   userPermissions: true
                    }
                }
            )

            console.log("------------asdfdsdf")
            if (!user) {
                return null;
            }
            const isPasswordValid = await this.hasher.compare(password, user.password)

            if (!isPasswordValid) return null;

            return user;

        } catch (error) {
console.log(error);

        }
    }
}
module.exports = AuthService