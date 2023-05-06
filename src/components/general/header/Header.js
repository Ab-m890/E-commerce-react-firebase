import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/Auth'


//material ui 
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SearchIcon from '@mui/icons-material/Search'
import { Badge } from '@mui/material'

//firebase
import { getDatabase, ref, onValue } from 'firebase/database'

const Header = () => {

    const auth = useAuth()

    const db = getDatabase()

    const [openMenu, setOpenMenu] = useState(false)

    const menuRef = useRef()

    const categoryRef = useRef()

    const [category, setCategory] = useState([])

    const [showCategory, setShowCategory] = useState(false)


    //update total item cart count
    const totalItemCount = useMemo(() => {
        return auth.itemCartCount
    }, [auth.itemCartCount])

    /* ######################### close menu start ######################### */
    const closeMenu = useCallback(() => {
        setOpenMenu(false)
    }, [])



    /* ######################### get categort start ######################### */
    const getCategory = () => {

        //get data ( category )
        setCategory([])

        const referance = ref(db, `Products`)

        onValue(referance, snapshot => {
            const data = snapshot.val()

            Object.values(data).map(e => {
                setCategory(old => [...old, e.category])
            })
        })
    }



    /* ######################### outside  ######################### */
    const outSide = useCallback(() => {
        // outside menu
        const clickOutsideMenuClose = (e) => {
            if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false)
            }
        }

        document.addEventListener('mousedown', clickOutsideMenuClose)

        // outside menu
        const clickOutsideCategoryClose = (e) => {
            if (showCategory && categoryRef.current && !categoryRef.current.contains(e.target)) {
                setShowCategory(false)
            }
        }

        document.addEventListener('mousedown', clickOutsideCategoryClose)

    }, [openMenu,showCategory])
    outSide()


    useEffect(() => {
        getCategory()
    }, [])




    /* ######################### readCategry start ######################### */
    const set = new Set(category)

    const readCategory = [...set].map((e, i) => {
        return <li key={i}><Link onClick={() => closeMenu()} to={`/product?category=${e}`}>{e}</Link></li>
    })

    /* ######################### readCategory end ######################### */

    return (
        <header ref={menuRef} className={'top-menu' + (openMenu ? ' active' : '')}>

            <div className='icons-link'>

                <div className='menu-icon' onClick={() => setOpenMenu(e => !e)}>
                    <MenuIcon className='icon' />
                </div>

                <Link className='cart-icon-link' onClick={() => closeMenu()} to='/cart'>
                    <Badge badgeContent={totalItemCount} color='primary'>
                        <ShoppingCartIcon className='icon' />
                    </Badge>
                </Link>

                <Link to='/s' className='search-icon'>
                    <SearchIcon className='icon' />
                </Link>
            </div>

            <div className={'right-side' + (openMenu ? ' active' : '')}>
                <NavLink onClick={() => closeMenu()} to="/">Home</NavLink>
                <div className='product' ref={categoryRef}>
                    <span  onClick={() => setShowCategory(!showCategory)} >Products</span>
                    <div className={'category' + (showCategory ? ' active' : '')}>
                        <ul>
                            {readCategory}
                        </ul>
                    </div>
                </div>
                <NavLink onClick={() => closeMenu()} to='/about'>About US</NavLink>
                <NavLink onClick={() => closeMenu()} to='/contact'>Contact US</NavLink>
                {auth.user && <NavLink onClick={() => closeMenu()} to='/profile'>Profile</NavLink>}
                {!auth.user && <NavLink onClick={() => closeMenu()} to='/login'><button>Login</button></NavLink>}
                {!auth.user && <NavLink onClick={() => closeMenu()} to='/register'><button>Register</button></NavLink>}
            </div>

            <div className='left-side'>
                <div className='logo'>
                    <img src='images/logo.png' alt='Logo' />
                </div>
            </div>

        </header>
    )
}

export default Header