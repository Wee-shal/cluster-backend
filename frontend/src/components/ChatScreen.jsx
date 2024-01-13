import { useEffect, useState, useContext, useRef } from 'react'
import { socket } from '../services/socket'
import styled from 'styled-components'
import { userContext } from '../state/userState'
import crossIcon from '../assets/icons/cross.svg'

const ChatScreenContainer = styled.div`
	background-color: #b2beb5;
	flex: 2;
	position: static;
	display: flex;
	flex-direction: column;
	min-width: 100%;
	margin: auto;
	height: 20vh;
	border-radius: 0;
	z-index: 10;

	@media (max-width: 768px) {
		min-height: 100vh;
		width: 100%;
		margin: 0 auto;
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
	@media (max-width: 768px) {
		position: absolute;
		bottom: 1%;
		border-radius: 0.2rem;
		background-color: #b2beb5;
		width: 90%;
		height: 5rem;
		display: flex;
		justify-content: center;
		align-content: center;
	}
`

const MsgContainer = styled.div`
	background-color: grey;
	padding: 0.2rem 0.5rem;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	width: 80%;
	margin-left: 5%;
	margin-bottom: 1%;
	position: relative;
	z-index: 1;
`

const Input = styled.input`
	width: 100%;
	padding: 0.4rem 0; /* Adjust the padding value as needed */
	border-radius: 10px;
	border: 3px solid black;
`

const SendButton = styled.button`
	cursor: pointer;
	padding: 0.4rem 0.5rem;
	margin-left: 0.3rem;
	width: auto;
	height: 2rem;
	margin-right: 12px;
	height: 2rem;
	border-radius: 10px;
	border: 3px solid black;
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
	background-color: #b2beb5;
	@media (max-width: 768px) {
		position: absolute;
		bottom: 0;
		height: 88%;
		top: 3rem;
		z-index: 0;
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
	const [room, setRoom] = useState('roomName')
	const [connectionStatus, setConnectionStatus] = useState(false)
	const { isChatVisible, setIsChatVisible } = useContext(userContext)
	const [currentUserId, setCurrentUserId] = useState()
	const [retryAttempt, setRetryAttempt] = useState(0)
	const messagesContainerRef = useRef(null)

	useEffect(() => {
		setRoom('roomName')
		setCurrentUserId(userId || window?.location?.pathname?.split('/')[2])

		const connectWebSocket = () => {
			socket.onopen = () => {
				console.log('WebSocket connected')
				setConnectionStatus(true)
				setRetryAttempt(0)
			}
			socket.onmessage = event => {
				setConnectionStatus(true)
				const data = JSON.parse(event.data)
				console.log('message from server: ', data.content)
				console.log('server room name', data)

				if (data.room === room) {
					console.log('event.data.userId', data.userId, 'not mine')
					setMessages(prev => [...prev, { userId: data.userId, message: data.content }])
				}
			}
			socket.onclose = () => {
				console.log('WebSocket disconnected??')
				setConnectionStatus(false)
				setRetryAttempt(0)
				if (retryAttempt < 5) {
					const retryDelay = 2000
					setTimeout(() => {
						console.log('Retrying WebSocket connection...')
						setRetryAttempt(prev => prev + 1)
						connectWebSocket()
					}, retryDelay)
				}
			}
		}
		connectWebSocket()

		return () => {
			socket.close()
			setConnectionStatus(false)
		}
	}, [retryAttempt])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	async function sendMessage(e) {
		e.preventDefault()
		setMessages(prev => [...prev, { userId: currentUserId, message: inputMessage }])
		console.log('inputMessage', inputMessage)
		const data = { room: 'roomName', userId: currentUserId, content: inputMessage }
		console.log('sending Data: ', data)
		socket.send(JSON.stringify(data))
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
							<MsgContainer>
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
			<Form onSubmit={sendMessage}>
				<Input
					style={{ paddingLeft: '5px' }}
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
		</ChatScreenContainer>
	)
}
