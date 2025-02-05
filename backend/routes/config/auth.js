const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const UserModel = require("../../models/user");
const config = require("../../config");

const localOptions = {
    usernameField: "email"
}

passport.use(new LocalStrategy(localOptions, async function(email, password, done) {
    try {
        const user = await UserModel.findOne({email: email});

        if(!user)
            return done(null, false, { message: "Credentials not valid." });
        
        const isValid = await user.validatePassword(password);
        
        if(isValid)
            return done(null, user)
        else
            return done(null, false, { message: "Credentials not valid." })
    } catch (error) {
        return done(error)
    }
}));

module.exports = passport;
