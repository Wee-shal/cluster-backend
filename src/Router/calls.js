const express = require('express')
const twilio = require('twilio')
const { VoiceResponse } = require('twilio').twiml
const router = express.Router()
const User = require('../db/models/users')
const Transaction = require('../db/models/transaction')
const {
	makePhoneCall,
	makeConferenceCall,
	createRoomName,
	createVideoRoom,
	endAudioVideoCall,
} = require('../logic')

// POST /calls/connect
router.post('/connect', async (req, res) => {
	console.log('/calls/connect hit...')
	try {
		const { callerId } = req?.query
		const { helperId } = req?.query
		// create phone call and join room
		console.log('calls', helperId, callerId)
		await makePhoneCall(helperId, callerId)
		// let user join from browser as audio user in room
		/** create room */
		const roomName = 'room8'
		await createVideoRoom(roomName, helperId, callerId)
		res.send(`<Response>
		<Connect>
			<Room>room8</Room>
		</Connect>
		</Response>`)
		return roomName
	} catch (e) {
		console.log(e)
		res.send(500)
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
		if (userBalance >= helper?.rates) {
			await makeConferenceCall([helperPhoneNumber, userPhoneNumber])
		}
		/** end call based on balance */
		res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.send(500)
	}
})

const processedTransactions = new Set()
router.post('/status-callback', async (req, res) => {
	try {
		console.log('/status-callback hit...')
		console.log(processedTransactions)
		// eslint-disable-next-line no-unused-vars
		const { uniqueId } = req?.query
		const { helperphoneNumber } = req?.query
		const { callerphoneNumber } = req?.query
		const timeStamp = new Date(req?.body?.Timestamp)
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
					await User.updateOne(
						{ userId: helper.userId },
						{
							$inc: {
								balance: (req?.body?.CallDuration / 60) * helper?.rates,
							},
						}
					)
				}
				console.log('amount', (req?.body?.CallDuration / 60) * helper?.rates)

				const transaction = new Transaction({
					timeStamp,
					caller: caller?.userId,
					helper: helper?.userId,
					duration: parseInt(req?.body?.CallDuration, 10),
					rate: helper?.rates,
					amount: (req?.body?.CallDuration / 60) * helper?.rates,
					isRecharge: false,
				})
				await transaction.save()
			} else {
				processedTransactions.add(uniqueId)
				console.log('already added')
			}
		}
		res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.send(500)
	}
})

router.post('/videoCallback', async (req, res) => {
	try {
		console.log('/callback hit...')
		const { userId } = req?.query
		const { helperId } = req?.query
		console.log(userId, helperId)

		// eslint-disable-next-line no-unused-vars
		const helperphoneNumber = req?.body.Called
		const timeStamp = new Date(req?.body?.Timestamp)
		const callStatus = req?.body?.CallStatus
		const roomStatus = req?.body?.RoomStatus
		console.log('call Sid: ', req.body)
		const caller = await User.findOne({
			userId,
		})
		let helper
		if (!helperId) {
			helper = await User.findOne({
				phoneNumber: helperphoneNumber,
			})
		} else {
			helper = await User.findOne({
				userId: helperId,
			})
		}
		const amount =
			(req?.body?.CallDuration / 60) * helper?.rates
				? (req?.body?.CallDuration / 60) * helper?.rates
				: (req?.body?.RoomDuration / 60) * helper?.rates
		const duration = parseInt(
			req?.body?.CallDuration ? req?.body?.CallDuration : req?.body?.RoomDuration,
			10
		)
		if (
			req?.body?.ParticipantStatus === 'disconnected' &&
			(req?.body?.ParticipantIdentity === userId ||
				req?.body?.ParticipantIdentity === helperId)
		) {
			await endAudioVideoCall(req?.body?.RoomSid)
		}
		if (callStatus === 'completed' || callStatus === 'failed' || roomStatus === 'completed') {
			console.log('\n inside completed or faileds')

			if (amount <= caller?.balance) {
				console.log('inside first if')
				caller.balance -= amount
				await caller.save()
				const result = await User.updateOne(
					{ userId: helper.userId },
					{
						$inc: {
							balance: amount,
						},
					}
				)
				if (result.modifiedCount === 1) {
					const transaction = new Transaction({
						timeStamp,
						caller: caller?.userId,
						helper: helper?.userId,
						duration,
						rate: helper?.rates,
						amount,
						isRecharge: true,
					})
					await transaction.save()
				} else {
					console.log('Failed to update the balance for userId: ', helper.userId)
				}
			}
			console.log('amount', amount)
		}

		res.sendStatus(200)
	} catch (e) {
		console.log(e)
		res.send(500)
	}
})

module.exports = router
