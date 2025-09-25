import React, { useState } from 'react'
import Topbar from './Topbar'
import Navbar from './Navbar'
import CartDrawer from '../Common/CartDrawer'
import Footer from '../Common/Footer';
import { Outlet } from 'react-router';

function UserLayout() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleCartDrawer = () => {
    setOpenDrawer(!openDrawer);
  }

  return (
    <div className=''>
      {/* Navbar */}
      <div className='w-full'>
        {/* Topbar */}
        <Topbar />
        {/* Navbar */}
        <Navbar toggleCartDrawer={toggleCartDrawer} />
        {/* Cart drawer */}
        {
          openDrawer && (
            <div className='fixed z-50 top-0 right-0 w-3/4 md:w-1/4 h-full bg-white'>
              <CartDrawer toggleCartDrawer={toggleCartDrawer} />
            </div>)
        }
      </div>

      {/*main content  */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default UserLayout