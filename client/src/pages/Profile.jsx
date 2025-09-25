import React from 'react'
import Orders from '../orders/Orders'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

function Profile() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart())
    navigate('/login')
  }
  return (
    <div className=' flex container py-5 px-10 mx-auto my-5 items-center'>
      <div className=' py-3 px-5 bg-white h-[180px] w-[300px] rounded shadow-lg'>
        <h1 className='text-2xl font-bold text-green-950'>{user?.name}</h1>
        <p className='text-sm py-3 font-medium'>{user?.email}</p>
        <button onClick={handleLogout} className='bg-black hover:bg-black/80 text-white btn  w-full rounded py-1'>Logout</button>
      </div>
      {/* My orders */}
      <Orders />
    </div>
  )
}

export default Profile