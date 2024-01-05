import { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/helpers'
import { userContext } from '../state/userState'

// const Container = styled.div`
// 	position: absolute;
// 	top: 1.5rem;
// 	right: 7rem;
// 	color: black;
// 	background-color: #dedede;
// 	padding: 0.5rem 0.5rem;
// 	border-radius: 4%;
// 	outline: ${({ balance }) => {
// 		if (balance === 0) {
// 			return `2px solid red`
// 		} else if (balance < 20) {
// 			return `2px solid yellow`
// 		} else if (balance > 20) {
// 			return `2px solid green`
// 		}
// 	}};
// 	cursor: pointer;

// 	/* Updated styles for grey box with black text */
// 	background-color: #dedede;
// 	color: black;

// 	@media (max-width: 768px) {
// 		right: 1rem;
// 	}
// `
// export default function Wallet() {
// 	const { user, setUser } = useContext(userContext)
// 	const navigate = useNavigate()
// const id = window.localStorage.getItem("id")
// 	useEffect(() => {
// 		(async () => {
// 			const user = await getUser(id)
// 			setUser(user)
// 		})()
// 	}, [])

// 	return (
// 		<Container balance="1000" onClick={() => navigate('/payment')}>
// 			<div>
// 			Balance: {user?.currency}
// 			{user.balance?.toFixed(2).toLocaleString()}
// 			</div>
// 		</Container>
// 	)
// }
const WalletContainer = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 7rem;
  color: black;
  background-color: #dedede;
  padding: 0.5rem 0.5rem;
  border-radius: 4%;
  outline: ${({ balance }) => {
    if (balance === 0) {
      return `2px solid red`;
    } else if (balance < 20) {
      return `2px solid yellow`;
    } else if (balance > 20) {
      return `2px solid green`;
    }
  }};
  cursor: pointer;

  @media (max-width: 768px) {
    right: 4.5rem;
  }
`;

const BalanceText = styled.div`
  font-size: 1rem;
  /* Additional styles for balance text */
`;


export default function Wallet() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const id = window.localStorage.getItem('id');

  useEffect(() => {
    (async () => {
      const user = await getUser(id);
      setUser(user);
    })();
  }, []);

  return (
    <WalletContainer balance="1000" onClick={() => navigate('/payment')}>
      <BalanceText>
        Balance: {user?.currency}
        {user.balance?.toFixed(2).toLocaleString()}
      </BalanceText>
    </WalletContainer>
  );
}
