import { useContext, useEffect } from 'react'
import video from '../../assets/icons/video.svg'
import videoOff from '../../assets/icons/videoOff.svg'
import styled from 'styled-components'
import { userContext } from '../../state/userState'

const VideoToggleButton = styled.button`
	background: 535353;
	padding: 0.8rem 1.5rem 0.8rem 1.5rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
`
export function VideoToggle() {
	const { isUserVideoOff, setIsUserVideoOff } = useContext(userContext)

	useEffect(() => {
		console.log('from video Toggle : ', isUserVideoOff)
	}, [isUserVideoOff])

	return (
		<VideoToggleButton onClick={() => setIsUserVideoOff(value => !value)}>
			<img src={isUserVideoOff ? video : videoOff} width={'70%'} />
		</VideoToggleButton>
	)
}
