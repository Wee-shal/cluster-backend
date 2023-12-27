import { useState, useEffect } from 'react'
import styled from 'styled-components'
import BackButton from './components/buttons/BackButton'
import { useParams } from 'react-router-dom'
import { getUser } from './services/helpers'
import Loader from '../src/assets/loading.gif'

const Triangle = styled.div`
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: 70vh 70vw 0 0;
	border-color: #000000 transparent transparent transparent;
	transform: rotate(0deg);
	position: absolute;
	z-index: 0;
	@media (max-width: 768px) {
		border-width: 60vh 70vw 0 0;
	}
`

const ProfileImage = styled.img.attrs(({ src }) => ({
	src,
}))`
	z-index: 1;
	padding: 0.2rem;
	width: 10%;
	margin: auto;
	margin-top: 5rem;
	background-color: white;
	border-radius: 50%;
	@media (max-width: 768px) {
		margin-top: 2rem;
		width: 30%;
	}
`

const Container = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	margin-bottom: 2rem;
`
const NameContainer = styled.h2`
	margin-top: 1.5rem;
	font-size: 1.5rem;
	color: black;

	@media (max-width: 768px) {
		background-color: white;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
	}
`

const SpecialityContainer = styled.p`
	margin-top: 1.2rem;
`

const UserIdContainer = styled.p`
	margin-top: 1.2rem;
`
const ContactMe = styled.p`
	margin-top: 1.3rem;
	border: none;
	font-weight: bold;
`
const Review = styled.p``
const DescriptionContainer = styled.p`
	margin-top: 2rem;
	width: 70ch;

	@media (max-width: 768px) {
		max-width: 30ch;
	}
`
const SkillContainer = styled.p`
	margin-top: 2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;

	@media (max-width: 768px) {
		margin: auto;
		margin-top: 2rem;
		width: 85%;
	}
`

const ButtonWrapper = styled.div`
	margin-top: 1rem;
	display: flex;
	gap: 1rem;
	justify-content: center;
	align-items: center;
`
const PhoneCallButton = styled.button`
	cursor: pointer;
	padding: 0.3rem 0.7rem;
	align-self: flex-end;
	border: none;
	border-radius: 24px;
`

const VideoCallButton = styled.button`
	cursor: pointer;
	padding: 0.3rem 0.7rem;
	align-self: flex-end;
	border: none;
	border-radius: 24px;
`

const PageLoaderContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`
const LoadingImage = styled.img`
	width: 100px;
`

export default function ProfilePage() {
	const { userId } = useParams()
	console.log('userId: ', userId)
	const [user, setUser] = useState()

	useEffect(() => {
		console.log('useEffecting..')
		;(async () => {
			try {
				const userDetails = await getUser(userId)
				setUser(userDetails)
			} catch (e) {
				console.log(e)
			}
		})()
	}, [])

	const UserProfilePage = () => (
		<>
			<Triangle></Triangle>
			<Container>
				<BackButton />
				<ProfileImage src={user?.profilePic} />
				<NameContainer>Name: {user.name}</NameContainer>
				<SpecialityContainer>Web Designer</SpecialityContainer>
				<UserIdContainer>@{user.name}</UserIdContainer>
				<Review>1k+ review 4.5 </Review>
				<ButtonWrapper>
					<ContactMe>Contact Me:</ContactMe>
					<PhoneCallButton>Phone Call</PhoneCallButton>{' '}
					<VideoCallButton>Video Call</VideoCallButton>
				</ButtonWrapper>
				<br />
				<DescriptionContainer>
					<h3 style={{ textAlign: 'center' }}>Description:</h3> <br />
					{user.description}
				</DescriptionContainer>
				<br /> <br />
				<h3 style={{ textAlign: 'center', marginTop: '2rem' }}>Skills</h3>
				<SkillContainer>
					{user.skills.map(item => (
						<div
							style={{
								borderRadius: '10%',
								padding: '.7rem 2rem',
								border: '1px solid black',
							}}
							key={item}
						>
							{item}
						</div>
					))}
				</SkillContainer>
			</Container>
		</>
	)

	const PageLoader = () => (
		<PageLoaderContainer>
			<LoadingImage src={Loader} alt="Loading..." />
		</PageLoaderContainer>
	)
	return <>{user ? <UserProfilePage /> : <PageLoader />}</>
}
