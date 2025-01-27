class AuthService {
    prisma
    constructor(prismaClient, hasher) {
        this.prisma = prismaClient;
        this.hasher = hasher;
    }

    async varifyUser(email, password) {
        try {
            console.log(this.prisma);
            
            const user = await this.prisma.user.findUnique(
                {
                    where: {
                        email
                    }
                }
            )

            console.log(user);
            
            if (!user) {
                return null;
            }
            const isPasswordValid = await this.hasher.compare(password, user.password)

            if (!isPasswordValid) return null;

            return user;

        } catch (error) {

        }
    }
}
module.exports = AuthService