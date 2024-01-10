import styled from 'styled-components';
import algoliasearch from 'algoliasearch/lite';
import { useState, useContext, useEffect } from 'react';
import { InstantSearch } from 'react-instantsearch';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { algoliaAppId, algoliaSearchApiKey } from '../config';
import { getUser } from '../services/helpers';
import { userContext } from '../state/userState';
import DeveloperCard from './DeveloperCard';
import Signin from './buttons/Signin';

const searchClient = algoliasearch(algoliaAppId, algoliaSearchApiKey);
const idFromUrl = window.localStorage.getItem('id');

const TopHeader = styled.header`
  background-color: #333;
  height: 1px;
  margin: 0;
`;

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
`;

const TextLogo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.6vw;
  margin-top: 30px;
  color: white;
  margin-right:15px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Container = styled.div`
  background-color: white;
  padding: 0.2rem 0.002rem;
  color: #080808;
  outline: ${({ balance }) => (balance === 0 ? '' : balance < 20 ? '' : '')};
  cursor: pointer;
`;

const BalanceText = styled.div``;

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const allCards = await searchClient.initIndex('newproj').search('');
        setSearchResults(allCards.hits);

        const id = window.localStorage.getItem('id');
        const userData = await getUser(id);
        setUser(userData || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [setUser]);

  const handleSearch = async (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue.trim() === '') {
      try {
        const allCards = await searchClient.initIndex('newproj').search('');
        setSearchResults(allCards.hits);
      } catch (error) {
        console.error('Error fetching all cards:', error);
      }
    } else {
      try {
        const { hits } = await searchClient.initIndex('newproj').search(inputValue);
        setSearchResults(hits);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleClick = () => {
    window.location.href = '/';
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setID] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedId = window.localStorage.getItem('id');
    if (storedId) {
      setID(storedId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser(id);
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleNavigateToPolicy = (e) => {
    e.preventDefault();
    navigate('../policy');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    handleClose();
    if (menuItem === 'Logout') {
      window.localStorage.removeItem('id');
      window.location.href = '/';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopHeader />
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0',
          margin:'0',
          flexWrap:'wrap',

          
        }}
      >
        <div style={{ cursor: 'pointer', textDecoration: 'none', marginRight:'10px'}} onClick={handleClick}>
          <TextLogo>Konnect</TextLogo>
        </div>
        <div
          style={{
            display:'flex',
            justifyContent: 'flex-start',
                  boxSizing: 'border-box',
                  padding: '4px',
                  marginBottom: '30px',
                  backgroundColor: 'white',
            borderRadius: '10px',
            marginTop:'25px',

            flex: 1,
          }}
        >
          <Input
            onChange={handleSearch}
            placeholder="Search..."
            disableUnderline={true}
            style={{ width: '100%', padding: '10', fontSize: '14px' }}
            inputProps={{
              style: {
                border: 'none',
                outline: 'none',
              },
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '5px',
            alignItems: 'center',
            position: 'relative',
            top: '0',
            right: '0',
            zIndex: '999',
            marginLeft: '50px',
          }}
        >
          {idFromUrl ? (
            <>
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
                    style={{ alignItems: 'center', marginRight: '30px', padding: 0 }}
                  />
                </IconButton>
                <h1 style={{ margin: 0, fontSize: '0.8rem', marginLeft: '4px', color: 'white' }}>
                  {userName}
                </h1>
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
                      border: '1px solid #ccc',
                      padding: '8px 16px',
                    }}
                  >
                    <Container balance={user?.balance} onClick={() => navigate('/payment')}>
                      <BalanceText>
                        Balance: {user?.currency} {user?.balance?.toFixed(2).toLocaleString()}
                      </BalanceText>
                    </Container>
                  </MenuItem>
                  <MenuItem
                    style={{
                      fontSize: '1.3rem',
                      marginRight: '10px',
                      marginLeft: '10px',
                      border: '1px solid #ccc',
                      padding: '8px 16px',
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
        </div>
      </div>
      <InstantSearch searchClient={searchClient} indexName="newproj">
        <div>
          <ResultsContainer>
            {searchResults.length > 0 ? (
              <ol>
                {searchResults.map((hit) => (
                  <li key={hit.objectID}>
                    <DeveloperCard
                      hit={hit}
                      name={hit.name}
                      profilePic={hit.profilePic}
                      description={hit.description}
                      rates={hit.rates}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p>{searchTerm && 'No results found'}</p>
            )}
          </ResultsContainer>
        </div>
      </InstantSearch>
      <div style={{ display:'flex', marginTop: 'auto', padding: '10px', justifyContent: 'center', color: 'white' }}>
        <a href="../policy" onClick={handleNavigateToPolicy} style={{ color: 'black',justifyContent: 'center' }}>
Policy
        </a>
      </div>
    </div>
  );
}
