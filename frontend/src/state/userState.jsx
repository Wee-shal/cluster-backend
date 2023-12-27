import { createContext, useState } from 'react'

//create a context, with createContext api
export const userContext = createContext()

const userState = props => {
	// this state will be shared with all components
	const [isUserMute, setIsUserMute] = useState(false)
	const [isUserVideoOff, setIsUserVideoOff] = useState(false)
	const [isScreenSharingEnabled, setIsScreenSharingEnabled] = useState(false)
	const [isChatVisible, setIsChatVisible] = useState(false)
	const [userBalance, setUserBalance] = useState(0)
	const [user, setUser] = useState({})

	return (
		// this is the provider providing state
		<userContext.Provider
			value={{
				user,
				setUser,
				isUserMute,
				setIsUserMute,
				isUserVideoOff,
				setIsUserVideoOff,
				isScreenSharingEnabled,
				setIsScreenSharingEnabled,
				isChatVisible,
				setIsChatVisible,
				userBalance,
				setUserBalance,
			}}
		>
			{props.children}
		</userContext.Provider>
	)
}

export default userState
