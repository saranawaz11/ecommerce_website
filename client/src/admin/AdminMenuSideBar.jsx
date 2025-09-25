import React from 'react'
import { FaUsers } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { RiPagesLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi'
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

function AdminMenuSideBar({ toggleAdminMenu }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
    }
    // helper function to check active path
    const isActive = (path) => location.pathname.includes(path)
    return (

        <div className=' fixed top-0 bg-black mr-5 lg:mr-0 text-white h-screen inset-y-0 px-3 lg:py-8'>
            <div className='flex justify-end my-2 mx-3 lg:hidden'>
                <button onClick={toggleAdminMenu} className=' '>x</button>
            </div>
            <h1 onClick={() => navigate('/')} className='btn text-xl pb-4 font-bold tracking-wider'>Citadel</h1>
            <p onClick={() => navigate('/admin')} className='btn px-4 md:px-6 pb-8'>Admin Dashboard</p>
            <ul className='px-1 text-sm'>
                <li onClick={() => navigate('/admin/users')} className={`flex gap-3 items-center mb-5 p-2 transform transition-transform duration-300 ${isActive('/admin/users') ? 'bg-gray-800 scale-105' : 'bg-black scale-100'} rounded btn`} >
                    <FaUsers />
                    <span>Users</span>
                </li>

                <li onClick={() => navigate('/admin/products')} className={`flex gap-3 items-center mb-5 p-2 transform transition-transform duration-300 ${isActive('/admin/products') ? 'bg-gray-800 scale-105' : 'bg-black scale-100'} rounded btn`}>
                    <FaBagShopping />
                    <span>Products</span>
                </li>

                <li onClick={() => navigate('/admin/orders')} className={`flex gap-3 items-center mb-5 p-2 transform transition-transform duration-300 ${isActive('/admin/orders') ? 'bg-gray-800 scale-105' : 'bg-black scale-100'} rounded btn`}>
                    <RiPagesLine />
                    <span>Orders</span>
                </li>
            </ul>
            <button className='bg-green-700 w-full p-1 rounded hover:bg-green-700/85 active:bg-green-600/90 flex gap-2 items-center justify-center' onClick={handleLogout} ><HiOutlineLogout /> <span>Logout</span></button>
        </div>

    )
}

export default AdminMenuSideBar