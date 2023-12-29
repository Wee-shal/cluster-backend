import Navbar from './components/Navbar';
import TableComponent from './components/TableComponent';
import { useEffect, useState, useContext } from 'react';
import { userContext } from './state/userState'
import { getUser } from './services/helpers'
import { getPaymentLink } from './services/paymentService'
import serverUrl from './config'  /*new 23/12/23 */
export default function WalletProfile() {
  const id = window.localStorage.getItem("id")
  const [balance, setBalance] = useState(0);
  
    useEffect(() => {
      const fetchBalance = async () => {
        try {
          console.log("serverurl",serverUrl)
          const response = await fetch(`${serverUrl}/getUser?userId=${id}`);
          const data = await response.json();
  
          if (response.ok) {
            setBalance(data.user.balance);
            console.log(data.user.balance)
          } else {
            console.error('Error fetching balance:', data.message);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
  
      fetchBalance();
    }, [])
  {/*new 23/12/23 */}
  const { user, setUser } = useContext(userContext)
    const [price, setPrice] = useState(0)
    const [error, setError] = useState(false)
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false)
            }, 2000)
        }
    }, [error])
    useEffect(() => {
        (async () => {
            const user = await getUser(id)
            setUser(user)
        })()
    }, [])
    async function generatePaymentLink(e) {
        e.preventDefault()
        if (!price) {
            setError(true)
            return null
            // return <NotificationMessage message={'Please enter the details'} />
        }
        try {
            const inputElement = document.getElementById('creditAmt')
            console.log(inputElement.value)
            console.log('generating payment link for credits: ', price)
            console.log('id inside walletprofile',id)
            const response = await getPaymentLink(price, id)
            console.log(response.link)
            window.location.href = response.link
        } catch (e) {
            console.log(e)
        }
    }
  {/*end update */}
  return (
    
    <div>
      
      <Navbar />
      <div>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Wallet</h1>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>{/*wallet icon and image*/}
         
          <h2>Your Balance</h2>
          <p>{`$${balance}`}</p>
          
        </div>
        <div  style={{textAlign:'center'}}>
          <div>{/*new 23/12/2023 type-submit, form*/}
          <form onSubmit={generatePaymentLink}>
                        {user.currency}{' '}
                        <input
                            style={{ padding: '3px 10px' }}
                            id="creditAmt"
                            name="creditAmt"
                            placeholder="Enter Amount"
                            onChange={e => setPrice(e.target.value)}
                            onKeyDown={e => {
                                const key = e.key
                                if (
                                    (key < '0' || key > '9') &&
                                    key !== 'Backspace' &&
                                    key !== 'Delete'
                                ) {
                                    e.preventDefault()
                                }
                            }}
                        />
          <button type="submit">Pay</button>
          </form>
          </div>
        </div>
        <div>
         <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Transaction list</h1>
        </div>
        <div>
          <TableComponent/>
        </div>
        
      </div>
    </div>
  );
}