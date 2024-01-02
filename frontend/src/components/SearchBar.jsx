import styled from 'styled-components'
import algoliasearch from 'algoliasearch/lite'
import {useState} from 'react'
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import magnifyingGlassSvg from '../assets/icons/magnifyingGlass.svg'
import { algoliaAppId, algoliaSearchApiKey } from '../config'
import DeveloperCard from './DeveloperCard'
import Wallet from './Wallet'
import Signin from './buttons/Signin'

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
	align-items: center; /* Center items vertically */
`

const TextLogo = styled.div`
	font-size: 1.5rem;
	font-weight: bold;
	padding: 0 16px;
	color: white;
`
const SearchBarContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #d8d8d8;
	border-radius: 8px;
	padding: 6px;
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
	}

	

	/* Ensure consistent styling for input[type='search'] */
	.ais-SearchBox-input[type='search']::-webkit-search-cancel-button {
		display: none;
	}

	/* Add any additional styles you want to keep consistent */

	/* Sidebar styling (if applicable) should be defined separately */

	/* Add any other styles for maintaining consistency */
`;


// const SearchBarContainer = styled.div`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center; /* Center the search bar */
// 	border: 1px solid #d8d8d8;
// 	border-radius: 8px;
// 	padding: 6px;
// 	margin: auto;
// 	max-width: 500px; /* Set the maximum width to 500px */
// 	width: 100%; /* Take up full width on smaller screens */
// 	background-color: white; /* Set the background color to white */

// 	.ais-SearchBox-form {
// 		display: flex;
// 		justify-content: space-between;
// 	}

// 	.ais-SearchBox-submit {
// 		display: none;
// 	}

// 	.ais-SearchBox-input {
// 		border: none;
// 		outline: none;
// 		flex: 1;
// 	}

// 	.ais-SearchBox-resetIcon {
// 		padding: 0.5rem 1rem;
// 		cursor: pointer;
// 	}

// 	.ais-SearchBox-input[type='search']::-webkit-search-cancel-button {
// 		display: none;
// 	}
// `

const AlgoliaSearchBar = styled(SearchBox)`
	width: 100%;
	padding-left: 0.2rem;
`

const MagnifyingGlassIcon = styled.img`
	margin-right: 8px;
	cursor: pointer;
	width: 20px; /* Set a fixed width for the icon */
`

const SignInButtonContainer = styled.div`
	margin-right: 16px; /* Adjust as needed */
	background-color: #333; /* Grey background */
	padding: 8px; /* Add padding for better visibility */
	border-radius: 8px; /* Optional: Add border-radius for rounded corners */
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

export default function SearchBar() {
  const [anchorEl, setAnchorEl] = useState(null)
	async function handleSearch(e) {
		e.preventDefault()
		const inputValue = e.target.value
		console.log('Input value:', inputValue)
	}
	const handleClick = () => {
		// Navigate to the home page
		window.location.href = '/'
	}

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    console.log(`Clicked on ${menuItem}`);
    handleClose();
    {/*logout*/}
    if(menuItem === 'Logout'){
      //logic for clearing session, tokens etc.
      window.localStorage.removeItem('id');

      //reloading of page and other actions if needed
      window.location.href='/';  //home page
    }
  };

	return (
		<div>
			<TopHeader />
			<InstantSearch searchClient={searchClient} indexName="newproj">
				<TopSection>
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
				</TopSection>
				<ResultsContainer>
					<Hits hitComponent={SearchResult} />
				</ResultsContainer>
			</InstantSearch>
		</div>
	)
}

SearchResult.propTypes = {
	hit: PropTypes.object.isRequired,
}