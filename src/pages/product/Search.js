import React, { useEffect, useState } from "react"
import SearchIcon from '@mui/icons-material/Search'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from '../../components/general/auth/Auth'
import Item from "../../components/product/Item"

const Search = () => {

    const db = getDatabase()

    const [params , setParams] = useSearchParams()

    const [products , setProducts] = useState([])

    const auth = useAuth()

    const navigate = useNavigate()

    const query = params.get('query') ? params.get('query') : null



    //get products search
    const getProduct = (query) => {

        if(query != null && query.length > 0){

            const referance = ref(db, `Products/`)

            onValue(referance , snapshot => {

                setProducts([])

                if(snapshot.exists()){

                    const data = snapshot.val()

                    Object.keys(data).map(e => {

                        const title = data[e].title.split(" ").join("")

                        const searchTitle = query.split(" ").join("")
                        
                        if(title.toLowerCase().includes(searchTitle.toLowerCase())){

                            setProducts(old => [...old , data[e]])
                            
                        }

                    })

                }
            })

        }

    }

    useEffect(() => {
        getProduct(query)
    },[])


    const displayProducts = products.length > 0 &&
    products.map((product , key) => {
        return <Item
            key={key}
            id={product.id}
            title={product.title}
            description={product.description}
            image={product.image}
            price={product.price}
        />
    })

    return (
        <section className="search">
            <form>
                <div className='search-input'>
                <button type="submit" className="icon-search">
                    <SearchIcon />
                </button>
                    <input type='text' name="query" placeholder="Search"/>
                </div>
            </form>
            <div className='products-container'>
                {displayProducts}
            </div>
        </section>
    )
}

export default Search