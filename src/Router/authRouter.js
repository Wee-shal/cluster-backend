const express = require("express")
// const path = require("path")
const User = require("../db/models/users")

const router = express.Router()

const auth = require("../middlewares/createAuth")
const { requireAuth } = require("../middlewares/auth")

router.use("/auth", auth)

router.get("/:id", requireAuth, async (req, res) => {
	try {
		const user = await User.findOne({ id: req.params.id })
		res.json(user)
	} catch (e) {
		console.log("soemthnig went wrong 1")
	}
})

module.exports = router