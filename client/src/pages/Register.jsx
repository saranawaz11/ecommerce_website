import { Image, ImageKitProvider } from '@imagekit/react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner';
import { registerUser } from '../redux/slices/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { mergeCart } from '../redux/slices/cartSlice.js';
function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation()
    const { user, guestId, loading } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)

    //get redirect parameter and check if it is checkout or something
    const redirect = new URLSearchParams(location.search).get('redirect') || '/'
    const isCHeckoutRedirect = redirect.includes('checkout')

    useEffect(() => {
        if (user) {
            if (cart?.orderItems.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCHeckoutRedirect ? '/checkout' : '/')
                })
            } else {
                navigate(isCHeckoutRedirect ? '/checkout' : '/')
            }
        }
    }, [user, guestId, cart, navigate, isCHeckoutRedirect, dispatch])

    const getValue = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        let oldData = { ...formData };
        oldData[inputName] = inputValue;
        setFormData(oldData);

    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const { name, email, password } = formData;

        try {
            dispatch(registerUser({ name, email, password }))
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message, {
                    closeButton: 'close-button',
                    style: {
                        background: 'red',
                        color: 'white'
                    },
                },
                )
            } else {
                toast.error(error.message)
            }
        }
    }
    return (
        <ImageKitProvider urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}>
            <div className=' grid py-10 md:py-0 grid-cols-1 md:grid-cols-2 border-b border-slate-400  items-center'>
                {/* form */}
                <div className='w-full flex justify-center items-center'>
                    <form className='p-10 rounded  border flex flex-col gap-2 border-slate-300' onSubmit={submitHandler}>
                        <h1 className='font-bold text-2xl text-green-950'>Citadel</h1>
                        <p className='text-sm text-slate-600'>Enter your information here</p>

                        <label htmlFor="name" className='block font-bold' name='name'>Name</label>
                        <input type="text"
                            placeholder='Enter your name'
                            className='outline-none border border-slate-400 rounded p-2 text-sm'
                            onChange={getValue} name='name' value={formData.name} required />

                        <label htmlFor="email" className='block font-bold' name='email'>Email</label>
                        <input type="email"
                            placeholder='Enter your email address'
                            className='outline-none border border-slate-400 rounded p-2 text-sm'
                            onChange={getValue} name='email' value={formData.email} required />


                        <label htmlFor="password" className='block font-bold'>Password</label>
                        <input type="password" name="password" onChange={getValue} required value={formData.password} placeholder='Enter your password' className='outline-none border border-slate-400 rounded p-2 text-sm' />
                        <button className='bg-black text-white rounded p-1 mt-2 hover:bg-black/80 btn '>{loading ? 'Loading...' : 'Register'}</button>
                        <p className='text-sm mt-2 text-slate-700'>Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-green-950 font-bold'>Login</Link>.</p>
                    </form>
                </div>

                {/* pic container */}
                <div className='w-full hidden md:block h-[600px]'>
                    <Image src='/signup.jpg' className='h-full object-cover w-full ' />
                </div>
            </div>
        </ImageKitProvider>
    )
}

export default Register