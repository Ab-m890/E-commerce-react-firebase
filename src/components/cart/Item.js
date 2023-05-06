import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../general/auth/Auth'

//material ui
import { Delete } from '@mui/icons-material'

//firebase
import { getDatabase, set, ref, onValue, remove, update } from 'firebase/database'


const Item = ({ id, title, image, price, count, totalPrice, deletItem, editItem }) => {

    const auth = useAuth()

    const [c, setCount] = useState(count)

    const [tp, setTotalPrice] = useState(totalPrice)

    const db = getDatabase()

    const referance = ref(db, `Users/${auth.user}/cart`)

    const delet = () => {

        onValue(referance, (snapshot) => {

            if (snapshot.exists()) {

                const data = snapshot.val()

                Object.keys(data).map(e => {

                    if (data[e].id === id) {

                        const referance = ref(db, `Users/${auth.user}/cart/${e}`)

                        remove(referance)

                        auth.changeCountState()

                        deletItem()
                    }
                })
            }

            const currentArray = JSON.parse(localStorage.getItem('cart'))

            if (currentArray) {

                const newArray = currentArray.filter(e => {

                    return e.id != id
                })

                localStorage.setItem('cart', JSON.stringify([...newArray]))

                auth.changeCountState()

                deletItem()
            }

        })
    }

    const changeCount = (newValue) => {
        setCount(newValue)
        if (newValue && newValue > 0) {

            setTotalPrice(price * newValue)

            const referance = ref(db, `Users/${auth.user}/cart/${id}`)

            if (auth.user) {
                update(referance, { count: newValue, totalPrice: price * newValue })
            } 
            else {
                const currentArray = JSON.parse(localStorage.getItem('cart'))

                if (currentArray) {

                    const newArray = currentArray.map(e => {
                        if (e.id == id) {
                            const c = {
                                ...e,
                                count: newValue,
                                totalPrice: price * newValue,
                            }

                            return c
                        }
                        return e
                    })

                    localStorage.setItem('cart', JSON.stringify([...newArray]))

                    editItem()

                }
            }

        } else {
            setTotalPrice(price)
        }
    }

    return (
        <tbody>
            <tr>
                <td className='remove'>
                    <div onClick={delet} style={{ width: '20px' }} ><Delete style={{ color: 'red' }} /></div>
                </td>
                <td className='image'><Link to={`/product/${id}`}><img src={image} alt='image' style={{ height: '75px', width: '60px' }} /></Link></td>
                <td className='product'>
                    <Link to={`/product/${id}`} className='cart-item-title'>{title}</Link>
                </td>
                <td className='price'>
                    <p style={{ color: 'black' }}>{price}$</p>
                </td>
                <td className='count'>
                    <input onChange={(e) => changeCount(e.target.value)} type='number' value={c} style={{ width: '50px', height: '40px', textAlign: 'center' }} />
                </td>
                <td className='total-price'>
                    <p style={{ color: 'green' }}>{tp}$</p>
                </td>
            </tr>
        </tbody>

    )
}

export default Item
