import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//firebase
import { getDatabase, ref, onValue, set, update } from 'firebase/database'

//icon and style from material ui
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import StarIcon from '@mui/icons-material/Star'
import Rating from '@mui/material/Rating'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

//auth file
import { useAuth } from '../../components/general/auth/Auth'

const ProductDetails = () => {

    const auth = useAuth()

    const params = useParams()
    
    const id = params.id

    const db = getDatabase()

    const referance = ref(db, `Products/`)

    const [product, setProduct] = useState({})

    const [count, setCount] = useState(1)

    const [description, setDescription] = useState(false)

    const [error, setError] = useState('')

    const [rate, setRate] = useState(0)

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)

    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)

    useEffect(() => {
        onValue(referance, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                Object.keys(data).map(e => {
                    if (data[e].id == id) {
                        setProduct(data[e])
                    }
                })
            }
        })
    }, [])

    const validate = () => {

        if (count && count > 0 && auth.user) {
            const db = getDatabase()
            const referance = ref(db, `Users/${auth.user}/cart/${id}`)
            onValue(referance, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    update(
                        referance,
                        {
                            count: parseInt(data.count) + parseInt(count),
                            totalPrice: (parseInt(data.count) + parseInt(count)) * product.price
                        }
                    ).then(() => {
                        setOpenSuccessSnackbar(true)
                    }).catch(() => {
                        setOpenErrorSnackbar(true)
                    })
                } else {
                    const order = {
                        id: product.id,
                        price: product.price,
                        image: product.image,
                        title: product.title,
                        count: count,
                        totalPrice: count * product.price,
                    }

                    set(referance, order)
                        .then(() => {
                            setError('')
                            setOpenSuccessSnackbar(true)
                            auth.changeCountState()
                        })
                        .catch(err => {
                            setOpenErrorSnackbar(true)
                        })
                }
            },{
                onlyOnce: true
            })

        } else if (!count || count <= 0) {
            setError('Please enter a valide count !')
            setOpenErrorSnackbar(true)
        } else {
            const order = {
                id: product.id,
                price: product.price,
                image: product.image,
                title: product.title,
                count: count,
                totalPrice: count * product.price,
            }

            const currentArray = JSON.parse(localStorage.getItem('cart'))

            if (currentArray) {

                console.log('exist')

                const checkIfExist = currentArray.filter(e => {
                    if (e.id == order.id) {
                        return e
                    }
                })

                if(checkIfExist.length){

                    const newArray = currentArray.map(e => {
                        if(e.id == order.id){

                            const c = {
                                ...e,
                                count: parseInt(e.count) + parseInt(order.count),
                                totalPrice: parseFloat(e.totalPrice) + parseFloat(order.totalPrice),
                            }
                            return c
                        }
                        return e
                    })

                    localStorage.setItem('cart', JSON.stringify([...newArray]))

                }else{

                    localStorage.setItem('cart', JSON.stringify([...currentArray,order]))

                    auth.changeCountState()

                }

            } else {
                
                localStorage.setItem('cart', JSON.stringify([order]))

                auth.changeCountState()

            }

            setOpenSuccessSnackbar(true)
        }
    }

    const style = {
        itemImage: {
            width: '70%',
            height: 'fit-content'
        },
        title: {
            textAlign: 'left',
            fontSize: '32px',
            color: 'var(--color-primary)',
            margin: '20px 0',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            paddingBottom: '20px'
        },
        price: {
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            fontWeight: '500',
            fontSize: '32px',
            color: 'var(--color-secondary)',
            margin: '20px 0',
        },
        quantity: {
            margin: '20px 0',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            fontSize: '32px',
            color: 'var(--color-secondary)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center'
        },
        totalPriceInput: {
            width: '80px',
            height: '40px',
            margin: '0 10px',
            outline: 'none',
            border: '2px solid var(--color-secondary)',
            borderRadius: '7px',
            paddingLeft: '5px',
            color: 'black',
            fontWeight: '700',
            fontSize: '22px'
        },
        totalPrice: {
            margin: '20px 0',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center'
        },
        iconDescription: {
            margin: '20px 0',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            cursor: 'pointer',
            color: 'var(--color-primary)',
            fontSize: '32px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
        },
        description: {
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(230,230,230)',
            fontWeight: '500',
            fontSize: '28px',
            color: 'rgba(0,0,0,0.7)',
            margin: '10px 0px'
        }, rating: {
            color: 'gold',
            margin: '20px 0',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            fontSize: '27px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        btnAddToCart: {
            cursor: 'pointer',
            width: '100%',
            borderRadius: '7px',
            color: 'white',
            backgroundColor: 'var(--color-primary)',
            fontWeight: '600',
            fontSize: '26px',
            marginTop: '50px',
            padding: '10px 20px'
        },
        error: {
            width: '100%',
            backgroundColor: 'red',
            textAlign: 'center',
            padding: '10px 15px',
            margin: '20px 0',
            borderRadius: '7px'
        }
    }

    return (


        product.id &&
        <section className='product-details'>

            {/* image of product item */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={product.image} style={style.itemImage} alt='image'/>
            </div>

            {/* body of page contain product item details */}
            <div className='details'>

                {/*     title */}
                <h2 className='title' style={style.title}>{product.title}</h2>

                {/*price , count and total price */}
                <p className='price' style={style.price}>Price : ${product.price}</p>

                {/* quantity and total price */}
                <div className='quantity' style={style.quantity}>
                    <label htmlFor='count'>Quantity : </label>
                    <input
                        type='number'
                        name='count'
                        id='count'
                        onChange={(e) => setCount(e.target.value)}
                        value={count}
                        style={style.totalPriceInput}
                    />
                </div>

                {/* error message */}
                {/* {error && <div style={style.error}><h2 style={{ color: 'white' }}>{error}</h2></div>} */}

                {/* description icon and text */}
                <div className='icon-description' onClick={() => setDescription(!description)} style={style.iconDescription}>Description {description && <KeyboardArrowDownIcon style={{ fontSize: '40px', transform: 'rotate(180deg)' }} /> || <KeyboardArrowDownIcon style={{ fontSize: '40px' }} />} </div>
                {description && <p className='description' style={style.description}>{product.description}</p>}

                <div>
                    <div style={style.rating}>{product.rating.rate} <StarIcon /> {`( ${product.rating.count} reviews )`}</div>
                    <div><Rating value={rate} onChange={(e, newValue) => setRate(newValue)} /></div>
                </div>

                {/* total price */}
                <div className='total-price' style={style.totalPrice}>Total price : <p style={{ color: 'green' }}>{count && count > 0 ? ' ' + (count * product.price).toFixed(2) : product.price}$</p></div>

                {/* button add to cart */}
                <div style={{ width: '100%' }}><button onClick={() => validate()} style={style.btnAddToCart}> Add to cart </button></div>
            </div>


            {/* success alert */}
            <Snackbar
                anchorOrigin={{vertical: 'top',horizontal: 'center'}}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                open={openSuccessSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSuccessSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSuccessSnackbar(false)}
                    severity='success'
                    sx={{ width: '80%', backgroundColor: 'white', color: 'green', fontWeight: '600' }}>
                    Add Successfully
                </Alert>
            </Snackbar>

            {/* error alert */}
            <Snackbar
            anchorOrigin={{vertical: 'top',horizontal: 'center'}}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                open={openErrorSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenErrorSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenErrorSnackbar(false)}
                    severity='error'
                    sx={{ width: '80%', backgroundColor: 'white', color: 'red', fontWeight: '600' }}>
                    {error ? error : 'An Error Occurred'}
                </Alert>
            </Snackbar>
        </section>
    )
}

export default ProductDetails