import styled from 'styled-components'
import algoliasearch from 'algoliasearch/lite'
import { useState } from 'react'
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import magnifyingGlassSvg from '../assets/icons/magnifyingGlass.svg'
import { algoliaAppId, algoliaSearchApiKey } from '../config'
import DeveloperCard from './DeveloperCard'
import Wallet from './Wallet'
import Signin from './buttons/Signin'

import { Input } from '@mui/material'

const searchClient = algoliasearch(algoliaAppId, algoliaSearchApiKey)
const idFromUrl = window.localStorage.getItem('id')
console.log('id', idFromUrl)

const TopHeader = styled.header`
	background-color: #333;
	height: 1px;
	margin: 0;
`
const TopSection = styled.div`
	background-color: #333;
	margin: 0;
	padding: 0.4rem;
	color: white;
	position: sticky;
	top: 0;
	z-index: 1000;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap; /* Center items vertically */
`

const TextLogo = styled.div`
	font-size: 1rem;
	font-weight: bold;
	padding: 0.6vw;
	margin-top: 13px;
	color: white;

	@media (max-width: 768px) {
		/* Adjust font size for smaller screens */
		font-size: 1rem;
	}
`
const SearchBarContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #d8d8d8;
	border-radius: 8px;
	padding: 2px;
	margin: auto;
	max-width: 500px;
	width: 100%;
	background-color: white;

	/* Remove styles that change appearance on interaction */
	.ais-SearchBox-form {
		display: flex;
		justify-content: space-between;
	}

	.ais-SearchBox-submit {
		display: none;
	}

	.ais-SearchBox-input {
		border: none;
		outline: none;
		flex: 1;
		flex: 1;
		padding: 8px; /* Add padding to the input */
		border-bottom: none;
	}

	.ais-SearchBox-reset {
		/* Add styles to remove rectangular border and set the color to black */
		background: none;
		border: none;
		cursor: pointer;
		color: black;
	}

	/* Ensure consistent styling for input[type='search'] */
	.ais-SearchBox-input[type='search']::-webkit-search-cancel-button {
		display: none;
	}

	/* Add any additional styles you want to keep consistent */

	/* Sidebar styling (if applicable) should be defined separately */

	/* Add any other styles for maintaining consistency */
	@media (max-width: 768px) {
		/* Adjust styles for smaller screens */
		max-width: 100%;
	}
`

const AlgoliaSearchBar = styled(SearchBox)`
	width: 100%;
`

const SignInButtonContainer = styled.div`
	margin-right: 16px; /* Adjust as needed */
	background-color: #333; /* Grey background */
	padding: 8px; /* Add padding for better visibility */
	border-radius: 8px; /* Optional: Add border-radius for rounded corners */

	display: flex;
	align-items: center;

	/* Adjust as needed for smaller screens */
	@media (max-width: 768px) {
		padding: 6px;
		margin-right: 8px;
	}
`

const SearchResult = ({ hit }) => (
	// Assuming DeveloperCard component is imported and implemented elsewhere
	<DeveloperCard
		hit={hit}
		name={hit.name}
		profilePic={hit.profilePic}
		description={hit.description}
		rates={hit.rates}
	/>
)

const ResultsContainer = styled.div`
	margin: 1rem auto;
	width: 80%;
	ol {
		list-style-type: none;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 2rem;
	}
`
const WalletMenuItem = styled(MenuItem)`
  margin-bottom: 10px; // Add margin to the bottom of the Wallet menu item
`;

export default function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState([])

	const [anchorEl, setAnchorEl] = useState(null)
	const handleSearch = async e => {
		console.log('handleSearch called')
		const inputValue = e.target.value
		console.log('Input value:', inputValue)
		setSearchTerm(inputValue)

		if (inputValue.trim() !== '') {
			// Perform Algolia search
			const { hits } = await searchClient.initIndex('newproj').search(inputValue)
			console.log('Algolia hits:', hits)

			setSearchResults(hits)
		} else {
			setSearchResults([])
		}
	}
	// async function handleSearch(e) {
	// 	e.preventDefault()
	// 	const inputValue = e.target.value
	// 	console.log('Input value:', inputValue)
	// }
	const handleClick = () => {
		// Navigate to the home page
		window.location.href = '/'
	}

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleMenuItemClick = menuItem => {
		console.log(`Clicked on ${menuItem}`)
		handleClose()
		{
			/*logout*/
		}
		if (menuItem === 'Logout') {
			//logic for clearing session, tokens etc.
			window.localStorage.removeItem('id')

			//reloading of page and other actions if needed
			window.location.href = '/' //home page
		}
	}

	return (
		<div>
			<TopHeader />
			<InstantSearch searchClient={searchClient} indexName="newproj">
				<div>
					{/* Set max-width and margin for the entire content, adjust as needed */}
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',

							backgroundColor: 'black',
							alignItems: 'center',
						}}
					>
						{/* First child div */}
						<div
							style={{
								boxSizing: 'border-box',
								padding: '10px',
								marginBottom: '10px',
								alignItems: 'center',
							}}
						>
							<div
								style={{ cursor: 'pointer', textDecoration: 'none' }}
								onClick={handleClick}
							>
								<TextLogo>Konnect</TextLogo>
							</div>
							{/* Content for the first div */}
						</div>

						{/* Second child div */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								boxSizing: 'border-box',
								padding: '8px',
								marginBottom: '15px',
								backgroundColor: 'white',
								borderRadius: '10px',
								marginTop: '20px',
								flex: 1, // Make the search bar expand to take maximum space
							}}
						>
							<Input
								onChange={handleSearch}
								placeholder="Search..."
								disableUnderline={true}
								style={{ width: '100%' }}
								inputProps={{
									style: {
										border: 'none',
										outline: 'none',
									},
								}}
							/>

							{/* Content for the second div */}
						</div>

						{/* Third child div */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								padding: '5px',
								alignItems: 'center',
								position: 'relative',
								top: '0', // Align to the top of the screen
								right: '0',
								zIndex: '999',
								marginLeft: '50px',
							}}
						>
							{/* Content for the third div */}
							{idFromUrl ? (
								<>
									{/* fourth child div start */}
									<div
										style={{
											justifyContent: 'center',
											alignItems: 'center',

											padding: '10px',

											marginTop: '10px',
										}}
									>
										<IconButton
											aria-label="account of current user"
											aria-controls="menu-appbar"
											aria-haspopup="true"
											onClick={handleMenuClick}
											style={{ color: 'white' }}
										>
											<AccountCircleRoundedIcon
												fontSize="large"
												style={{
													alignItems: 'center',
													marginRight: '30px',
													padding: 0,
												}}
											/>
										</IconButton>
										<Menu
											id="menu-appbar"
											anchorEl={anchorEl}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											getContentAnchorEl={null}
											open={Boolean(anchorEl)}
											onClose={handleClose}
										>
											<MenuItem
												style={{
													fontSize: '1.3rem',
													marginRight: '10px',
													marginLeft: '10px',
													border: '1px solid #ccc', // Border style
													padding: '8px 16px', // Padding to create space around the text
												}}
											>
												<WalletMenuItem>
												<Wallet />
												</WalletMenuItem>
											</MenuItem>

											<MenuItem
												style={{
													fontSize: '1.3rem',
													marginRight: '10px',
													marginLeft: '10px',
													border: '1px solid #ccc', // Border style
													padding: '8px 16px', // Padding to create space around the text
												}}
												onClick={() => handleMenuItemClick('Logout')}
											>
												Logout
											</MenuItem>
										</Menu>
										{/* fourth chid div end */}
									</div>
								</>
							) : (
								<Signin />
							)}
						</div>
					</div>
				</div>
				{/* <TopSection>
					<div
						style={{ cursor: 'pointer', textDecoration: 'none' }}
						onClick={handleClick}
					>
						<TextLogo>konnect </TextLogo>
					</div>
					<SearchBarContainer>
						<MagnifyingGlassIcon src={magnifyingGlassSvg} alt="Search" width={'25px'} />
						<AlgoliaSearchBar onInput={handleSearch} placeholder="Search..." />
					</SearchBarContainer>
					<SignInButtonContainer>
						{idFromUrl ? (
							<>
								<Wallet />
								<div className="pressable-icon">
									<IconButton
										aria-label="account of current user"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={handleMenuClick}
										style={{ color: 'white' }}
									>
										<AccountCircleRoundedIcon fontSize="large" />
									</IconButton>
									<Menu
										id="menu-appbar"
										anchorEl={anchorEl}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										getContentAnchorEl={null}
										open={Boolean(anchorEl)}
										onClose={handleClose}
									>
										<MenuItem
											style={{
												fontSize: '1.3rem',
												marginRight: '10px',
												marginLeft: '10px',
											}}
											onClick={() => handleMenuItemClick('Logout')}
										>
											Logout
										</MenuItem>
									</Menu>
								</div>
							</>
						) : (
							<Signin />
						)}
					</SignInButtonContainer>
				</TopSection> */}
				<ResultsContainer>
					<Hits hitComponent={SearchResult} />
				</ResultsContainer>
			</InstantSearch>
			{/* <div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh', // Set the height of the container to the full viewport height
				margin: 0, // Remove default margin
				textAlign: 'center' // Optionally center the text within the container
			  }}>
				<h1>footer</h1>
			</div> */}
		</div>
	)
}

SearchResult.propTypes = {
	hit: PropTypes.object.isRequired,
}
