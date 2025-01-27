const bcrypt = require('bcryptjs');
class BcryptHasher {
    async hash(password, saltRound) {
        return await bcrypt.hash(password, saltRound);

    }
    async compare(password,hashedPassword){
        return await bcrypt.compare(password,hashedPassword)
    }
}

module.exports = BcryptHasher