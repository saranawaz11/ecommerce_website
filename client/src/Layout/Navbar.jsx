import { Link } from 'react-router-dom'
import { AiOutlineUser } from 'react-icons/ai';
import { BsHandbag } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import SearchBar from '../Common/SearchBar';
import { useSelector } from 'react-redux';

function Navbar({ toggleCartDrawer }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const cartItemCount = cart?.orderItems?.reduce((total, product) => total + product.quantity, 0) || 0;
  const toggleMenuBar = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleSearch = () => {
    setOpenSearch(!openSearch);
  }

  return (
    <div className='border-b px-4'>
      <div className='container mx-auto flex justify-between items-center py-4'>
        <Link to='/' className='text-green-950 font-bold text-2xl hover:text-shadow-md'>Citadel</Link>
        <div className='hidden md:flex flex-row gap-4 text-xs font-semibold'>
          <Link to='/collections/all?gender=Men' className='hover:text-slate-700'>MEN</Link>
          <Link to='/collections/all?gender=Women' className='hover:text-slate-700'>WOMEN</Link>
          <Link to='/collections/all?category=Top Wear' className='hover:text-slate-700'>TOP WEAR</Link>
          <Link to='/collections/all?category=Bottom Wear' className='hover:text-slate-700'>BOTTOM WEAR</Link>
        </div>

        <div className='flex gap-3 text-green-950  items-center justify-center'>
          {user && user.role === "admin" && (
            <Link to='/admin' className='bg-black text-white rounded hover:bg-black/80 btn'>
              <p className='text-sm px-1'>Admin</p>
            </Link>
          )}
          <div>
            {user ? (
              <Link to='/profile'>
                <AiOutlineUser className='h-5 w-5 transform duration-200 hover:scale-125 hover:text-green-800' />
              </Link>
            ) : (
              <Link to='/login'>
                <AiOutlineUser className='h-5 w-5 transform duration-200 hover:scale-125 hover:text-green-800' />
              </Link>)}

          </div>
          <div>
            <div className='relative flex justify-center items-center'>
              <button onClick={toggleCartDrawer} className='cursor-pointer'>
                <BsHandbag className='h-5 w-5 transfprm duration-200 hover:scale-125 hover:text-green-800' />
              </button>
              {cartItemCount > 0 && (
                <div className='absolute -top-2 rounded-full text-xs flex justify-center items-center -right-3 bg-red-800 h-5 w-5 text-white'>
                  <span>
                    {cartItemCount}
                  </span>
                </div>
              )}

            </div>

          </div>
          <div className='flex  justify-center items-center'>
            <button onClick={toggleSearch}><BiSearch className='btn h-5 w-5 transfprm duration-200 hover:scale-125 hover:text-green-800' /></button>
            {
              openSearch && (
                <div className='fixed bg-slate-200 w-full top-0 right-0'>
                  <SearchBar toggleSearch={toggleSearch} />
                </div>
              )
            }
          </div>

          <div className='md:hidden' onClick={toggleMenuBar}>
            <button><FaBarsStaggered /></button>
          </div>
        </div>

        {
          menuOpen && (
            <div className='z-50 p-4 gap-4 md:hidden fixed h-full flex flex-col justify-center left-0 top-0 w-3/4 md:hodden bg-white'>
              <div className='flex justify-end'>
                <button onClick={toggleMenuBar}><FaXmark /></button>
              </div>
              <div className='flex flex-col text-sm gap-2 text-center'>
                <Link to='/collections/all?gender=Men' className='hover:text-slate-700'>MEN</Link>
                <Link to='/collections/all?gender=Women' className='hover:text-slate-700'>WOMEN</Link>
                <Link to='/collections/all?category=Top Wear' className='hover:text-slate-700'>TOP WEAR</Link>
                <Link to='/collections/all?category=Bottom Wear' className='hover:text-slate-700'>BOTTOM WEAR</Link>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Navbar