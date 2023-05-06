import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'

//swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/core'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import Item from '../../components/product/Item'

const Home = () => {

    const [products, setProducts] = useState([])

    const db = getDatabase()
    const referance = ref(db, 'Products/')

    useEffect(() => {
        setProducts([])
        onValue(referance, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setProducts(Object.values(data))
            }
        })
    }, [])

    const displayProducts = products.map((product, key) => {
        return (
            <SwiperSlide key={key}>
                <Item
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    price={product.price}
                />
            </SwiperSlide>
        )

    }) || []

    return (
        <section className='home'>
            <Swiper
                modules={[Autoplay, Navigation, Pagination, Scrollbar]}
                autoplay={{
                    delay: 4000,
                }}

                scrollbar={{
                    draggable: true
                }}

                pagination={{
                    clickable: true
                }}

                loop={true}
                spaceBetween={50}
                centeredSlides={true}
                navigation={true}
                slidesPerView={1}
            >
                {displayProducts}
            </Swiper>
        </section>
    )
}

export default Home