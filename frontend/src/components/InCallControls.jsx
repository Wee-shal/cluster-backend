import styled from 'styled-components'
import { AudioToggle } from './buttons/AudioToggle'
import { VideoToggle } from './buttons/VideoToggle'
import { EndCall } from './buttons/EndCall'

const Container = styled.div`
	display: flex;
	gap: 1rem;
	justify-content: center;
`

export default function InCallControls() {
	return (
		<Container>
			<AudioToggle />
			<VideoToggle />
			<EndCall />
		</Container>
	)
}
