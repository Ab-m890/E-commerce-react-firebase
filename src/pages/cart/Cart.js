import React, { useEffect, useState } from "react"
import Item from "../../components/cart/Item"
import { getDatabase, ref, onValue } from 'firebase/database'
import { Link } from "react-router-dom"
import { useAuth } from "../../components/general/auth/Auth"

const Cart = () => {

    const auth = useAuth()


    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0.0)
    const [totalCount, setTotalCount] = useState(0)

    const [deletItem, setDeletItem] = useState(false)
    const [editItem, setEditItem] = useState(false)

    const changeDeletItemState = () => {
        setDeletItem(!deletItem)
    }

    const changeEditItemState = () => {
        setEditItem(!editItem)
    }

    const db = getDatabase()
    const referance = ref(db, `Users/${auth.user}/cart`)


    //read cart items
    const readCartItems = () => {
        setTotalPrice(0.0)
        setTotalCount(0)
        onValue(referance, (snapshot) => {
            setTotalPrice(0.0)
            setTotalCount(0)
            if (snapshot.exists()) {

                const data = snapshot.val()

                setProducts(Object.values(data))

                Object.keys(data).map(e => {
                    const p = parseFloat(data[e].totalPrice)
                    setTotalPrice(old => old + p)
                    setTotalCount(old => old + 1)
                })
            } else {
                const products = JSON.parse(localStorage.getItem('cart'));
                if (products) {

                    setTotalCount(products.length)

                    setProducts(products)

                    products.map(e => {
                        const p = parseFloat(e.totalPrice)
                        setTotalPrice(old => old + p)
                    })
                }
            }
        })
    }

    useEffect(() => {
        readCartItems()
    }, [auth.user, deletItem, editItem])

    const displayProducts = products.length && products.map((product, index) => {

        return <Item
            key={index}
            user={auth.user}
            id={product.id}
            title={product.title}
            image={product.image}
            price={product.price}
            count={product.count}
            totalPrice={product.totalPrice}
            deletItem={changeDeletItemState}
            editItem={changeEditItemState}
        />
    }) || []

    return (
        <section className='cart-page'>
            <div className='cart-page-header'>
                <p>Item count : {totalCount}</p>
                <p>Total price : {(totalPrice ? (totalPrice + 5) : totalPrice).toFixed(2)}$</p>
            </div>
            {products.length > 0 &&
                <div className='cart-container'>
                    <div className='cart-item'>
                        <table>
                            <thead>
                                <tr>
                                    <th className='remove'>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th className='name'>Products</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            {displayProducts}
                        </table>
                        <div className='cart-total'>
                            <div className='subtotal'>
                                <h3>Subtotal</h3>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>

                            <div className='shipping'>
                                <h3>Shipping</h3>
                                <p>$5</p>
                            </div>

                            <div className='total'>
                                <h3>Total</h3>
                                <p>${(totalPrice ? totalPrice + 5 : totalPrice).toFixed(2)}</p>
                            </div>

                            <div className='checkout-button'>
                                <Link to='/checkout'>Proceed To Checkout</Link>
                            </div>
                        </div>
                    </div>
                </div> ||
                <div style={{width: '100%',textAlign: 'center',marginTop: '50px'}}>
                    <h2>Your cart is empty</h2>
                    <button style={{marginTop: '20px',borderradius: '7px',backgroundColor: 'black' , padding: '10px 20px', width: '200px'}}><Link style={{color: 'white',fontSize: '24px'}} to='/product'>Go to shop</Link></button>
                </div>}
        </section>
    )
}

export default Cart