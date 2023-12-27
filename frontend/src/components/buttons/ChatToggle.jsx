import { useContext } from 'react'
import chat from '../../assets/icons/chat.svg'
import styled from 'styled-components'
import { userContext } from '../../state/userState'

const ChatToggleWrapper = styled.button`
	display: none;
	background: #f5f5f5;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
	&:hover {
		background-color: #fafafa;
	}
	@media (max-width: 768px) {
		display: block;
	}
`
export function ChatToggle() {
	const { setIsChatVisible, isChatVisible } = useContext(userContext)
	console.log('fromChat Toggle component: ', isChatVisible)
	return (
		<ChatToggleWrapper onClick={() => setIsChatVisible(value => !value)}>
			<img src={chat} width={'70%'} />
		</ChatToggleWrapper>
	)
}
