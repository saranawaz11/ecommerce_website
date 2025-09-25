import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addUser, deleteUser, fetchUsers, updateUser } from '../redux/slices/adminSlice';

function UsersPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/')
        }
    }, [user, navigate])

    useEffect(() => {
        if (user && user.role === 'admin') {
            dispatch(fetchUsers())
        }
    }, [dispatch, user])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    const getValues = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;
        let oldData = { ...formData };
        oldData[inputName] = inputValue;
        setFormData(oldData);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData))
        // reset the form after submission
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'customer'
        })
    }

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, formData: { role: newRole } }))
    }


    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId))
        }
    }

    return (
        <div>
            <div className='max-w-4xl m-4  lg:mx-auto lg:mt-10'>
                <h1 className='text-xl font-bold'>User Management</h1>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <div className='px-5 mt-8'>
                    <h2 className='font-bold'>Add New User</h2>
                    <form onSubmit={handleSubmit} className='mx-auto'>
                        <div className='flex flex-col mt-3'>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={getValues}
                                required
                                className='outline-none border border-slate-400 p-1 rounded' />
                        </div>

                        <div className='flex flex-col mt-3'>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={getValues}
                                required
                                className='outline-none border border-slate-400 p-1 rounded' />
                        </div>

                        <div className='flex flex-col mt-3'>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={getValues}
                                required
                                className='outline-none border border-slate-400 p-1 rounded' />
                        </div>

                        <div className='flex flex-col mt-3'>
                            <label htmlFor="role">Role</label>
                            <select name="role" id="" value={formData.role} onChange={getValues} className='outline-none p-1 border'>
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </select>

                        </div>
                        <button className='p-2 mt-5 rounded px-3 text-white bg-green-600 inline-block hover:bg-green-600/80 btn active:bg-green-700'>Add User</button>
                    </form>
                </div>

                {/* Users */}
                <div className='shadow-md my-10 overflow-auto'>
                    <div className='overflow-x-auto'>
                        <table className='md:w-full min-w-max x rounded'>
                            <thead>
                                <tr className='bg-gray-100 text-left w-full text-sm'>
                                    <th className='p-2'>NAME</th>
                                    <th className='p-2'>EMAIL</th>
                                    <th className='p-2'>ROLE</th>
                                    <th className='p-2'>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    users.map((item, index) => (
                                        <tr key={index} className='text-sm text-slate-700'>
                                            <td className='px-2 py-3'>{item.name}</td>
                                            <td className='px-2 py-3'>{item.email}</td>
                                            <td className='px-2 py-3'>
                                                <select value={item.role} onChange={(e) => handleRoleChange(item._id, e.target.value)} name="role" id="" className='border p-1 outline-none btn text-sm rounded border-slate-400'>
                                                    <option value="admin">Admin</option>
                                                    <option value="customer">Customer</option>
                                                </select>
                                            </td>
                                            <td className='px-2 py-3'>
                                                <button className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-600/80 btn active:bg-red-800/80' onClick={() => handleDeleteUser(item._id)}>Delete</button>
                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersPage