const UserModel = require("../models/user");

const getCurrentUser = async (id) => {
    return await UserModel.findById(id).select('name email -_id');
}

const checkEmailExists = async (email) => {
    try {
        const user = await UserModel.findOne({ email });
        return user !== null; // returns true if user exists
    } catch (error) {
        console.error('Error checking email existence:', error);
        throw error;
    }
}

const updatePassword = async (id, currentPassword, newPassword) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // verify current password using existing validatePassword method
        const isMatch = await user.validatePassword(currentPassword);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // update password using existing savePassword method
        await user.savePassword(newPassword);
        await user.save();
        
        return { success: true };
    } catch (error) {
        throw error;
    }
}

const updateUserInfo = async (id, name, email) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // only check if email is taken if it's different from current email
        if (email !== user.email) {
            const emailIsTaken = await checkEmailExists(email);
            if (emailIsTaken) {
                throw new Error('Email is already taken');
            }
        }

        user.name = name;
        user.email = email;
        await user.save();
        
        return { success: true };
    } catch (error) {
        throw error;
    }
}

module.exports = { getCurrentUser, checkEmailExists, updatePassword, updateUserInfo };