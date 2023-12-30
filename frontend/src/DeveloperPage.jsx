import { isSupported } from 'twilio-video'
import SearchBar from './components/SearchBar'
export default function DeveloperPage() {
	if (!isSupported) {
		console.log('This browser is not supported!')
	}

	return (
		<>
			<SearchBar />
			</>
	)
}
