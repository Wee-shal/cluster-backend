import config from '../config'
async function getToken(roomname, username) {
	try {
		// eslint-disable-next-line prefer-rest-params
		console.log('getToken function hit with the values', ...arguments)
		const response = await fetch(`${config}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_identity: username, 
				room_name: roomname,
			}),
		})
		if (!response.ok) {
			throw new Error('Failed to fetch token', response.status, response.statusText)
		}
		console.log('response: ', response)
		const data = await response.json()
		return data
	} catch (e) {
		console.log(e)
		return null
	}
}

async function getTokenForAudioCall() {
	try {
		// eslint-disable-next-line prefer-rest-params
		console.log('getToken function hit with the values', ...arguments)
		const response = await fetch(`${config}/getTokenForVOIPCall`)
		if (!response.ok) {
			throw new Error('Failed to fetch token', response.status, response.statusText)
		}

		console.log('response: ', response)
		const { token } = await response.json()
		return token
	} catch (e) {
		console.log(e)
		return null
	}
} 

async function endAudioVideoCall(roomName) {
	try {
		// eslint-disable-next-line prefer-rest-params
		console.log('endAudioVideoCall')
		const response = await fetch(`${config}/endAudioVideo?roomName=${roomName}`)
		if (!response.ok) {
			throw new Error('Failed to fetch')
		}

		console.log('response: ', response)
	} catch (e) {
		console.log(e)
		return null
	}
} 

export { getToken, getTokenForAudioCall, endAudioVideoCall }
