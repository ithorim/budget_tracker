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

router.post("/checkEmailExists",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        try {
            const { email } = req.body; // same as const email = req.body.email;
            
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const exists = await userService.checkEmailExists(email);
            return res.json(exists); // returns true if user exists

        } catch (error) {
            console.error('Error checking email:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
)

router.put("/updatePassword",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Both current and new passwords are required' });
            }

            await userService.updatePassword(req.user.id, currentPassword, newPassword);
            return res.json({ message: 'Password updated successfully' });

        } catch (error) {
            if (error.message === 'Current password is incorrect') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
)

router.put("/updateUserInfo",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: 'Both name and email are required' });
            }

            await userService.updateUserInfo(req.user.id, name, email);
            return res.json({ message: 'User information updated successfully' });
            
        } catch (error) {
            if (error.message === 'Email is already taken') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
)

module.exports = router;