const passport = require("passport");
const passportJwt = require("passport-jwt");
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

const jwtOptions = {
    secretOrKey: config.secretKey,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(new passportJwt.Strategy(jwtOptions, async function(payload, done) {
    const user = await UserModel.findOne({_id: payload._id});
    if(!user)
        return done(null, false, {message: "User authorization failed."});

    done(null, user);
}))

module.exports = passport;
