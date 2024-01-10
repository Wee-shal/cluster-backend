/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useId } from 'react'
import Video from 'twilio-video'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../services/tokenService'
import { AudioToggle } from './buttons/AudioToggle'
import { VideoToggle } from './buttons/VideoToggle'
import { EndCall } from './buttons/EndCall'
import { userContext } from '../state/userState'
import { ShareScreenToggle } from './buttons/ShareScreenToggle'
import shareScreen from '../assets/icons/shareScreen.svg'
import ChatScreen from '../components/ChatScreen'
import { ChatToggle } from './buttons/ChatToggle'
import NotificationMessage from '../components/NotificationMsg'
import { getUser } from '../services/helpers'

const Container = styled.div`
	/* height: 100vh; */
	height: 100vh;
	background-color: #000000;
	position: relative;
`
const ParticipantsWrapper = styled.div`
	width: 20%;
	height: 20%;
`

const Participants = styled.div`
	position: absolute;
	right: 10px;
	bottom: 0;
	height: 200px;
	top: auto;
`

const UsernameContainer = styled.div`
	text-align: center;
	position: absolute;
	bottom: 0;
	background-color: black;
	color: white;
	border-top-right-radius: 0px;
	margin: 0 auto;
`

const InCallControlsContainer = styled.div`
	position: absolute;
	bottom: 1rem;
	left: 0;
	right: 0;
	display: flex;
	gap: 1rem;
	justify-content: center;
	z-index: 1;

	@media (max-width: 768px) {
	}
`
const ShareScreenToggleButton = styled.button`
	background-color: gray;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
	&:hover {
		background-color: #7270709f;
	}
`

const Main = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.2rem;
	height: 100%;
	width: 75%;
	flex: 3;
	background-color: #2b2b2b;
`

const SideContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: blanchedalmond;
`

const LocalParticipant = styled.div`
	flex: 1;
	background-color: #1f1f1f;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`
const RemoteParticipant = styled.div`
	flex: 1;
	background-color: #e9a105;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`

const ScreensWrapper = styled.div`
	position: absolute;
	top: 1.5rem;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	background-color: green;
	height: 80%;
	width: 90%;
	margin: 0 auto;
	@media (max-width: 768px) {
		top: 0;
	}
`
const AudioParticipant = styled.div`
	display: hidden;
`

export default function AVCallScreen({ userId }) {
	const [connected, setConnected] = useState(false)
	const [room, setRoom] = useState(null)
	const [localIdentity, setLocalIdentity] = useState('')
	const [remoteIdentity, setRemoteIdentity] = useState('')
	const [currentParticipant, setCurrentParticipant] = useState()
	const {
		user,
		setUser,
		isUserMute,
		setIsUserMute,
		isUserVideoOff,
		setIsUserVideoOff,
		isScreenSharingEnabled,
		setIsScreenSharingEnabled,
	} = useContext(userContext)
	const [screenTrackData, setScreenTrackData] = useState(null)
	const [remoteTracks, setRemoteTracks] = useState(null)
	const [displayNotification, setDisplayNotification] = useState(false)
	const [notificationMsg, setNotificationMsg] = useState('')
	const [isRemoteShareScreenEnabled, setIsRemoteShareScreenEnabled] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		;(async () => {
			/**
			 * For POC:
			 * Detecting wheather its a user or developer based on the how they arrive to the page
			 * If they opened the page directly /profile/developerId/call that's mean they are developer
			 * And if they arrive to the call page via clicking the cards that's mean they are user
			 */
			await connectOrDisconnect(userId || window?.location?.pathname?.split('/')[2])
			await addLocalVideo()
			console.log('passed userId is : ', userId)
		})()
	}, [])

	const addLocalVideo = async () => {
		console.log('addLocalVideo')
		const localParticipant = document.getElementById('localParticipant')
		try {
			removeTrackFromDiv(localParticipant)
		} catch (e) {
			console.log(e)
		}
		const videoTrack = await Video.createLocalVideoTrack()
		const trackElement = videoTrack.attach()
		trackElement.style.transform = 'scale(-1, 1)'

		localParticipant.appendChild(trackElement)
	}

	const connectOrDisconnect = async identity => {
		if (!connected) {
			try {
				await connect(identity)
			} catch (error) {
				console.log('connectOrDisconnect', error)
				alert('Failed to connect to video room.', error)
			}
		} else {
			disconnect()
		}
	}

	const connect = async identity => {
		const roomName = 'room1'
		const devName = identity
		let token
		try {
			token = (await getToken(roomName, devName))?.token
		} catch (e) {
			console.log(e)
		}
		console.log('Token from server: ', token)
		const twilioRoom = await Video.connect(token)
		setLocalIdentity(identity)
		setRoom(twilioRoom)

		twilioRoom.participants.forEach(participantConnected)
		twilioRoom.on('participantConnected', participantConnected)
		twilioRoom.on('participantDisconnected', participantDisconnected)
		twilioRoom.on('disconnected', userDisconnect)
		setConnected(true)
	}

	const userDisconnect = async () => {
		console.log('user is disconnected')
		const currentUserId = userId || window?.location?.pathname?.split('/')[2]
		/** Check the user balance if not empty
		 *  1. User normally left the call
		 *  2. if the balance is 0 then show out of balance msg
		 */
		const user = await getUser(userId || window?.location?.pathname?.split('/')[2])
		/** Updating user state */
		setUser(user)
		if (currentUserId === 'userId') {
			if (user.balance > 0) {
				setNotificationMsg('User left call')
			} else {
				setNotificationMsg('❗Out of balance, Call disconnected')
			}
		} else {
			setNotificationMsg('User left the call')
		}
		setDisplayNotification(true)

		/** turn on the display notification */
		if (!displayNotification) {
			console.log('currentUserId: ', currentUserId)
			setTimeout(() => {
				setDisplayNotification(false)
			}, 3000)
		}

		/** After some seconds the page will automatically move to / */
		setTimeout(() => {
			navigate('/')
		}, 7000)
	}
	const disconnect = () => {
		try {
			console.log('in disconnect fn')
			room.disconnect()
			setConnected(false)
			setRemoteIdentity('')
			setLocalIdentity('')
		} catch (e) {
			console.log(e)
		}
	}

	const participantConnected = participant => {
		console.log(`RemoteParticipant ${participant.identity} is connected`)

		setCurrentParticipant(participant)
		const remoteParticipantContainer = document.getElementById('remoteParticipant')
		const mainContainer = document.getElementById('main')

		const tracksDiv = document.createElement('div')
		tracksDiv.setAttribute('id', participant.sid)
		setRemoteIdentity(participant.identity)

		participant.tracks.forEach(publication => {
			if (publication.isSubscribed) {
				trackSubscribe(tracksDiv, publication.track)
			}
		})

		console.log('participant.tracks ', participant.tracks)

		const audioContainer = document.getElementById('AudioParticipant')
		participant.on('trackSubscribed', async track => {
			if (!['developerId', 'userId'].includes(participant.identity)) {
				trackSubscribe(audioContainer, track)
			}
			console.log('outside of the video')
			if (track.kind === 'video') {
				if (track.name === 'screen') {
					console.log('inside track.names screen')
					/** check if the user stop sharing his screen */
					removeTrackFromDiv(mainContainer)
					removeTrackFromDiv(remoteParticipantContainer)
					trackSubscribe(mainContainer, track)

					participant.tracks.forEach(t => {
						if (t.isSubscribed && t.track.name !== 'screen') {
							trackSubscribe(remoteParticipantContainer, t.track)
						}
					})
				} else {
					console.log('inside else of track.names screen')
					setScreenTrackData(track)
					/** deattach tracks from the main container & local participant container */
					removeTrackFromDiv(remoteParticipantContainer)
					removeTrackFromDiv(mainContainer)
					mainContainer.innerHTML = ''
					remoteParticipantContainer.innerHTML = ''

					trackSubscribe(mainContainer, track)
					participant.tracks.forEach(t => {
						if (t.isSubscribed) {
							trackSubscribe(remoteParticipantContainer, t.track)
						}
					})
					// trackSubscribe(mainContainer, remoteTracks)
					setRemoteTracks(track)
				}
			}
		})

		participant.on('trackUnsubscribed', async track => {
			if (!['developerId', 'userId'].includes(participant.identity)) {
				removeTrackFromDiv(audioContainer)
			}
			console.log('track unsubscribed')
			/** Clear tracks from remoteparticipants */
			const remoteParticipantContainer = document.getElementById('remoteParticipant')
			const mainContainer = document.getElementById('main')

			removeTrackFromDiv(mainContainer)
			/** using stop sharing screen so put remote Pariticipant on main and clear remoteparticipant container */
			console.log('track.kind: ', track.kind)
			let screenShareOff = false
			if (track.kind !== 'screen') {
				/** put remoteParticipant on main container */
				screenShareOff = true
				removeTrackFromDiv(remoteParticipantContainer)
			}

			if (!screenShareOff) {
				track.detach().forEach(element => {
					element.remove()
				})
			}

			if (screenShareOff) {
				/** Putting participant tracks on main container */
				participant.tracks.forEach(t => {
					trackSubscribe(mainContainer, t.track)
				})
			}
		})
	}

	const participantDisconnected = participant => {
		const remoteParticipant = document.getElementById('remoteParticipant')
		remoteParticipant.removeChild(document.getElementById(participant.sid))
		setRemoteIdentity('')
	}

	const removeTrackFromDiv = div => {
		console.log('removeTrackFromDiv hit')
		const trackElement = div.querySelector('video')

		if (trackElement) {
			div.removeChild(trackElement)
		}
	}

	const trackSubscribe = (div, track) => {
		console.log('trackSubscribe hit')
		if (isScreenSharingEnabled) {
			const shareScreenContainer = document.querySelector('#screen_share_container')
			if (shareScreenContainer) {
				shareScreenContainer.innerHTML = ''
			}
		}
		console.log('trackSubcribe: ', JSON.stringify(track))
		const trackElement = track.attach()
		if (track.kind === 'video' && track.name !== 'screen') {
			trackElement.style.transform = 'scale(-1, 1)'
		}
		div.appendChild(trackElement)
	}

	const handleVideoToggle = () => {
		if (isUserVideoOff) {
			room.localParticipant.videoTracks.forEach(publication => {
				if (publication.track.name !== 'screen') {
					publication.track.disable()
				}
			})
			/** Cover the webcam of local particpant with black color */
			const localParticipantElement = document.querySelector('#localParticipant')
			localParticipantElement.style.backgroundColor = 'black'
			localParticipantElement.style.position = 'relative'
			const blackLayer = document.createElement('div')
			blackLayer.style.position = 'absolute'
			blackLayer.style.top = '0'
			blackLayer.style.left = '0'
			blackLayer.style.width = '100%'
			blackLayer.style.height = '100%'
			blackLayer.style.backgroundColor = 'rgba(17, 17, 17, 0.997)'
			blackLayer.style.zIndex = '100'
			blackLayer.setAttribute('id', 'blackLayer')
			localParticipantElement.appendChild(blackLayer)
		} else {
			const blackLayer = document.querySelector('#blackLayer')
			if (blackLayer) {
				const parentElement = blackLayer.parentElement
				parentElement.removeChild(blackLayer)
			}
			room.localParticipant.videoTracks.forEach(publication => {
				if (publication.track.name !== 'screen') {
					publication.track.enable()
				}
			})
		}
	}

	const handleMuteToggle = () => {
		if (!isUserMute) {
			room.localParticipant.audioTracks.forEach(publication => {
				publication.track.disable()
			})
		} else {
			room.localParticipant.audioTracks.forEach(publication => {
				publication.track.enable()
			})
		}
	}

	useEffect(() => {
		if (connected) {
			handleVideoToggle()
		}
	}, [isUserVideoOff])

	useEffect(() => {
		if (connected) {
			handleMuteToggle()
		}
	}, [isUserMute])

	async function shareScreenToggle() {
		if (!isScreenSharingEnabled) {
			await startScreenSharing()
		} else {
			stopScreenSharing()
		}
	}

	let screenTrack
	const startScreenSharing = async () => {
		setIsScreenSharingEnabled(true)

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia()
			const videoTrack = stream.getVideoTracks()[0]

			// Create a LocalVideoTrack using the retrieved video track
			screenTrack = new Video.LocalVideoTrack(videoTrack, {
				name: 'screen',
			})

			console.log('startScreenSharing-screenTrack: ', screenTrack)
			setScreenTrackData(screenTrack)

			await room.localParticipant.publishTrack(screenTrack)
			// trackSubscribe(remoteParticipantContainer)

			const remoteParticipantContainer = document.getElementById('remoteParticipant')

			/** Clean Main Container for remote user webcam*/
			const mainContainer = document.getElementById('main')
			if (mainContainer) {
				mainContainer.innerHTML = ''
			}

			screenTrack.once('stopped', async () => {
				await room.localParticipant.unpublishTrack(screenTrack)
				setIsScreenSharingEnabled(false)
			})

			const screenShareVideo = document.createElement('video')
			screenShareVideo.innerHTML = ''
			screenShareVideo.srcObject = stream
			screenShareVideo.autoplay = true
			mainContainer.appendChild(screenShareVideo)

			currentParticipant.tracks.forEach(publication => {
				trackSubscribe(remoteParticipantContainer, publication.track)
			})
		} catch (error) {
			console.error('Error sharing the screen:', error)
			setIsScreenSharingEnabled(false)
		}
	}

	const stopScreenSharing = () => {
		if (isScreenSharingEnabled === true) {
			if (room) {
				screenTrackData.stop()
				room.localParticipant.unpublishTrack(screenTrackData)
				screenTrack = null
				document.querySelector('#main').innerHTML = ''
			}
			setIsScreenSharingEnabled(false)

			/**
			 * switch back the remote webcam in main container
			 * deattach track from main
			 * attach the remote webcam tracks
			 */
			const mainContainer = document.querySelector('#main')
			const remoteParticipantContainer = document.getElementById('remoteParticipant')
			removeTrackFromDiv(remoteParticipantContainer)
			removeTrackFromDiv(mainContainer)
			currentParticipant.tracks.forEach(publication => {
				trackSubscribe(mainContainer, publication.track)
			})
		}
	}

	return (
		<div>
			{displayNotification && <NotificationMessage message={notificationMsg} />}
			<Container>
				<ScreensWrapper>
					<Main id="main"></Main>
					<SideContainer>
						<RemoteParticipant id="remoteParticipant"></RemoteParticipant>
						<LocalParticipant id="localParticipant"></LocalParticipant>
						<AudioParticipant></AudioParticipant>
						<ChatScreen userId={userId || window?.location?.pathname?.split('/')[2]} />
					</SideContainer>
				</ScreensWrapper>
				<InCallControlsContainer>
					<AudioToggle />
					<VideoToggle />
					<ShareScreenToggleButton onClick={shareScreenToggle}>
						<img src={shareScreen} width={'70%'} />
					</ShareScreenToggleButton>
					<ChatToggle />
					<EndCall
						onClick={() => {
							if (connected) {
								disconnect()
							}
							navigate('/')
						}}
					/>
				</InCallControlsContainer>
			</Container>
		</div>
	)
}
