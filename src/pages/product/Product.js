import React, { useEffect, useState } from "react"
import Item from "../../components/product/Item"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useNavigate, useSearchParams } from "react-router-dom"

const Product = () => {

    const [products, setProducts] = useState([])

    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const page = searchParams.get('page') && searchParams.get('page') > 0 ? searchParams.get('page') : 1
    const category = searchParams.get('category') != null && searchParams.get('category').length > 0 ? searchParams.get('category') : null

    const itemPerpage = 4

    const db = getDatabase()
    const referance = ref(db, 'Products/')

    const readProducts = () => {
        setProducts([])
        onValue(referance, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                if (category != null) {
                    Object.values(data).map(e => {
                        if (e.category == category) {
                            setProducts(old => [...old, e])
                        }
                    })
                } else {
                    setProducts(Object.values(data))
                }
            }
        })
    }

    useEffect(() => {
        readProducts()

        return () => {
            setProducts([])
        }
    }, [category, page])

    const displayProducts = products.length > 0 && products.slice(page * itemPerpage - itemPerpage, page * itemPerpage).map((product, key) => {
        return <Item
            key={key}
            id={product.id}
            title={product.title}
            description={product.description}
            image={product.image}
            price={product.price}
        />
    }) || []


    const style = {
        pages: {
            marginTop: '20px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        btnPrevieus: {
            borderRadius: '5px',
            textAlign: 'center',
            backgroundColor: 'var(--text-color-primary-hover)'
        },
        btnNext: {
            borderRadius: '5px',
            textAlign: 'center',
            backgroundColor: 'var(--text-color-primary-hover)'
        }
    }

    return (
        products.length &&
        <section>
            <div style={style.pages}>
                {page * itemPerpage - itemPerpage > 0 &&
                    <button style={style.btnPrevieus}
                        onClick={() => {
                            setSearchParams(
                                searchParams.get('category') ?
                                    { category: searchParams.get('category'), page: parseInt(page) - 1 } :
                                    { page: parseInt(page) - 1 }
                            )
                            setProducts([])
                        }}
                    >
                        <KeyboardArrowDownIcon style={{ fontSize: '40px', transform: 'rotate(90deg)', }} />
                    </button>}
                {itemPerpage < products.length && <p style={{ color: 'var(--text-color-primary-hover)', fontSize: '32px', fontWeight: '700', margin: '0 20px' }}>{page}</p>}
                {page * itemPerpage < products.length &&
                    <button style={style.btnNext} 
                    onClick={() => {
                        setSearchParams(
                            searchParams.get('category') ?
                                    { category: searchParams.get('category'), page: parseInt(page) + 1 } :
                                    { page: parseInt(page) + 1 }
                        )
                        setProducts([])
                    }}>
                        <KeyboardArrowDownIcon style={{ fontSize: '40px', transform: 'rotate(-90deg)' }} />
                    </button>}
            </div>
            <div className='products-container'>
                {displayProducts}
            </div>
        </section>
        || 'Loading ...'
    )
}

export default Product