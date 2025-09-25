import React from 'react'
import { Link } from 'react-router'
import { BsMeta } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { RiTwitterXLine } from 'react-icons/ri';
import { HiOutlinePhone } from 'react-icons/hi';

function Footer() {
    return (
        <div className='w-full p-2 bg-pink-50'>
            <div className='container mx-auto border-b m-5 md:flex justify-between'>
                <div className='md:w-1/4 w-full p-4 '>
                    <h2 className='font-bold mb-4'>Newsletter</h2>
                    <p className='text-sm'>Be the first to hear about new products, exclusive events, and online offers.</p>
                    <p className='py-3 text-xs font-semibold'>Signup and get 10% off your first offer.</p>
                    <form className='flex'>
                        <input type="email" name="email" required placeholder='Enter your email' className='p-2 rounded-l outline-none border text-xs' />
                        <button className='text-xs p-2 bg-black btn rounded-r text-white hover:text-slate-300 transform duration-300 transition-all'>Subscribe</button>
                    </form>
                </div>

                <div className='md:w-1/4 w-full p-4'>
                    <h2 className='font-bold mb-4'>Shop</h2>
                    <ul className='text-sm flex flex-col gap-1'>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Men's Top Wear</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Women's Top Wear</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Men's Bottom Wear</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Women's Bottom Wear</Link>
                        </li>
                    </ul>
                </div>

                <div className='md:w-1/4 w-full p-4'>
                    <h2 className='font-bold mb-4'>Support</h2>
                    <ul className='text-sm flex flex-col gap-1'>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Contact Us</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>About Us</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>FAQs</Link>
                        </li>
                        <li>
                            <Link className='hover:text-slate-600 transform duration-300'>Features</Link>
                        </li>
                    </ul>
                </div>

                <div className='md:w-1/4 w-full p-4'>
                    <h2 className='font-bold mb-4'>Follow Us</h2>
                    {/* icons */}
                    <div className='flex gap-3 '>
                        <Link to='https://www.facebook.com' target='_blank' rel='noopener noreferrer' className='hover:text-slate-600 duration-200'>
                            <BsMeta />
                        </Link>
                        <Link to='https://www.instagram.com' target='_blank' rel='noopener noreferrer' className='hover:text-slate-600 duration-200'>
                            <FaInstagram />
                        </Link >
                        <Link to='https://www.twitter.com' target='_blank' rel='noopener noreferrer' className='hover:text-slate-600 duration-200'>
                            <RiTwitterXLine />
                        </Link>
                    </div>
                    <p className='text-sm pt-4 text-slate-700'>Call Us</p>
                    <div className='flex gap-1 items-center  hover:text-slate-700  cursor-pointer'>
                        <HiOutlinePhone />
                        <p className='font-semibold text-sm'>+92 345 67890</p>
                    </div>
                </div>
            </div>
            <p className='text-center pb-5 text-xs'>&copy; 2024, CompileTab. All Rights Reserved.</p>
        </div>
    )
}

export default Footer