import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import videoIcon from '../assets/icons/videoOn.svg'
import videoOffIcon from '../assets/icons/videoOff.svg'
import micIcon from '../assets/icons/micOn.svg'
import micOffIcon from '../assets/icons/micOff.svg'
import VideoPreview from '../components/VideoPreview'
import { userContext } from '../state/userState'
import { getTokenForAudioCall } from '../services/tokenService'
import serverUrl from '../config'

const CenteredContainer = styled.div`
	width: 100%;
	height: 100;
	margin: auto;
	background-color: #000000;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	border-radius: 7px;
	padding: 2rem;
	@media (max-width: 768px) {
		width: 70%;
		height: 70%;
	}
`

const MuteButton = styled.button`
	font-size: 1rem;
	padding: 1px;
	width: 50px;
	height: 50px;
	margin: auto;
	background-color: #ffffff;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
	@media (max-width: 768px) {
		padding: 0.6rem 1rem 0.6rem 1rem;
		width: 7rem;
	}
`

const StopVideo = styled.button`
	font-size: 1rem;
	padding: 1 px;
	width: 50px;
	height: 50px;
	background-color: white;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	flex: 1;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
	@media (max-width: 768px) {
		padding: 0.6rem 2rem 0.6rem 2rem;
		width: 7.5rem;
	}
`

const CancelButton = styled.button`
	font-size: 1rem;
	padding: 0.5rem 3rem 0.5rem 3rem;
	background-color: white;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
`

const JoinNowbutton = styled.button`
	font-size: 1rem;
	padding: 0.5rem 4rem 0.5rem 4rem;
	color: white;
	background-color: green;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
`

const Container = styled.div`
	margin-top: ${props => props.margintop || 'auto'};
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex: 1;
	gap: 1rem;
	@media (max-width: 768px) {
		flex-direction: column;
		margin-top: auto;
	}
`

const ControlsContainer = styled.div`
	margin-top: 5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	@media (max-width: 768px) {
		flex-direction: row;
		margin-top: 1rem;
		align-items: flex-start;
		gap: 1rem;
	}
`

const MainDiv = styled.div`
	position: relative;
	background-color: #000000;
	color: white;
`
const ButtonContainer = styled.div``

export default function AVCallPreJoinOptions({ setConnect, connect }) {
	const { isUserMute, setIsUserMute, isUserVideoOff, setIsUserVideoOff } = useContext(userContext)
	const userId = window?.location?.pathname?.split('/')[2]
	console.log("userId1", userId)
	const id = window.localStorage.getItem("id")
	console.log(`Isusermute: ${isUserMute} \n isUserVideoOff: ${isUserVideoOff} `)
	const [joinRoom, setJoinRoom] = useState(false)
	const navigate = useNavigate()
	const [device, setDevice] = useState()
	useEffect(() => {
		let script

		const loadDevice = async () => {
			let token
			try {
				token = await getTokenForAudioCall()
				console.log('token for browserToPhoneCall: ', token)
			} catch (e) {
				console.log(e)
			}
			// Load the Twilio script dynamically
			script = document.createElement('script')
			script.src = 'https://sdk.twilio.com/js/client/releases/1.10.1/twilio.js'
			script.async = true

			script.onload = () => {
				// eslint-disable-next-line no-undef
				const deviceInstance = new Twilio.Device(token, {
					codecPreferences: ['opus', 'pcmu'],
					fakeLocalDTMF: true,
					enableRingingState: true,
				})

				setDevice(deviceInstance)
				deviceInstance.on('ready', () => {
					console.log('Device is ready')
					setDevice(deviceInstance)
				})

				deviceInstance.on('error', error => {
					console.log('Error occurred:', error)
				})
			}

			document.body.appendChild(script)
		}

		loadDevice()

		return () => {
			if (script) {
				document.body.removeChild(script)
			}
		}
	}, [])

	async function makeBrowserCall() {
		try {
			if (device) {
				device.connect()
				return true
			} else {
				alert('Loading the call module...')
				return false
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			{!connect && (
				<MainDiv>
					<CenteredContainer>
						<Container>
							<VideoPreview />
						</Container>
						<Container margintop="4rem" style={{ display: 'flex', flexDirection: 'column'}}>
							<ControlsContainer style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px'}}>
								<ButtonContainer>
									<MuteButton onClick={() => setIsUserMute(!isUserMute)}>
										<img src={isUserMute ? micOffIcon : micIcon} width="20px" />
									</MuteButton>
								</ButtonContainer>
								<ButtonContainer>
									<StopVideo onClick={() => setIsUserVideoOff(!isUserVideoOff)}>
										<img
											src={isUserVideoOff ? videoOffIcon : videoIcon}
											width="20px"
										/>
									</StopVideo>
								</ButtonContainer>
							</ControlsContainer>
							<Container style={{ marginTop: '20px'}}>
								<CancelButton onClick={() => navigate(-1)}>Cancel</CancelButton>
								<JoinNowbutton
									onClick={async () => {
										if (userId !== 'developerId') {
											makeBrowserCall()
										}
										try {
											const response = await fetch(
												`${serverUrl}/calls/connect?helperId=${userId}&callerId=${id}`,
												{
													method: 'POST',
													headers: {
														'Content-Type': 'application/json',
													},
												}
											)
											console.log(response)
											if (response.ok) {
												// Handle success if needed
												console.log('Join request successful')
											} else {
												// Handle error
												console.error('Join request failed')
											}
										} catch (error) {
											console.error('Error during join request:', error)
										}

										// Update state or perform any other actions
										setJoinRoom(!joinRoom)
										setConnect(true)
									}}
								>
									Join
								</JoinNowbutton>
							</Container>
						</Container>
					</CenteredContainer>
				</MainDiv>
			)}
		</>
	)
}

AVCallPreJoinOptions.propTypes = {
	setConnect: PropTypes.func.isRequired,
	connect: PropTypes.bool.isRequired,
}