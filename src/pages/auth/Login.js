import React, { useEffect, useState } from 'react'
import { useAuth } from '../../components/general/auth/Auth'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Navigate, NavLink } from 'react-router-dom'

const Login = () => {
    const auth = useAuth()

    const initialLabelClass = {
        email: false,
        password: false,
    }

    const [labelClass, setLabelClass] = useState(initialLabelClass)

    if (auth.user) {
        return <Navigate to='/' />
    }

    const initialValues = {
        email: '',
        password: ''
    }

    const onSubmit = values => {
        auth.signInByEmailAndPassword(values.email, values.password)
    }

    const validate = values => {
        let errors = {}
        if (!values.email) {
            errors.email = 'Please Enter Email!'
        }

        if (!values.password) {
            errors.password = 'Please Enter Password!'
        }

        return errors
    }

    return (
        <section className='login'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}>
                <Form className='hello'>
                    <div className='form'>


                        {/* email */}
                        <div className='input-items'>
                            <label
                                onClick={(e) => setLabelClass(e => ({
                                    ...e,
                                    email: true
                                }))}
                                htmlFor='email'
                                className={labelClass.email ? 'active' : null}>
                                Email
                            </label>
                            <Field type='email' id='email' name='email' />
                        </div>
                        <ErrorMessage name='email' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>

                        {/* password */}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
                                    ...e,
                                    password: true
                                }))}
                                htmlFor='password'
                                className={labelClass.password ? 'active' : null}>
                                Password
                            </label>
                            <Field type='password' id='password' name='password' />
                        </div>
                        <ErrorMessage name='password' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>
                        <div className='button'>
                            <button id='submit' type='submit'>Login</button>
                            <button id='create'>
                                <NavLink to='/register'>
                                    Create new account ?
                                </NavLink>
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </section>
    )
}

export default Login