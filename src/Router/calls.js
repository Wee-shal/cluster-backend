const express = require('express')
const twilio = require('twilio')
const { VoiceResponse } = require('twilio').twiml
const router = express.Router()
const User = require('../db/models/users')
const Transaction = require('../db/models/transaction')
const { makePhoneCall, makeConferenceCall, createVideoRoom } = require('../logic')

// POST /calls/connect
router.post('/connect', async (req, res) => {
	console.log('/calls/connect hit...')
	console.log('req?.body: ', req?.body)
	try {
		// create phone call and join room
		await makePhoneCall([process.env.HELPER_PHONE_NUMBER])
		// let user join from browser as audio user in room
		/** create room */
		await createVideoRoom('room1')
		res.send(`<Response>
		<Connect>
			<Room>room1</Room>
		</Connect>
		</Response>`)
	} catch (e) {
		console.log(e)
	}
})

const processedTransactions = new Set()
router.post('/status-callback', async (req, res) => {
	console.log('/status-callback hit...')
	console.log(processedTransactions)
	// eslint-disable-next-line no-unused-vars
	const { uniqueId } = req?.query
	const { helperphoneNumber } = req?.query
	const { callerphoneNumber } = req?.query
	console.log('unique', uniqueId, helperphoneNumber)
	const callStatus = req?.body?.CallStatus
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
				balance: caller?.balance,
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
		})
	}
	res.sendStatus(200)
})

module.exports = router
