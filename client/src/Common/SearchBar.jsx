import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { fetchProductsByFilters, setFilters } from '../redux/slices/productsSlice';
import { useNavigate } from 'react-router';

function SearchBar({ toggleSearch }) {
    const [name, setName] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: name }));
        dispatch(fetchProductsByFilters({ search: name }))
        navigate(`/collections/all?search=${name}`)
        toggleSearch();
    }
    return (
        <div className='z-50 h-full pt-3 pb-9 bg-white'>
            <div className='flex justify-start pb-2 px-5 md:justify-end'>
                <button onClick={toggleSearch} className='btn transform transition-transform duration-200 hover:scale-120'><FaXmark /></button>
            </div>
            <div className='container mx-auto'>
                <form onSubmit={submitHandler} className='md:w-3/4 w-full px-3 md:px-0 mx-auto flex gap-5 justify-center items-center'>
                    <input type="text" placeholder='Search' value={name} onChange={(e) => setName(e.target.value)} className='p-2 z-50 outline-none rounded ring-black ring w-full text-slate-800 text-sm' />
                    <div className='bg-green-100 border-green-200 flex justify-center items-center p-1.5 border rounded' >
                        <button type='submit' className='h-6 w-6 btn pl-1 transform transition-transform duration-200 hover:scale-125' ><BiSearch /></button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SearchBar