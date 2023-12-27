import { useContext } from 'react'
import shareScreen from '../../assets/icons/shareScreen.svg'
import styled from 'styled-components'
import { userContext } from '../../state/userState'

const ShareScreenToggleButton = styled.button`
	background: ${prop => prop.backgroundColor};
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
	&:hover {
		background-color: #261d1da0;
	}
`
export function ShareScreenToggle() {
	const { isScreenSharingEnabled, setIsScreenSharingEnabled } = useContext(userContext)
	return (
		<ShareScreenToggleButton
			onClick={() => setIsScreenSharingEnabled(value => !value)}
			backgroundColor={isScreenSharingEnabled ? '#03b0f5' : '#2e2e2e'}
		>
			<img src={shareScreen} width={'70%'} />
		</ShareScreenToggleButton>
	)
}
