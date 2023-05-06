import React, { useEffect, useState } from 'react'
import { useNavigate , Link} from 'react-router-dom'
import { useAuth } from '../../components/general/auth/Auth'
import { getDatabase, ref, onValue, update } from 'firebase/database'

const Checkout = () => {

    const auth = useAuth()

    const db = getDatabase()

    const navigate = useNavigate()

    const [information, setInformation] = useState({ name: 'name', address: 'address', phoneNumber: 'phoneNumber' })

    const [newInfo, setNewInfo] = useState({})

    const [read, setRead] = useState([])

    const [changeInfo, setChangeInfo] = useState(false)

    const [subTotal, setSubTotal] = useState(0.0)

    const [quantity, setQuantity] = useState(0)

    const [error, setError] = useState({})

    useEffect(() => {

        const referance = ref(db, `Users/${auth.user}/cart`)
        onValue(referance, (snapshot) => {

            setQuantity(0)
            setSubTotal(0, 0)

            if (snapshot.exists()) {

                const data = snapshot.val()

                //read quantity of product and the sub total price of product 
                Object.values(data).map(e => {
                    setQuantity(old => old + 1)
                    const price = parseFloat(e.totalPrice)
                    setSubTotal(old => old + price)
                })


                //read data of user and set in information constant and in new info if change it
                const referance = ref(db, `Users/${auth.user}`)
                onValue(referance, (snapshot) => {
                    if (snapshot.exists()) {
                        const { name, phoneNumber, address } = snapshot.val()
                        setInformation({ name, phoneNumber, address })
                        setNewInfo({ name, phoneNumber, address })
                    }
                })
            }
        })
    }, [auth.user])


    //check if login or not
    if (!auth.user) {
        navigate('/login')
    }

    // method edit information
    const updateInformation = () => {

        setError({})

        if (newInfo.address && newInfo.phoneNumber) {

            const referance = ref(db, `Users/${auth.user}`)

            update(referance, newInfo)

            setChangeInfo(false)

        } else if (!newInfo.address && !newInfo.phoneNumber) {

            setError(old => ({ address: 'Address required!', phoneNumber: 'Phone Number required!' }))

        } else if (!newInfo.phoneNumber) {

            setError(old => ({ ...old, phoneNumber: 'Phone Number required!' }))

        } else setError(old => ({ ...old, address: 'Address required!' }))

    }


    //method to place order
    const placeOrder = () => {

    }


    return (

        //if user is loading
        auth.user == "loading" ? 
        <h2 style={{marginTop: '20px' , textAlign: 'center'}}>Loading ...</h2> :
        
        //if not exist user
        auth.user == null ? 
        <h2 style={{marginTop: '20px' , textAlign: 'center'}}><Link to='/login'>You are not login , do you have login ?</Link></h2> :
        
        auth.user != null && auth.user != "loading" ?
        //if exist user
        <section className='checkout'>
            {/*&& information.phoneNumber && information.address*/}
            <div className='checkout-container'>
                <h1>
                    Welcome {information.name}
                </h1>
                <p id='warning'>
                    We will rely on the information you provided when registering !
                </p>

                {/* phone number and address */}
                <p id='phone-number'>
                    Phone number :  {information.phoneNumber}
                </p>
                <p id='address'>
                    Address :  {information.address}
                </p>

                {/* buttn to change address or phone number */}
                <p id='toggle-update-info' onClick={() => setChangeInfo(!changeInfo)}>
                    Change address or phone number?
                </p>

                {/* change address or phone number */}
                {changeInfo &&
                    <div className='form-change-info'>
                        <div className='phone-number'>Phone number<br></br>
                            <input onChange={(e) => setNewInfo(old => ({ ...old, phoneNumber: e.target.value }))} type='number' value={newInfo.phoneNumber} />
                            {error.phoneNumber &&
                                <p>
                                    {error.phoneNumber}
                                </p>}
                        </div>
                        <div className='address'>Address<br></br>
                            <input style={{ width: '100%', height: '50px', paddingLeft: '10px', margin: '5px 0 20px' }} onChange={(e) => setNewInfo(old => ({ ...old, address: e.target.value }))} type='text' value={newInfo.address} />
                            {error.address &&
                                <p>
                                    {error.address}
                                </p>}
                        </div>
                        <button  onClick={() => updateInformation()}>Update</button>
                    </div>}

                {/* button to place order */}
                <div className='cart-total'>
                    <div className='subtotal'>
                        <h3>Subtotal</h3>
                        <p>${(subTotal ? subTotal : 0).toFixed(2)}</p>
                    </div>

                    <div className='shipping'>
                        <h3>Shipping</h3>
                        <p>$5</p>
                    </div>

                    <div className='quantity'>
                        <h3>Quantity product</h3>
                        <p>{quantity ? quantity : 0}</p>
                    </div>

                    <div className='total'>
                        <h3>Total</h3>
                        <p>${(subTotal ? subTotal + 5 : 0).toFixed(2)}</p>
                    </div>

                    <div onClick={() => placeOrder()} className='checkout-button'>
                        <span>Place Order</span>
                    </div>
                </div>

            </div>
        </section>
        : ''
    )
}


export default Checkout