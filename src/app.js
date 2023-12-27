require('dotenv').config()
const http = require('http')
const path = require('path')
const express = require('express')
const twilio = require('twilio')
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILLIO_AUTH_TOKEN)
const cors = require('cors')
require('./db/connection')
const routers = require('./Router/routerIndex')
const User = require('./db/models/users')
const Transaction = require('./db/models/transaction')

const {
	makeConferenceCall,
	disconnectCallWithExistMessage,
	getHelper,
	endAudioCall,
	getAudioCallStatus,
	generateOTP,
} = require('./logic')
const { getPaymentLink, stripeWebhookHandler } = require('./Payment/index')

const app = express()
const cookieParser = require('cookie-parser')
const server = http.createServer(app)
app.use(cookieParser())
app.use(cors({ origin: '*' }))
app.use(routers)
//app.use(authRouter);
app.use('/stripe-webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
let users = require('./users')

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))

server.listen(process.env.PORT || 3000, () => {
	console.log(`Server running at ${process.env.PORT || 3000}`)
})

app.post('/makeConferenceCall', async (req, res) => {
	try {
		console.log(req?.body)
		console.log('makeConferenceCall route hit...')
		const helperPhoneNumber = process.env.HELPER_PHONE_NUMBER
		const userPhoneNumber = process.env.USER_PHONE_NUMBER
		const user = await User.findOne({ phoneNumber: userPhoneNumber })
		const helper = await User.findOne({
			phoneNumber: helperPhoneNumber,
		})
		console.log('user', user, 'helper', helper)
		let userBalance
		if (user?.currency !== helper?.currency) {
			if (user?.currency === '$') {
				userBalance = user?.balance
			} else if (user?.currency === '₹') {
				userBalance = user?.balance * 0.012 // to convert rupee into dollar
			}
		} else {
			userBalance = user?.balance
		}

		/** calculate call end time */
		const time = Math.floor(userBalance) / helper?.rates
		const sid = await makeConferenceCall([helperPhoneNumber, userPhoneNumber])
		/** end call based on balance */
		setTimeout(async () => {
			/** check if call is in progress */
			const callStatus = await getAudioCallStatus(sid)
			if (callStatus) {
				await endAudioCall(sid)
				/** making balance zero for user */
				try {
					user.balance = 0
					await user.save()
				} catch (e) {
					console.log(e)
				}
			}
		}, time)

		res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.send(500)
	}
})

app.post('/conferenceStatus', async (req, res) => {
	console.log('conference Status')
	console.log(JSON.stringify(req.body))

	const eventType = req.body.StatusCallbackEvent
	if (eventType === 'participant-leave') {
		const conferenceSid = req.body.ConferenceSid
		await disconnectCallWithExistMessage(conferenceSid)
		delete users[conferenceSid]
	}

	res.sendStatus(200)
})
const processedTransactions = new Set()
app.post('/status-callback', async (req, res) => {
	console.log('/status-callback hit...')
	// eslint-disable-next-line no-unused-vars
	const { uniqueId } = req?.query
	console.log('unique', uniqueId)
	const callStatus = req?.body?.CallStatus
	console.log('call Sid: ', req.body)
	const caller = await User.findOne({
		phoneNumber: process.env.USER_PHONE_NUMBER,
	})
	const helper = await User.findOne({
		phoneNumber: process.env.HELPER_PHONE_NUMBER,
	})
	console.log('caller', caller, 'helper', helper)
	if (callStatus === 'completed' || callStatus === 'failed') {
		console.log('\n inside completed or faileds')
		if (req?.body?.CallDuration * 10 < caller.balance) {
			caller.balance -= req?.body?.CallDuration * helper.rates
			await caller.save()
		}
		if (!processedTransactions.has(uniqueId)) {
			const transaction = new Transaction({
				timeStamp: req?.body?.Timestamp,
				caller: caller.userId,
				helper: helper.userId,
				duration: req?.body?.CallDuration,
				rate: helper.rates,
				amount: `- ${req?.body?.CallDuration * helper.rates}`,
			})
			await transaction.save()
			processedTransactions.add(uniqueId)
		} else {
			console.log('already added')
		}
	} else if (callStatus === 'canceled' || callStatus === 'no-answer' || callStatus === 'busy') {
		/**
		 *  whatever the id received check its value (phoneNumber) and get other key which has same value
		 */

		for (const id of Object.entries(users)) {
			try {
				await disconnectCallWithExistMessage(id[0])
				delete users[id[0]]
			} catch (e) {
				console.log(e)
			}
		}
	}

	console.log('Users objects: ', users)

	res.sendStatus(200)
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
	const phoneNumber = req.body.phoneNumber

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
	// Check if the entered OTP matches the stored OTP for the phone number
	if (otpStore.has(otp)) {
		// Authentication successful
		return res.json({ success: true })
	} else {
		// Authentication failed
		res.json({ success: false, message: 'Invalid OTP' })
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

app.post('/stripe-webhook', async (req, res) => {
	try {
		await stripeWebhookHandler(req, res)
	} catch (err) {
		console.error('Error handling webhook:', err.message)
		res.status(500).send('Webhook Error')
	}
})

app.get('/getHelpers', async (req, res) => {
	try {
		const helpers = await getHelper()
		res.send(helpers)
	} catch (e) {
		console.log(e)
		res.send('Error while fetching Users', e)
	}
})

app.get('/success.html', async (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'success.html'))
})

app.get('/isHelper', async (req, res) => {
	const { userId } = req?.query
	try {
		const user = await User.findOne({ userId })
		res.send(user.isHelper)
	} catch (e) {
		console.log(e)
	}
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
