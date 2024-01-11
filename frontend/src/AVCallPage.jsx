import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import AVCallPreJoinOptions from './components/AVCallPreJoinOptions'
import AVCallScreen from './components/AVCallScreen'

const Container = styled.div`
	background-color: gray;
	height: 100vh;
`

export default function AVCallPage() {
	const userId =window.localStorage.getItem("id")
	console.log('location: ', userId)
	const [join, setJoin] = useState(false)
	let participantCount = 0
	console.log('participantCount: ', participantCount)

	return (
		<Container>
			{join ? (
				<AVCallScreen userId={userId} />
			) : (
				<AVCallPreJoinOptions setConnect={setJoin} connect={join} userId={userId} />
			)}
		</Container>
	)
}
