import React, { createContext, useContext, useState, useEffect } from "react"
import { getDatabase, ref, set, onValue, update, get } from 'firebase/database'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'


const UserAuth = createContext()

const Auth = ({ children }) => {
    const auth = getAuth()

    const db = getDatabase()

    const [user, setUser] = useState('loading')

    const email = auth.currentUser ? auth.currentUser.email : ''

    const [itemCartCount, setItemCount] = useState(0)

    const [changeCount, setChangeCount] = useState(false)

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)

    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)

    const [error , setError ] = useState('')

    const changeCountState = () => {
        setChangeCount(!changeCount)
    }

    const referance = ref(db, `Users/${user}/cart`)

    //check if set user or not
    auth.onAuthStateChanged(user => {
        if (user) {
            setUser(user.uid)
        }
        else setUser(null)
    })


    //get total cart count
    useEffect(() => {
        onValue(referance, (snapshot) => {
            setItemCount(0)
            if (snapshot.exists()) {
                const data = snapshot.val()
                Object.keys(data).map(e => {
                    setItemCount(old => old + 1)
                })
            } else {
                const currentArray = JSON.parse(localStorage.getItem('cart'))
                if (currentArray) {
                    currentArray.map(e => {
                        setItemCount(old => old + 1)
                    })
                }
            }
        })
    }, [changeCount, user])


    //logout user
    const logout = () => {
        signOut(auth).then(() => {
            console.log('Sign out success')
            setUser(null)
        }).catch((e) => {
            console.log("Error : " + e)
        })
    }


    //register by email and password
    const registerByEmailAndPassword = (name, email, phoneNumber , address , password, dob) => {

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                const user = auth.currentUser.uid
                setUser(user)

                setOpenSuccessSnackbar(true)

                //Push data in database
                set(ref(db, 'Users/' + user), {
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    address: address,
                    password: password,
                    dob: dob
                })


                //check if set data in cart and push in database
                const currentArray = JSON.parse(localStorage.getItem('cart'))

                if (currentArray) {

                    const referance = ref(db, `Users/${user}/cart`)

                    set(referance, currentArray)
                        .then(() => console.log('Success'))
                        .catch(e => console.log('error: ' + e))

                }
            })
            .catch(error => {
                setUser('')
                setError(error)
            })
    }


    //sign in with email and password
    const signInByEmailAndPassword = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                const user = auth.currentUser.uid
                setUser(user)

                //check if set data in cart and push in database
                const currentArray = JSON.parse(localStorage.getItem('cart'))

                if (currentArray) {

                    currentArray.map(e => {

                        const referance = ref(db, `Users/${user}/cart/${e.id}`)

                        onValue(referance, snapshot => {

                            if (snapshot.exists()) {

                                const data = snapshot.val()

                                update(referance,{
                                    count: parseInt(data.count) + parseInt(e.count),
                                    totalPrice: parseFloat(data.totalPrice) + parseFloat(e.totalPrice)
                                })

                            } else {

                                set(referance, e)
                                    .then(() => console.log('Success'))
                                    .catch(e => console.log('error: ' + e))

                            }
                        },{
                            onlyOnce: true
                        })
                    })

                    localStorage.setItem('cart',JSON.stringify([]))

                }

            })
            .catch(error => {
                setUser('')
            })
    }

    return (
        <UserAuth.Provider value={{ user, signInByEmailAndPassword, registerByEmailAndPassword, email, logout, changeCountState, itemCartCount }}>
            {children}
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
                    Register Successfully
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
        </UserAuth.Provider>
    )
}

export default Auth

export const useAuth = () => {
    return useContext(UserAuth)
}