const authRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const User = require("../db/models/users")

// create json web token
const maxAge = 3 * 24 * 60 * 60
const createToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	})
}
// handle errors
const handleErrors = err => {
	let errors = { phoneNo: "" }

	// incorrect phoneNo
	if (err.message === "incorrect number") {
		errors.phoneNo = "That number is not registered"
	}

	// duplicate phoneNo error
	if (err.code === 11000) {
		errors.phoneNo = "that number is already registered"
		return errors
	}

	// validation errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message
		})
	}

	return errors
}

authRouter.post("/", async (req, res) => {
	console.log("req",req.body)
	const { phoneNo } = req.body

	try {
		const user = await User.login(phoneNo)
		// eslint-disable-next-line no-underscore-dangle
		const token = createToken(user._id)
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
		res.status(200).json({ user: { id: user.id } })
	} catch (err) {
		console.log(err)
		const errors = handleErrors(err)
		console.log(errors)
		res.status(400).json({ errors })
	}
})

module.exports = authRouter