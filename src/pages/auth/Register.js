import React, { useState } from 'react'
import { useAuth } from '../../components/general/auth/Auth'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Navigate , NavLink} from 'react-router-dom'

const Register = () => {
    const auth = useAuth()

    const initialLabelClass = {
        name: false,
        email: false,
        phoneNumber: false,
        address: false,
        password: false,
        repeatPassword: false,
    }

    const [labelClass, setLabelClass] = useState(initialLabelClass)

    if (auth.user) {
        return <Navigate to='/' />
    }

    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        repeatPassword: '',
        dob: ''
    }

    const onSubmit = values => {
        auth.registerByEmailAndPassword(
            values.name,
            values.email,
            values.phoneNumber,
            values.address,
            values.password,
            values.dob
        )
    }

    const validate = values => {

        let errors = {}

        //validate name
        if (!values.name) {
            errors.name = 'Enter your name'
        }

        // validate email
        if (!values.email) {
            errors.email = 'Enter email'
        }

        //validate phone number
        if (!values.phoneNumber) {
            errors.phoneNumber = 'Enter your phone number'
        }

        //validate address
        if (!values.address) {
            errors.address = 'Enter your address'
        }

        //validate passwors and repeat password
        if (!values.password) {
            errors.password = 'Enter Password'
        }

        if (!values.repeatPassword) {
            errors.repeatPassword = 'Repeat password'
        }

        if (values.password.length < 8) {
            errors.password = 'Password has at least 8 character'
        }

        if (values.password && values.repeatPassword && values.password.length >= 8 && !(values.password === values.repeatPassword)) {
            errors.password = 'Not same'
            errors.repeatPassword = 'Not same'
        }


        //validate date of birth
        if (!values.dob) {
            errors.dob = 'Enter your Date of birth'
        }

        return errors
    }

    return (
        <section className='register'>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}>
                <Form>
                    <div className='form'>

                        {/* input name, label and error*/}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
                                    ...e,
                                    name: true
                                }))}
                                htmlFor='name'
                                className={labelClass.name ? 'active' : null}>
                                Name
                            </label>
                            <Field type='text' id='name' name='name' />
                        </div>
                        <ErrorMessage name='name' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>


                        {/* input email, label and error*/}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
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

                        {/* input phone number, label and error*/}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
                                    ...e,
                                    phoneNumber: true
                                }))}
                                htmlFor='phoneNumber'
                                className={labelClass.phoneNumber ? 'active' : null}>
                                Phone Number
                            </label>
                            <Field type='number' id='phoneNumber' name='phoneNumber' />
                        </div>
                        <ErrorMessage name='phoneNumber' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>

                        {/* input address, label and error*/}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
                                    ...e,
                                    address: true
                                }))}
                                htmlFor='address'
                                className={labelClass.address ? 'active' : null}>
                                Address
                            </label>
                            <Field type='text' id='address' name='address' />
                        </div>
                        <ErrorMessage name='address' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>
                        

                        {/* input password, label and error*/}
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

                        <ErrorMessage name='notSame' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>
                        

                        {/* input repeat password, label and error*/}
                        <div className='input-items'>
                            <label
                                onClick={() => setLabelClass(e => ({
                                    ...e,
                                    repeatPassword: true
                                }))}
                                htmlFor='repeat-password'
                                className={labelClass.repeatPassword ? 'active' : null}>
                                Repeat password
                            </label>
                            <Field type='password' id='repeat-password' name='repeatPassword' />
                        </div>
                        <ErrorMessage name='repeatPassword' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>

                        <ErrorMessage name='notSame' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>
                        

                        {/* input dob, label and error*/}
                        <div className='input-items'>
                            <Field type='date' placeholder='01/01/2000' id='dob' name='dob' />
                        </div>
                        <ErrorMessage name='dob' >
                            {(errorMessage) => {
                                return <div className='error'>{errorMessage}</div>
                            }}
                        </ErrorMessage>

                        <div className='button'>
                            <button id='submit' type='submit'>Sign up</button>
                            <button id='exist'>
                                <NavLink to='/login'>
                                    login ?
                                </NavLink>
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
            {auth.error && <p style={{color: 'red'}}>{auth.error}</p>}
        </section>
    )
}

export default Register