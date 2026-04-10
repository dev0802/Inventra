import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
export default function MainPage({ setIsLoggedIn }) {
  // Retrieve the user's name from local storage and set up state for dropdown visibility
  const userName = localStorage.getItem("userName");
  // State variable to control the visibility of the user dropdown menu
  const [showDropdown, setShowDropdown] = React.useState(false);
  // Extract the first name from the full name for display in the user button
  const firstName = userName ? userName.split(" ")[0] : "User";
  // Hook for navigating to different routes after logout
  const navigate = useNavigate();
  return (
    <div className='bg-gray-400 min-h-screen  '>
      {/* Header */}
      <header className='w-full flex items-center justify-between bg-gray-400 px-4 md:px-8 py-3 md:py-4'>
        <h1 className='text-white text-sm md:text-xl font-bold tracking-widest uppercase'>BrandEase</h1>
        {/* <h2 className='text-white text-base md:text-2xl font-semibold tracking-wide'>Inventra</h2> */}
        <div className='w-full flex justify-center'>
          <nav className='flex flex-row justify-center gap-1 sm:gap-5 bg-transparent'>
            {/* Add Products */}
            {/* Navigation link to the Add Products page, with active styling based on the current route */}
            <NavLink
              to='/main/addproducts'
              className={({ isActive }) =>
                isActive
                  ? 'relative text-center text-gray-600 text-lg after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:bg-gray-600 after:transition-all after:duration-300 font-semibold px-1 md:px-4 py-1.5 md:py-2 transition-all duration-200 whitespace-nowrap'
                  : 'relative text-center text-white text-lg after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-0 after:bg-gray-600 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-600 font-semibold px-1 md:px-4 py-1.5 md:py-2 transition-all duration-200 whitespace-nowrap'
              }
            >
              Add Products
            </NavLink>
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
        <div className="relative">
          {/* User button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='text-white text-xs md:text-sm font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200'>
            {firstName}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-500 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {

                  localStorage.removeItem('userName');
                  setIsLoggedIn(false);
                  navigate('/');
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* <button className='text-white text-xs md:text-sm font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200'>
          {firstName}
        </button> */}
      </header>
      {/* Navigation Bar*/}

      <main className='flex-1 p-4'>
        <Outlet />
      </main>
    </div>
  )
}