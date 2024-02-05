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
import AVCallPage from './AVCallPage'
import GlobalStyles from './components/GlobalStyles'
import Policy from './components/policy'
import UserAgreement from './components/UserAgreement'
import CookiePolicy from './components/CookiePolicy'
import TransactionPage from './TransactionPage'
import "./global.css"
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<HomePage />} />
			<Route path="/profile/:userId" element={<ProfilePage />} />
			<Route path="/profile/:devName/call" element={<AVCallPage />} />
			<Route path="/payment" element={<WalletProfile />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/login" component={LoginPage} />
			<Route path="/call" component={AVCallPage} />
			<Route path="/Policy" element={<Policy />} />
			<Route path='/UserAgreement' element={<UserAgreement/>}/>
			<Route path='/CookiePolicy'  element={<CookiePolicy/>}/>
			<Route path="/transactions" element={<TransactionPage />} />
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
