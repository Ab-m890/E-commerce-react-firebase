import React from 'react'
import { Link } from 'react-router-dom'

const Item = ({id,title,description,price,image}) => {

    return (
        <Link to={`/product/${id}`} className='product-card'>
            <div className='header'>
                <img src={image} alt='Product image'/>
            </div>
            <div className='details'>
                <h2 className='title'>{title}</h2>
                <p className='description'>{description}</p>
                <p className='price'>{price}$</p>
            </div>
        </Link>
    )
}

export default Item