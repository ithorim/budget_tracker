const router = require("express").Router();
const userService = require("../services/user");
const passport = require("./config/auth");

router.get("/currentUser",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const user = await userService.getCurrentUser(req.user.id);
        res.json(user);
    }
)

module.exports = router;