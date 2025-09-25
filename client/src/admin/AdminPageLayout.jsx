import React, { useEffect, useRef, useState } from 'react'
import { FaBarsStaggered } from 'react-icons/fa6';
import { Outlet } from 'react-router-dom';
import AdminMenuSideBar from './AdminMenuSideBar';

function AdminPageLayout() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(null);
    const toggleAdminMenu = () => {
        setIsOpenSidebar(!isOpenSidebar)
    }
    const sidebarRef = useRef(null);
    const handleClickOutside = (e) => {
        // close sidebar if clicked outside sidebar in phone view
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsOpenSidebar(false);
        }
    }

    useEffect(() => {
        // event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);
        // clean event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [])
    return (
        <div className='flex '>
            {/* Sidebar */}
            {
                isOpenSidebar && (
                    <div ref={sidebarRef} className='z-50 fixed top-0'>
                        <AdminMenuSideBar toggleAdminMenu={toggleAdminMenu} />
                    </div>
                )
            }
            <div className='hidden lg:block w-[30%]'>
                <AdminMenuSideBar toggleAdminMenu={toggleAdminMenu} />
            </div>
            <div className='flex flex-col w-full  mt-2 mb-8'>
                <div className='lg:hidden flex justify-end mt-4 mx-4'>
                    <button className='' onClick={toggleAdminMenu}><FaBarsStaggered /></button>
                </div>
                <main className='lg:w-full'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminPageLayout