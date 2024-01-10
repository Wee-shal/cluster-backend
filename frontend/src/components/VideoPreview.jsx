import { useEffect, useContext, useRef } from 'react'
import styled from 'styled-components'
import { userContext } from '../state/userState'

const VideoPreviewWrapper = styled.div`
	background-color: black;
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
	outline: 1px solid gray;
	margin: auto;
`

const VideoContainer = styled.video`
	width: 100%;
	height: 100%;
	transform: scaleX(-1);
	height: 30vh;
	width: 100%;
	margin: auto;

	@media (max-width: 768px) {
		display: flex;
		justify-content: center;
		align-items: center;
		justify-items: center;
	}
`
export default function VideoPreview() {
	const { isUserVideoOff, isUserMute } = useContext(userContext)
	const videoRef = useRef(null)

	useEffect(() => {
		const startPreview = async () => {
			try {
				let stream
				if (!isUserVideoOff) {
					stream = await navigator.mediaDevices.getUserMedia({
						video: !isUserVideoOff,
						audio: !isUserMute,
					})
					if (videoRef.current) {
						videoRef.current.srcObject = stream
						videoRef.current.play()
					}
				} else {
					stream = await navigator.mediaDevices.getUserMedia({
						video: false,
						audio: !isUserMute,
					})
					if (videoRef.current) {
						videoRef.current.srcObject = stream
						videoRef.current.play()
					}
				}
			} catch (error) {
				console.error('Error accessing webcam:', error)
			}
		}

		startPreview()

		return async () => {
			const stream = videoRef.current.srcObject
			if (stream) {
				const tracks = stream.getTracks()
				tracks.forEach(track => track.stop())
			}
		}
	}, [isUserVideoOff, isUserMute])

	return (
		<div>
			<h4 style={{ textAlign: 'center' }}>Webcam Preview</h4>
			<VideoPreviewWrapper>
				<VideoContainer ref={videoRef} muted />
			</VideoPreviewWrapper>
		</div>
	)
}
