require('dotenv').config()
const http = require('http')
const path = require('path')
const express = require('express')
const twilio = require('twilio')

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILLIO_AUTH_TOKEN)
const cors = require('cors')
require('./db/connection')
const cookieParser = require('cookie-parser')
const routers = require('./Router/routerIndex')
const User = require('./db/models/users')
const Transaction = require('./db/models/transaction')

const { generateOTP, getUniqueId } = require('./logic')
const { getPaymentLink, stripeWebhookHandler } = require('./Payment/index')

const app = express()
const server = http.createServer(app)
app.use(cookieParser())
app.use(cors({ origin: '*' }))
app.use(routers)
//app.use(authRouter);
app.use('/stripe-webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))

server.listen(process.env.PORT || 3000, () => {
	console.log(`Server running at ${process.env.PORT || 3000}`)
})

app.get('/status', (req, res) => {
	res.send('working')
})

app.get('/api/data', async (req, res) => {
	try {
		// Fetch data from MongoDB collection
		const data = await Transaction.find()
		console.log('data', data)
		res.json(data)
	} catch (error) {
		console.error('Error fetching data from MongoDB:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})
const otpStore = new Set()
app.post('/send-otp', async (req, res) => {
	const { phoneNumber } = req.body

	const otp = await generateOTP()

	// Send OTP via Twilio
	client.messages
		.create({
			body: `Your OTP is ${otp}`,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: phoneNumber,
		})
		.then(() => {
			otpStore.add(otp)
			res.json({ success: true, message: 'OTP sent successfully' })
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				message: 'Failed to send OTP',
				error: error.message,
			})
		})
})

app.post('/verify-otp', async (req, res) => {
	const { phoneNumber, otp } = req.body
	console.log(otp)
	const user = await User.findOne({ phoneNumber })
	if (user) {
		// Check if the entered OTP matches the stored OTP for the phone number
		if (otpStore.has(otp)) {
			// Authentication successful
			return res.json({ success: true, userId: user.userId })
		} else {
			// Authentication failed
			res.json({ success: false, message: 'Invalid OTP' })
		}
	} else {
		if (otpStore.has(otp)) {
			const userId = await getUniqueId()
			const newUser = new User({ userId, phoneNumber, balance: 0 })
			newUser.save()
			return res.json({ success: true, userId })
		} else {
			// Authentication failed
			res.json({ success: false, message: 'Invalid OTP' })
		}
	}
})

app.get('/getPaymentLink', async (req, res) => {
	try {
		const { amount, userId } = req?.query
		/** Generate Payment Links */
		console.log('getPaymentLink route hit..')
		const link = await getPaymentLink(amount, userId)
		res.send({ link })
	} catch (e) {
		console.log(e)
		res.sendStatus(500)
	}
})

app.get('/success.html', async (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'success.html'))
})

app.get('/getUser', async (req, res) => {
	const { userId } = req?.query
	console.log('userid', userId)
	console.log('route hit getuser')
	try {
		const user = await User.findOne({ userId })
		res.send({ user })
	} catch (e) {
		console.log(e)
	}
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
})
