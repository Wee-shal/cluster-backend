const express = require('express')
const twilio = require('twilio')

const router = express.Router()
const User = require('../db/models/users')
const Transaction = require('../db/models/transaction')
const {
	makePhoneCall,
	makeConferenceCall,
	endAudioCall,
	getAudioCallStatus,
	disconnectCallWithExistMessage,
} = require('../logic')

// POST /calls/connect
router.post('/connect', async (req, res) => {
	console.log('/calls/connect hit...')
	console.log('req?.body: ', req?.body)
	try {
		// create phone call and join room
		await makePhoneCall([process.env.HELPER_PHONE_NUMBER])
		// let user join from browser as audio user in room
		/** create room */
		await createVideoRoom('roomName')
		res.send(`<Response>
		<Connect>
			<Room>roomName</Room>
		</Connect>
		</Response>`)
	} catch (e) {
		console.log(e)
	}
})

router.post('/makeConferenceCall', async (req, res) => {
	const { userId } = req?.query
	const { expertId } = req?.query
	try {
		console.log(req?.body)
		console.log('makeConferenceCall route hit...')

		const user = await User.findOne({ userId })
		const helper = await User.findOne({
			userId: expertId,
		})
		const helperPhoneNumber = helper.phoneNumber
			? helper.phoneNumber
			: process.env.HELPER_PHONE_NUMBER
		const userPhoneNumber = user.phoneNumber ? user.phoneNumber : process.env.USER_PHONE_NUMBER
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
		if (userBalance >= helper?.rates) {
			const sid = await makeConferenceCall([helperPhoneNumber, userPhoneNumber])
			/** end call based on balance */
			setTimeout(async () => {
				/** check if call is in progress */
				const callStatus = await getAudioCallStatus(sid)
				if (callStatus === 'no-answer') {
					await endAudioCall(sid)
					/** making balance zero for user */
				}
			}, time)
		}
		res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.send(500)
	}
})

const processedTransactions = new Set()
const callSid = new Set()
const conferenceSid = new Set()
router.post('/status-callback', async (req, res) => {
	console.log('/status-callback hit...')
	console.log(processedTransactions)
	// eslint-disable-next-line no-unused-vars
	const { uniqueId } = req?.query
	const { helperphoneNumber } = req?.query
	const { callerphoneNumber } = req?.query
	console.log('unique', uniqueId, helperphoneNumber)
	const callStatus = req?.body?.CallStatus
	if (req?.body?.To === `+${helperphoneNumber?.trim()}`) callSid.add(req?.body?.CallSid)
	conferenceSid.add(req?.body?.ConferenceSid)
	console.log('conferenceSid', conferenceSid, callSid)
	console.log('call Sid: ', req.body)
	const caller = await User.findOne({
		phoneNumber: `+${callerphoneNumber?.trim()}`,
	})
	const helper = await User.findOne({
		phoneNumber: `+${helperphoneNumber?.trim()}`,
	})
	if (callStatus === 'completed' || callStatus === 'failed') {
		console.log('\n inside completed or faileds')
		if (processedTransactions.has(uniqueId)) {
			if ((req?.body?.CallDuration / 60) * helper?.rates <= caller?.balance) {
				console.log('inside first if')
				caller.balance -= (req?.body?.CallDuration / 60) * helper?.rates
				await caller.save()
			}
			console.log('amount', (req?.body?.CallDuration / 60) * helper?.rates)
			const timeStamp = new Date(req?.body?.Timestamp)
			const transaction = new Transaction({
				timeStamp,
				caller: caller?.userId,
				helper: helper?.userId,
				duration: parseInt(req?.body?.CallDuration, 10),
				rate: helper?.rates,
				amount: (req?.body?.CallDuration / 60) * helper?.rates,
				isRecharge: false,
				balance: caller.balance,
			})
			await transaction.save()
		} else {
			processedTransactions.add(uniqueId)
			console.log('already added')
		}
	} else {
		// Set a timeout for other cases
		setTimeout(async () => {
			// Your asynchronous logic here
			console.log('checking status')
			if (callSid.has(req?.body?.CallSid)) {
				const status = await getAudioCallStatus(req?.body?.CallSid)
				console.log('status', status)
				if (
					conferenceSid.has(req?.body?.ConferenceSid) &&
					(status === 'no-answer' || status === 'ringing' || status === 'canceled')
				) {
					await endAudioCall(req?.body?.ConferenceSid)
				}
			}
		}, 5000)
	}
	res.sendStatus(200)
})

module.exports = router
