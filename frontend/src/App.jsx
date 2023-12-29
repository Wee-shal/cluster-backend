import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from 'react-router-dom'

import HomePage from './HomePage'
import UserState from './state/userState'
import WalletProfile from './WalletProfile'
import ProfilePage from './Profile'
import LoginPage from './LoginPage'
import GlobalStyles from './components/GlobalStyles'
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<HomePage />}  />
			<Route path="/profile/:userId" element={<ProfilePage />} />
			<Route path="/profile" element={<ProfilePage />} />
			<Route path="/payment" element={<WalletProfile />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/login" component={LoginPage} />
		</Route>
	)
)

function App() {
	return (
		<UserState>
			<GlobalStyles />
			<RouterProvider router={router} />
		</UserState>
	)
}

export default App
