/* eslint-disable import/no-extraneous-dependencies */
const twilio = require('twilio')
const { AccessToken } = require('twilio').jwt

const { VideoGrant } = AccessToken
const accountSid = process.env.TWILLIO_ACCOUNT_SID
const authToken = process.env.TWILLIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)
const Helper = require('./db/models/users')

let users = require('./users')

/**
 * @param {Array} phoneNumbers
 */

async function getUniqueId() {
	const characters = '0123456789abcdefghijklmnopqrstuvwxyz'
	let id = ''

	for (let i = 0; i < 4; i++) {
		const index = Math.floor(Math.random() * characters.length)
		id += characters[index]
	}

	return id
}

async function makeConferenceCall(phoneNumbers) {
	try {
		console.log('making phone call...')
		const uniqueId = await getUniqueId()
		// const roomName = createRoomName()
		console.log('Creating conference call to numbers: ', phoneNumbers)
		console.log(process.env.CALLBACK_URL)
		let SID
		const callPromises = phoneNumbers.map(async number => {
			const call = await client
				.conferences('CFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
				.participants.create({
					waitUrl: `https://handler.twilio.com/twiml/EH292269d41da5c0aba0661d1b1027f3a0`,
					waitMethod: 'POST',
					to: number,
					from: process.env.TWILIO_PHONE_NUMBER,
					beep: 'onExit',
					endConferenceOnExit: true,
					statusCallback: `${process.env.CALLBACK_URL}/calls/status-callback?uniqueId=${uniqueId}&helperphoneNumber=${phoneNumbers[0]}&callerphoneNumber=${phoneNumbers[1]}`,
					statusCallbackEvent: ['initiated', 'completed'],
					statusCallbackMethod: 'POST',
				})
			SID = call.callSid
			process.stdout.write(`Called ${number} - call.sid ${call.callSid} \n`)
		})
		await Promise.all(callPromises).catch(error => {
			console.error('Error:', error)
		})

		return SID
	} catch (e) {
		console.log(e)
		return null
	}
}

async function getCurrentConferenceCalls() {
	try {
		client.conferences
			.list()
			.then(conferences => {
				conferences.forEach(conference => {
					console.log('Conference SID:', conference.sid)
				})
			})
			.catch(error => {
				console.error('Error fetching conferences:', error)
			})
	} catch (e) {
		console.log(e)
	}
}

async function getConferenceLists(limit) {
	try {
		let number = limit || 20
		client.conferences
			.list({ limit: number })
			.then(conferences => conferences.forEach(c => console.log(c.sid)))
	} catch (e) {
		console.log(e)
	}
}

async function disconnectCallWithExistMessage(conferenceSid) {
	try {
		await client
			.calls(conferenceSid)
			.update({
				twiml: '<Response><Say>Sorry other Party is unavialable, You can try again later</Say></Response>',
			})
			.then(call => {
				console.log('Call updated:', call.sid)
			})
			.catch(error => {
				console.error('Error updating call:', error)
			})
	} catch (e) {
		console.log(e)
	}
}

function createRoomName() {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const numbers = '0123456789'

	let name = ''

	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * letters.length)
		name += letters[randomIndex]
	}

	for (let i = 0; i < 2; i++) {
		const randomIndex = Math.floor(Math.random() * numbers.length)
		name += numbers[randomIndex]
	}

	return name
}

async function getHelper() {
	try {
		const helpers = await Helper.find()
		return helpers
	} catch (e) {
		console.log(e)
		return null
	}
}

async function createVideoRoom(roomName) {
	try {
		const roomList = await client.video.v1.rooms.list({
			uniqueName: roomName,
			status: 'in-progress',
		})

		let room
		if (!roomList.length) {
			// Call the Twilio video API to create the new Go room
			room = await client.video.v1.rooms.create({
				uniqueName: roomName,
				type: process.env.TWILIO_ROOM_TYPE,
			})
		} else {
			// eslint-disable-next-line prefer-destructuring
			room = roomList[0]
		}
		console.log('room: ', room)
	} catch (e) {
		console.log(e)
	}
}

async function connectToVideoRoom(roomName, participantIdentity) {
	const identity = participantIdentity
	const token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID,
		process.env.TWILIO_API_KEY_SID,
		process.env.TWILIO_API_KEY_SECRET,
		{ identity }
	)

	const videoGrant = new VideoGrant({
		room: roomName,
	})

	token.addGrant(videoGrant)
	console.log(token)
}

async function endAudioVideoCall(roomSid) {
	try {
		client.video.v1
			.rooms(roomSid)
			.update({ status: 'completed' })
			.then(room => console.log(room.uniqueName))
	} catch (e) {
		console.log(e)
	}
}

async function endAudioCall(sid) {
	console.log('endcallhit')
	try {
		await client
			.conferences(sid)
			.update({
				status: 'completed',
			})
			.then(() => {
				console.log(`Conference has been ended.`)
			})
	} catch (e) {
		console.log(e)
	}
}

async function getAudioCallStatus(sid) {
	try {
		const call = await client.calls(sid).fetch()
		return call.status
	} catch (e) {
		console.log(e)
		return null
	}
}

async function makePhoneCall(phoneNumber) {
	try {
		/** HardCoded roomName for POC */
		const call = await client.calls.create({
			twiml: `<Response><Say>Waiting to connect</Say></Response>`,
			to: phoneNumber,
			from: process.env.TWILIO_PHONE_NUMBER,
			statusCallback: `${process.env.CALLBACK_URL}/calls/callback`,
			statusCallbackEvent: ['initiated'],
			statusCallbackMethod: 'GET',
		})
		console.log(`Called ${phoneNumber} - call.sid ${call.sid} \n`)
	} catch (e) {
		console.log(e)
	}
}

async function generateOTP() {
	const characters = '0123456789'
	let OTP = ''

	for (let i = 0; i < 4; i++) {
		const index = Math.floor(Math.random() * characters.length)
		OTP += characters[index]
	}

	return OTP
}

module.exports = {
	makeConferenceCall,
	createRoomName,
	disconnectCallWithExistMessage,
	getCurrentConferenceCalls,
	getConferenceLists,
	getHelper,
	connectToVideoRoom,
	createVideoRoom,
	endAudioVideoCall,
	endAudioCall,
	getAudioCallStatus,
	makePhoneCall,
	generateOTP,
	getUniqueId,
}
