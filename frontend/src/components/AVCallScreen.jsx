import React, { useEffect, useRef } from 'react'
import useState from 'react-usestateref' // see this line

import Video from 'twilio-video'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { endAudioVideoCall, getToken } from '../services/tokenService'
import { AudioToggle } from './buttons/AudioToggle'
import { VideoToggle } from './buttons/VideoToggle'
import { EndCall } from './buttons/EndCall'
import { userContext } from '../state/userState'
import shareScreen from '../assets/icons/shareScreen.svg'
import ChatScreen from './ChatScreen'
import { ChatToggle } from './buttons/ChatToggle'
import { getUser } from '../services/helpers'

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
		bottom: 0.2rem;
		gap: 0.5rem;
		left: 0.5rem;
		right: 0.5rem;
		justify-content: center;
	}
`
const ShareScreenToggleButton = styled.button`
	background-color: gray;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: black;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
`

export default function AVCallScreen({ userId }) {

    const [remoteParticipant, setRemoteParticipant] = useState(null)
    const [isScreenSharingEnabled, setIsScreenSharingEnabled, isScreenSharingEnabledRef] = useState(false)
	const [isRemoteScreenSharingEnabled, setIsRemoteScreenSharingEnabled, isRemoteScreenSharingEnabledRef] = useState(false)
    const [room, setRoom, roomRef] = useState(null)
    const [isRoomConnected, setIsRoomConnected] = useState(false)
    const [localScreenTrack, setLocalScreenTrack, localScreenTrackRef] = useState(null)
    const [localVideoTrack, setLocalVideoTrack, localvideoTrackRef] = useState(null)

    const handleDisconnected= room => console.log('disconnected ', room)

	const connect = async () => {
        
        if(roomRef.current) {
            console.log("Already connected")
            return
        }

        let twilioRoom
 
		let token = (await getToken("room4", userId))?.token
		console.log('Token from server: ', token)
		twilioRoom = await Video.connect(token)
        setRoom(twilioRoom)

		twilioRoom.participants.forEach(handleParticipantConnected)
		twilioRoom.on('participantConnected', handleParticipantConnected)
		twilioRoom.on('participantDisconnected', handleParticipantDisconnected)
		twilioRoom.on('disconnected', handleDisconnected)
		twilioRoom.on('trackSubscribed', handleTrackSubscribed)
        twilioRoom.on('trackUnsubscribed', handleTrackUnsubscribed)
        twilioRoom.on('trackUnpublished', handleTrackUnpublished)
        
        setIsRoomConnected(true)
        console.log("connection successful")
	}

	const disconnect = async () => {
		try {
            if (roomRef.current && isRoomConnected) {
                console.log('in disconnect fn: ', roomRef.current, isRoomConnected)
                await roomRef.current.disconnect()
                setIsRoomConnected(false)
            } else {
                console.log("Already disconnected")
            }
		} catch (e) {
			console.log(e)
		}
	}

    setInterval(async () => { await disconnect(); useNavigate('/') }, 179000);

    const removeTrackFromDiv = (divID, track) => {
        const div = document.getElementById(divID)
        const childId = divID + '-child' + (track.kind || track.name)
        document.getElementById(childId)?.remove()
    }

    const attachLocalVideoTrack = async () => {
        const videoTrack = await Video.createLocalVideoTrack()
        // attachTrackToDiv('localVideo', videoTrack)
        videoTrack.attach('#localVideo-video')
	}

    const getLocalScreenShareTrack = async () => {
        try {
			const stream = await navigator.mediaDevices.getDisplayMedia()
			const videoTrack = stream.getVideoTracks()[0]
            let screenTrack = new Video.LocalVideoTrack(videoTrack, {
				name: 'screen',
			})
            return screenTrack
        } catch (e) {
            console.log(e)
        }
    }

    const handleParticipantConnected = participant => {
		console.log(`RemoteParticipant connected: ${participant}`)
        setRemoteParticipant(participant)

		participant.on('trackUnpublished', handleTrackUnpublished)

		// Subscribe to the tracks of the connected participant
		participant.tracks.forEach(publication => {
			if (publication.isSubscribed) {
                if (publication.track.name === 'screen') {
                    setIsRemoteScreenSharingEnabled(true)
                    // attachTrackToDiv('remoteScreen', publication.track)
                    publication.track.attach('#remoteScreen-video')
                } else if (publication.track.kind === 'video' || publication.track.kind === 'audio') {
                    // attachTrackToDiv('remoteVideo', publication.track)
                    // attachTrackToDiv('remoteVideo2', publication.track)
                    publication.track.attach('#remoteVideo-video')
                    publication.track.attach('#remoteVideo2-video')
				}
			} else {
				publication.on('subscribed', track => {
                    if (track.name === 'screen') {
                        setIsRemoteScreenSharingEnabled(true)
                        // attachTrackToDiv('remoteScreen', track)
                        track.attach('#remoteScreen-video')
                    } else if (track.kind === 'video' || track.kind === 'audio') {
                        // attachTrackToDiv('remoteVideo', track)
                        // attachTrackToDiv('remoteVideo2', publication.track)
                        track.attach('#remoteVideo-video')
                        track.attach('#remoteVideo2-video')
                    }
				})
			}
		})
	}

    const handleParticipantDisconnected = participant => {
		setRemoteParticipant(null)
	}

    const handleTrackSubscribed = track => {
		if (track.name === 'screen') {
			console.log('Remote participant started sharing screen.')
            setIsRemoteScreenSharingEnabled(true)
			// attachTrackToDiv('remoteScreen', track)
            track.attach('#remoteScreen-video')
		}
	}

    const handleTrackUnsubscribed = track => {
        console.log(track.kind, track.name, track.trackName)
        if (track.name === 'screen') {
            // removeTrackFromDiv('remoteScreen', track)
            track.detach('#remoteScreen-video')
        } else if (track.kind === 'video' || track.kind === 'audio') {
            // removeTrackFromDiv('remoteVideo', track)
            // removeTrackFromDiv('remoteVideo2', track)
            track.detach('#remoteVideo-video')
            track.detach('#remoteVideo2-video')
        }
    }

    const handleTrackUnpublished = track => {
        console.log("track unpublished: ", track.kind)
		if (track.trackName === 'screen') {
			console.log('Remote stopped sharing screen')
            setIsRemoteScreenSharingEnabled(false)
            // removeTrackFromDiv('remoteScreen', track)
            track.detach('#remoteScreen-video')
		}
	}

    const startScreenSharing = async () => {
        console.log(roomRef.current)
		if (!roomRef.current || isScreenSharingEnabledRef.current) {
            console.log("no room to share screen in")
			return
		}

		try {
            const screenTrack = await getLocalScreenShareTrack()
			await roomRef.current.localParticipant.publishTrack(screenTrack)
            setLocalScreenTrack(screenTrack)
            screenTrack.attach('#localScreen-video')            
            setIsScreenSharingEnabled(true)

            console.log('Local participant started sharing screen.')
            
            screenTrack.once('stopped', async () => {
                console.log("about to stop")
                await stopScreenSharing()
			})
		} catch (error) {
            setIsScreenSharingEnabled(false)
			console.error('Error sharing the screen:', error)
		}
	}

    const stopScreenSharing = async () => {
        console.log("stopping ", isScreenSharingEnabledRef.current)
		if (isScreenSharingEnabledRef.current) {
			setIsScreenSharingEnabled(false)
			// Stop screen sharing for local participant
			if (roomRef.current && localScreenTrackRef.current) {
                localScreenTrackRef.current.detach('#localScreen-video')
                // removeTrackFromDiv('localScreen', localScreenTrackRef.current)
				await roomRef.current.localParticipant.unpublishTrack(localScreenTrackRef.current)
                localScreenTrackRef.current.stop();
				setLocalScreenTrack(null)
			}
			console.log('remove screen sharing')
		}
	}

    useEffect(() => {
		;(async () => {
            await navigator.mediaDevices.getUserMedia({video: true, audio: false})
			await attachLocalVideoTrack()
			await connect(userId)
            console.log("in use effect: ", roomRef.current)
		})()
	}, [])

    return (
        <div>
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#f0f0f0', padding: '20px', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div id='remoteScreen' style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', display: isRemoteScreenSharingEnabledRef.current ? 'block' : 'none' }}>
                        <video id="remoteScreen-video" autoplay></video>
                    </div>
                    <div id='localScreen' style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', display: isScreenSharingEnabledRef.current && !isRemoteScreenSharingEnabledRef.current ? 'block' : 'none' }}>
                        <video id="localScreen-video" autoplay></video>
                    </div>
                    <div id='remoteVideo' style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', display: !isScreenSharingEnabledRef.current && !isRemoteScreenSharingEnabledRef.current ? 'block' : 'none' }}>
                        <video id="remoteVideo-video" autoplay></video>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
                    <div id='remoteVideo2' style={{ width: '100%', maxHeight: '50%', marginBottom: '10px', objectFit: 'contain', display: isScreenSharingEnabledRef.current || isRemoteScreenSharingEnabledRef.current ? 'block' : 'none' }}>
                        <video id="remoteVideo2-video" autoplay></video>
                    </div>
                    <div id='localVideo' style={{ width: '100%', maxHeight: '50%', objectFit: 'contain' }}>
                        <video id="localVideo-video" autoplay></video>
                    </div>
                </div>
            </div>
            <InCallControlsContainer>
					<ShareScreenToggleButton onClick={async () => {
                        if (isScreenSharingEnabled) {
                            // screen already being shared
                            return
                        }
                        await startScreenSharing()
                    }}>
						<img src={shareScreen} width={'70%'} />
					</ShareScreenToggleButton>
					<ChatToggle />
					<EndCall
						onClick={async () => {
                            await disconnect()
							//useNavigate('/')
						}}
					/>
				</InCallControlsContainer>
        </div>
    );
}
