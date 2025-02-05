const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true }
})

UserSchema.methods.savePassword = async function(password) {
    this.salt = await bcrypt.genSalt(10);
    this.hash = await bcrypt.hash(password, this.salt);
}

UserSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.hash);
}

UserSchema.methods.generateJwt = function() {
    return jwt.sign({
        _id: this._id
    }, config.secretKey,
    {expiresIn: '7d'});
}

const UserModel = mongoose.model("user", UserSchema);

UserModel.register = async function(name, email, password) {
    const existingUser = await UserModel.findOne({email: email});
    if(existingUser)
        throw new Error("Email is already used.");

    const user = new UserModel({
        name: name,
        email: email
    })

    await user.savePassword(password);
    console.log(user);
    const newUser = await user.save();
    return newUser;
}

module.exports = UserModel;