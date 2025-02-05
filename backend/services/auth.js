const UserModel = require("../models/user");

const register = async (body) => {
    return await UserModel.register(body.name, body.email, body.password);
}

const getJwt = (user) => {
    return user.generateJwt();
}

module.exports = { register, getJwt }