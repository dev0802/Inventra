import React from 'react'
import { Link, Outlet } from 'react-router-dom'
export default function MainPage() {
  return (
    <div className='bg-gray-300 min-h-screen p-2 '>
      {/* Header */}
      <header className='w-full flex items-center justify-between bg-gradient-to-r from-gray-700 to-gray-800 px-4 md:px-8 py-3 md:py-4 shadow-lg'>
        <h1 className='text-white text-sm md:text-xl font-bold tracking-widest uppercase'>BrandEase</h1>
        <h2 className='text-white text-base md:text-2xl font-semibold tracking-wide'>Inventra</h2>
        <button className='text-white text-xs md:text-sm font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200'>
          John
        </button>
      </header>
      {/* Navigation Bar*/}
      <div className='w-full flex justify-center'>
        <nav className='flex flex-row justify-center gap-1 sm:gap-5 bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-400 rounded-full shadow-lg p-1 md:p-4 mt-3 w-full max-w-2xl mx-auto'>
          {/* Add Products */}
          <Link to='/main/addproducts'>
            <button
              className='text-center text-white text-[10px] md:text-sm font-semibold px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200 whitespace-nowrap'          >
              Add Products
            </button>
          </Link>
          {/* View Products */}
          <button
            className='text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200 whitespace-nowrap'
          >
            View Products
          </button>
          {/* Print Invoice */}
          <button
            className='text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200 whitespace-nowrap'
          >
            Print Invoice
          </button>
          {/* Report */}
          <button
            className='text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200 whitespace-nowrap'
          >
            Report
          </button>
        </nav>
      </div>
      
      <main className='flex-1 p-4'>
        <Outlet />
      </main>
    </div>
  )
}