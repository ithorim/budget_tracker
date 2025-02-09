const UserModel = require("../models/user");

const getCurrentUser = async (id) => {
    return await UserModel.findById(id).select('name email -_id');
}

module.exports = { getCurrentUser };