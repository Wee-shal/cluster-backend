/* eslint-disable react/jsx-key */
import { useEffect, useState, useContext, useRef } from 'react'
import styled from 'styled-components'
import { userContext } from '../state/userState'
import crossIcon from '../assets/icons/cross.svg'

const ChatScreenContainer = styled.div`
	background-color: white;
	flex: 2;
	position: static;
	display: block;
	min-width: 100%;
	margin: auto;
	height: 20vh;
	border-radius: 0;
	z-index: 10;

	@media (max-width: 768px) {
		display: ${prop => (prop.isVisible ? 'block' : 'none')};
		min-height: 100vh;
		width: 100%;
		margin: 0 auto;
		/* display: grid; */
		align-items: center;
		position: absolute;
		top: 0;
		left: -1rem;
		right: 0;
		bottom: 0;
		z-index: 9;
		padding-left: 1rem;
		padding-right: 1rem;
	}
`

const Form = styled.form`
	display: flex;
	align-items: center;
	width: 100%;
	margin-left: 1vw;
`

const InputBoxContainer = styled.div`
	width: 80%;
	margin: auto;
	position: static;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 1rem;
	padding: 0.3rem;
	@media (max-width: 768px) {
		position: absolute;
		bottom: 1%;
		border-radius: 0.2rem;
		background-color: white;
		width: 90%;
		height: 5rem;
		display: flex;
		justify-content: center;
		align-content: center;
	}
`

const MsgContainer = styled.div`
	background-color: #e0e0e0;
	padding: 0.2rem 0.5rem;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 3px;
	width: 80%;
	margin-left: 5%;
`

const Input = styled.input`
	width: 100%;
	margin: auto;
	padding: 0.3rem 0;
`

const SendButton = styled.button`
	cursor: pointer;
	padding: 0.4rem 0.5rem;
	margin-left: 0.3rem;
	width: auto;
	height: 2rem;
`

const Closebutton = styled.div`
	display: block;
	cursor: pointer;
	@media (max-width: 768px) {
		display: block;
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
`

const CloseIcon = styled.img`
	display: none;
	@media (max-width: 768px) {
		display: block;
	}
`

const ChatMessageWrapper = styled.div`
	position: static;
	top: 1rem;
	left: 0;
	right: 0;
	bottom: 0rem;
	overflow-y: auto;
	height: 70%;
	background-color: azure;
	@media (max-width: 768px) {
		position: absolute;
		bottom: 0;
		height: 88%;
		/* height: 30rem; */
		top: 3rem;
		overflow-y: auto;
	}
`

const ConnectionStatusMessage = styled.div`
	margin-left: 1rem;
	margin-bottom: 1.5rem;
`
// eslint-disable-next-line react/prop-types
export default function ChatScreen({ userId }) {
	const [inputMessage, setInputMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [room, setRoom] = useState('room1')
	const [connectionStatus, setConnectionStatus] = useState(false)
	const { isChatVisible, setIsChatVisible } = useContext(userContext)
	const [currentUserId, setCurrentUserId] = useState()
	const [retryAttempt, setRetryAttempt] = useState(0)
	const messagesContainerRef = useRef(null)

	useEffect(() => {
		setRoom('room1')
		setCurrentUserId(userId || window?.location?.pathname?.split('/')[2])

	})
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	async function sendMessage(e) {
		e.preventDefault()
		setMessages(prev => [...prev, { userId: currentUserId, message: inputMessage }])
		console.log('inputMessage', inputMessage)
		const data = { room: 'room1', userId: currentUserId, content: inputMessage }
		console.log('sending Date: ', data)
		setInputMessage('')
	}
	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
		}
	}

	/** useEffect to take care of the chat screen visibility based on mobile/desktop size */
	useEffect(() => {
		const screenWidth = window.innerWidth
		if (screenWidth < 768) {
			const chatContainerElement = document.querySelector('#chatContainer')
			if (isChatVisible) {
				chatContainerElement.style.display = 'block'
			} else {
				chatContainerElement.style.display = 'none'
			}
		} else {
			const chatContainerElement = document.querySelector('#chatContainer')
			chatContainerElement.style.display = 'block'
		}
		console.log('screenWidth: ', screenWidth)
	}, [isChatVisible])

	console.log('isChatVisible: ', isChatVisible)
	return (
		<ChatScreenContainer id="chatContainer">
			<Closebutton>
				<CloseIcon src={crossIcon} onClick={() => setIsChatVisible(value => !value)} />
			</Closebutton>
			<ConnectionStatusMessage>{connectionStatus ? '  ' : '  '}</ConnectionStatusMessage>
			<ChatMessageWrapper ref={messagesContainerRef}>
				{messages.length > 0 &&
					messages.map(item => {
						return (
							<MsgContainer style={{ marginTop: '1rem' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<b>{item.userId}</b>{' '}
									{new Date().toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
										hour12: true,
									})}
								</div>{' '}
								{item.message}
							</MsgContainer>
						)
					})}
			</ChatMessageWrapper>
			<InputBoxContainer>
				<Form onSubmit={sendMessage}>
					<Input
						type="text"
						value={inputMessage}
						onChange={e => {
							const inputValue = e.target.value
							if (inputValue.trim() !== '') {
								setInputMessage(inputValue)
							}
						}}
					/>
					<SendButton type="submit">Send</SendButton>
				</Form>
			</InputBoxContainer>
		</ChatScreenContainer>
	)
}
	