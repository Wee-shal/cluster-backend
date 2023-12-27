const jwt = require("jsonwebtoken")
const User = require("../db/models/users")

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt

	// check json web token exists & is verified
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, err => {
			if (err) {
				console.log(err.message)
				return res.sendStatus(401).send(`Unauthenticated request`)
			} else {
				return next()
			}
		})
	} else {
		console.log("no token found")
	}
}

// check current user
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null
				next()
			} else {
				let user = await User.findById(decodedToken.id)
				res.locals.user = user
				next()
			}
		})
	} else {
		res.locals.user = null
		next()
	}
}

module.exports = { requireAuth, checkUser }