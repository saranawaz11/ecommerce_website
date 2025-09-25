import React from 'react'
import { BsMeta } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { RiTwitterXLine } from 'react-icons/ri';
import { Link } from 'react-router';

function Topbar() {
    return (
        <div className='bg-green-800 max-w-full md:px-4 text-white'>
            <div className='container mx-auto flex flex-col md:flex-row md:justify-between items-center py-3 text-sm  md:text-left'>
                {/* icons */}
                <div className='md:flex gap-2 hidden'>
                    <Link to='#'>
                        <BsMeta className='h-5 w-5 hover:text-slate-300' />
                    </Link>
                    <Link to='#'>
                        <FaInstagram className='h-5 w-5 hover:text-slate-300' />
                    </Link>
                    <Link to='#'>
                        <RiTwitterXLine className='h-5 w-5 hover:text-slate-300' />
                    </Link>
                </div>
                <p className=''>We ship worldwide -  Fast and reliable shipping!</p>
                <div className='hidden md:block'>
                    <a href='tel:+923414570971' className='cursor-pointer hover:text-slate-300'>+92 324 567890</a>
                </div>
            </div>
        </div>
    )
}

export default Topbar