import React from 'react'
import { Link, Outlet } from 'react-router-dom'
export default function MainPage() {
  return (
    <div className='bg-gray-400 min-h-screen p-2 '>
      {/* Header */}
      <header className='w-full flex items-center justify-between bg-gray-400 px-4 md:px-8 py-3 md:py-4'>
        <h1 className='text-white text-sm md:text-xl font-bold tracking-widest uppercase'>BrandEase</h1>
        {/* <h2 className='text-white text-base md:text-2xl font-semibold tracking-wide'>Inventra</h2> */}
        <div className='w-full flex justify-center'>
          <nav className='flex flex-row justify-center gap-1 sm:gap-5 bg-transparent'>
            {/* Add Products */}

              <Link to='/main/addproducts'>
            {/* <div className='flex hover:text-gray-400 hover:underline'> */}
                <button
                  className='relative text-center text-white text-lg after:absolute after:left-0 after:centre after:bottom-0 after:h-[3px] after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-500 font-semibold px-1 md:px-4 py-1.5 md:py-2  transition-all duration-200 whitespace-nowrap'          >
                  Add Products
                </button>
            
              </Link>
            {/* View Products */}
            <button
                  className='relative text-center text-white text-lg after:absolute after:left-0 after:centre after:bottom-0 after:h-[3px] after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-500 font-semibold px-1 md:px-4 py-1.5 md:py-2  transition-all duration-200 whitespace-nowrap'          >
            
              View Products
            </button>
            {/* Print Invoice */}
            <button
                                className='relative text-center text-white text-lg after:absolute after:left-0 after:centre after:bottom-0 after:h-[3px] after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-500 font-semibold px-1 md:px-4 py-1.5 md:py-2  transition-all duration-200 whitespace-nowrap'          >

              Print Invoice
            </button>
            {/* Report */}
            <button
              className='relative text-center text-white text-lg after:absolute after:left-0 after:centre after:bottom-0 after:h-[3px] after:w-0 after:bg-gray-500 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-500 font-semibold px-1 md:px-4 py-1.5 md:py-2  transition-all duration-200 whitespace-nowrap'
            >
              Report
            </button>
          </nav>
        </div>
        <button className='text-white text-xs md:text-sm font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200'>
          John
        </button>
      </header>
      {/* Navigation Bar*/}

      <main className='flex-1 p-4'>
        <Outlet />
      </main>
    </div>
  )
}