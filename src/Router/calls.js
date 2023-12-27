const express = require('express')

const router = express.Router()

const { makePhoneCall, createVideoRoom } = require('../logic')

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

module.exports = router
