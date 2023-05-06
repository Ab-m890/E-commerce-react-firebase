import React from "react"

//css style file
import './style/style.scss'

//auth file
import Auth from "./components/general/auth/Auth"

//routes of app
import { BrowserRouter,Route,Routes } from "react-router-dom"

//components 
import Header from "./components/general/header/Header"



// pages
import Home from './pages/home/Home'

import Product from "./pages/product/Product"

import ProductDetails from "./pages/product/ProductDetails"

import Cart from "./pages/cart/Cart"

import Checkout from "./pages/checkout/Checkout"

import About from "./pages/about/About"

import Contact from "./pages/contact/Contact"

import Profile from "./pages/profile/Profile"

import Login from "./pages/auth/Login"

import Register from "./pages/auth/Register"

import Search from './pages/product/Search'

import NotFoundPage from "./pages/404/NotFoundPage"

import firebase from './firebase'


const App = () => {

  return (
    <Auth>
        <BrowserRouter>
            <Header />
            <Routes>

                <Route index element={<Home />} />

                <Route exact path='/product'>
                    <Route path='/product/:id' element={ <ProductDetails /> } />
                    <Route index element={<Product />} />
                </Route>

                <Route exact path='/cart' element={<Cart />} />

                <Route exact path='/checkout' element={<Checkout />} />

                <Route exact path='/about' element={<About />} />

                <Route exact path='/contact' element={<Contact />} />

                <Route exact path='/profile' element={<Profile />} />

                <Route exact path='/login' element={<Login />} /> 

                <Route exact path='/register' element={<Register />} />

                <Route exact path='/s' element={<Search />} />  

                <Route path='*' element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    </Auth>
  )
}


export default App