import { useContext } from 'react'
import micOn from '../../assets/icons/micOn.svg'
import micOff from '../../assets/icons/micOff.svg'
import styled from 'styled-components'
import { userContext } from '../../state/userState'

const AudioToggleButton = styled.button`
	background: 535353;
	padding: 0.8rem 1.5rem 0.8rem 1.5rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
`
export function AudioToggle() {
	const { isUserMute, setIsUserMute } = useContext(userContext)
	return (
		<AudioToggleButton onClick={() => setIsUserMute(!isUserMute)}>
			<img src={isUserMute ? micOff : micOn} width={'70%'} />
		</AudioToggleButton>
	)
}
