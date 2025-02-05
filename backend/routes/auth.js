const router = require("express").Router()
const authService = require("../services/auth");
const passport = require("./config/auth");

router.post("/register", async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json({token: user.generateJwt()});
    } catch (error) {
        if(error.message === "Email is already used.") {
            res.status(400).json({message: "Email is already used."})
        } else {
            res.status(500).json({message: "Internal server error"});
        }
    }
})

router.post("/login",
    passport.authenticate('local', {session: false}),
    async (req, res) => {
        const token = await authService.getJwt(req.user);
        res.status(200).json({token: token});
    }
)

module.exports = router;