import React, { useEffect } from 'react'
import Link, { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../components/general/auth/Auth'

const Profile = () => {
    const auth = useAuth()

    const navigate = useNavigate()


    if (!auth.user) {
        return <Navigate to='/' />
    }

    const returnHome = () => {
        return navigate('/')
    }

    const signOut = () => {
        auth.logout()
        auth.user = ''
        returnHome()
    }


    return (
        !auth.user && 'Your are not logged' ||

        <section>
            <div style={{width: '100%' , textAlign: 'center',marginTop: '20px'}}>
                <p>{auth.email}</p>
                <button onClick={() => signOut()} >
                    logout
                </button>
            </div>
        </section>

    )
}

export default Profile