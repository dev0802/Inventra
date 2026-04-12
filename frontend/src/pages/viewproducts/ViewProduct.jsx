import React, { useState } from 'react'

export default function ViewProduct() {
    const [showFilter, setShowFilter] = useState(false);
    const [updatePopup, setUpdatePopup] = useState(false);
    // const [updateData, setUpdateData] = useState({
    //     itemCode: '',
    //     itemDescription: '',
    //     grossWeight: '',
    //     stoneWeight: '',
    //     motiWeight: '',
    //     diamondWeight: '',
    //     solitaireWeight: '',
    //     colorStone: '',
    //     minnaWeight: '',
    //     netWeight: '',
    //     colouring: '',
    //     purchasedDate: '',
    //     saleDate: '',
    //     isSold: false,
    //     isDeleted: false
    // })

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        productName: '',
        code: '',
        viewBy: 'All'
    })

    const handleFilter = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleReset = () => {
        setFilters({ startDate: '', endDate: '', productName: '', code: '', viewBy: 'All' })
    }

    const handleApply = () => {
        // API call here later
        
        setShowFilter(false)
    }

    const handleDelete = (id) => {
        // API call here later
        console.log('Delete item:', id)
    }

    return (
        <div className='min-h-screen p-2 sm:p-4 md:p-6'>
            <div className='min-h-screen bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-600 border border-gray-400 rounded-2xl w-full p-3 sm:p-4 md:p-6'>

                <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-700'>View Products</h1>

                <div className='min-h-screen bg-white/50 mt-4 rounded-lg p-6 shadow-md'>
                    
                    {/* Filter Button */}
                    <div className='mb-5 flex justify-end gap-3'>
                        <button
                            className='flex items-center bg-white/50 hover:bg-white/70 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl border border-gray-300 transition'
                        >
                           Load Product
                        </button>
                        <button
                            onClick={() => setShowFilter(true)}
                            className='flex items-center gap-2 bg-white/50 hover:bg-white/70 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl border border-gray-300 transition'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Filter
                        </button>
                    </div>

                    {/* Table */}
                    <div className='bg-white/50 rounded-xl shadow-md overflow-x-auto'>
                        <table className='w-full border-collapse text-sm'>
                            <thead>
                                <tr>
                                    <th className='border border-gray-300 px-3 py-2'>
                                        <input type="checkbox" />
                                    </th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Item Code</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Name</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Purchase Date</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Sale Date</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-center whitespace-nowrap'>Sold</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-center whitespace-nowrap'>Deleted</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Net Weight</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Gross Wt</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Stone Wt</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Moti Wt</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Diamond Wt</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Solitaire Wt</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Color Stone</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Minna</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Colouring</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-center whitespace-nowrap'>Delete Item</th>
                                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-center whitespace-nowrap'>Update Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr>
                                    <th className='border border-gray-300 px-3 py-2'>
                                        <input type="checkbox" />
                                    </th>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800 font-medium'></td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800 font-semibold whitespace-nowrap'></td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'></td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'></td>
                                    <td className='border border-gray-300 px-3 py-2 text-center'>
                                        <span className='text-red-600 font-bold text-base'>✕</span>
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2 text-center'>
                                        <span className='text-red-600 font-bold text-base'>✕</span>
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.00</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.00</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 text-center'>
                                        <button
                                            onClick={() => handleDelete(5)}
                                            className='bg-white hover:bg-red-100 text-gray-700 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-red-300 transition'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className='border border-gray-300 px-3 py-2 text-center'>
                                        <button
                                            onClick={() => setUpdatePopup(true)}
                                            className='bg-white hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-blue-300 transition'
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>

                                {/* Total Row */}
                                <tr >
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800' colSpan={1}>Total Quantity : 0</td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.00</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.00</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2 font-bold text-gray-800'>0.000</td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                    <td className='border border-gray-300 px-3 py-2'></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                    {/* Summary Section */}
                    <div className='mt-1 bg-white/50 rounded-xl shadow-md p-2'>
                       <h2 className='text-sm font-bold text-gray-700 mb-3'>Summary</h2>
                       <div className='overflow-x-auto'>
                           <table className='w-full border-collapse text-sm'>
                               <thead>
                <tr>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Item Name</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Previous Qty</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Previous Wt</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Qty In (Unit)</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Qty In (Weight)</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Qty Out (Unit)</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Qty Out (Weight)</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Current Qty</th>
                    <th className='border border-gray-300 px-3 py-2 text-gray-600 font-medium text-left whitespace-nowrap'>Current Wt</th>
                </tr>
                               </thead>
                <tbody>
                {/* Replace with actual summary data */}
                <tr>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'></td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                    <td className='border border-gray-300 px-3 py-2 text-gray-800'>0</td>
                </tr>
                </tbody>
                           </table>
                       </div>
                    </div>
                <div className='w-full mt-5 flex justify-center gap-3'>
                    <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">Print to pdf</button>
                    <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">Print label</button>
                </div>
                
                {/* Update Popup */}
                {updatePopup && (
                <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                   <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto'>

                <div className='flex items-center justify-between mb-5'>
                <h2 className='text-base font-semibold text-gray-700'>Update Item</h2>
                <button onClick={() => setUpdatePopup(false)} className='text-gray-400 hover:text-gray-600'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
            
                <div className='flex flex-col gap-4'>

                {/* Row 1 - Code aur Description */}
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Item Code</label>
                        <input type='text' 
                            placeholder='e.g. 5'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Item Description</label>
                        <input type='text' 
                            placeholder='e.g. BABY RING'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                </div>

                {/* Row 2 - Dates */}
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Purchase Date</label>
                        <input type='date' 
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Sale Date</label>
                        <input type='date' 
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                </div>

                {/* Row 3 - Weights */}
                <div className='grid grid-cols-3 gap-3'>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Net Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Gross Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Stone Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                </div>

                {/* Row 4 - More Weights */}
                <div className='grid grid-cols-3 gap-3'>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Moti Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Diamond Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Solitaire Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                </div>

                {/* Row 5 - Remaining */}
                <div className='grid grid-cols-3 gap-3'>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Color Stone</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Minna Weight</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                    <div>
                        <label className='text-sm text-gray-500 mb-1 block'>Colouring</label>
                        <input type='number' 
                            placeholder='0.000'
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                    </div>
                </div>

                {/* Row 6 - Toggles */}
                <div className='grid grid-cols-2 gap-3'>
                    <div className='flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2'>
                        <label className='text-sm text-gray-500'>Is Sold?</label>
                        <div className='flex gap-2'>
                            
                        </div>
                    </div>
                    <div className='flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2'>
                        <label className='text-sm text-gray-500'>Is Deleted?</label>
                        <div className='flex gap-2'>
                            
                        </div>
                    </div>
                </div>

            </div>
                

            <div className='flex gap-3 mt-6'>
                <button onClick={() => setUpdatePopup(false)}
                    className='flex-1 text-sm py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition'>
                    Cancel
                </button>
                <button 
                    className='flex-1 text-sm py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium'>
                    Update Item
                </button>
            </div>
                   </div>
                </div>
                )}

                {/* Filter Popup */}
                {showFilter && (
                    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-5'>

                            <div className='flex items-center justify-between mb-5'>
                                <h2 className='text-base font-semibold text-gray-700'>Filter Products</h2>
                                <button onClick={() => setShowFilter(false)} className='text-gray-400 hover:text-gray-600'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='text-sm text-gray-500 mb-1 block'>Start Date</label>
                                        <input type='date' name='startDate' value={filters.startDate} onChange={handleFilter}
                                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                                    </div>
                                    <div>
                                        <label className='text-sm text-gray-500 mb-1 block'>End Date</label>
                                        <input type='date' name='endDate' value={filters.endDate} onChange={handleFilter}
                                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                                    </div>
                                </div>

                                <div>
                                    <label className='text-sm text-gray-500 mb-1 block'>Product Name</label>
                                    <select name='productName' value={filters.productName} onChange={handleFilter}
                                        className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400'>
                                        <option value=''>All Products</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='text-sm text-gray-500 mb-1 block'>Item Code</label>
                                    <input type='text' name='code' value={filters.code} onChange={handleFilter} placeholder='e.g. 5'
                                        className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
                                </div>

                                <div>
                                    <label className='text-sm text-gray-500 mb-1 block'>View By</label>
                                    <div className='flex gap-2'>
                                        {['All', 'Sold', 'Unsold', 'Deleted'].map(opt => (
                                            <button key={opt} onClick={() => setFilters({ ...filters, viewBy: opt })}
                                                className={`flex-1 text-sm py-2 rounded-lg border transition font-medium
                                                ${filters.viewBy === opt
                                                        ? 'bg-gray-700 text-white border-gray-700'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-3 mt-6'>
                                <button onClick={handleReset}
                                    className='flex-1 text-sm py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition'>
                                    Reset
                                </button>
                                <button onClick={handleApply}
                                    className='flex-1 text-sm py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium'>
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

// import React from 'react'

// export default function ViewProduct() {
//     return (
//         <div className='h-screen'>
//             <div className='w-full h-1/6 bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl shadow-lg min-h-screen p-6 md:max-w-8xl md:min-h-4xl mx-auto '>
//                 <h1 className='text-2xl font-bold text-gray-700'>View Products</h1>
//                 <div className='min-h-screen bg-white/50 mt-4 rounded-lg p-6 shadow-md'>
//                     <div className='w-88 mb-5 flex justify-end'> 
//                         <button className='bg-gray hover:bg-white border border-gray-400 text-gray-700 text-sm font-bold py-2 px-4 rounded '>
//                             Filter
//                         </button>
//                     </div>
//                     <table className='w-full border-collapse border border-gray-400  rounded-lg shadow-md'>
//                         <thead>
//                             <tr>
//                                 <th className='border border-gray-400 px-4 py-2'>Item Description</th>
//                                 <th className='border border-gray-400 px-4 py-2'>HSN Code</th>
//                                 <th className='border border-gray-400 px-4 py-2'>Gross Weight</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {/* Sample data - replace with actual product data */}
//                             <tr>
//                                 <td className='border border-gray-400 px-4 py-2'>Sample Product 1</td>
//                                 <td className='border border-gray-400 px-4 py-2'>7113</td>
//                                 <td className='border border-gray-400 px-4 py-2'>1.5</td>
//                             </tr>
//                             <tr>
//                                 <td className='border border-gray-400 px-4 py-2'>Sample Product 2</td>
//                                 <td className='border border-gray-400 px-4 py-2'>7113</td>
//                                 <td className='border border-gray-400 px-4 py-2'>2.0</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }
// import React, { useState } from 'react'

// export default function ViewProduct() {
//     const [showFilter, setShowFilter] = useState(false)
//     const [filters, setFilters] = useState({
//         startDate: '',
//         endDate: '',
//         productName: '',
//         code: '',
//         viewBy: 'All'
//     })

//     const handleFilter = (e) => {
//         setFilters({ ...filters, [e.target.name]: e.target.value })
//     }

//     const handleReset = () => {
//         setFilters({ startDate: '', endDate: '', productName: '', code: '', viewBy: 'All' })
//     }

//     const handleApply = () => {
//         // API call here later
//         setShowFilter(false)
//     }

//     return (
//         <div className='min-h-screen p-2 sm:p-4 md:p-6'>
//             <div className='min-h-screen bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-600 border border-gray-400 rounded-2xl w-full p-3 sm:p-4 md:p-6'>

//                 <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-700'>View Products</h1>
//                 <div className='min-h-screen bg-white/50 mt-4 rounded-lg p-6 shadow-md'>
//                     <div className='w-88 mb-5 flex justify-end'>
//                         <button
//                             onClick={() => setShowFilter(true)}
//                             className='flex items-center gap-2 bg-white/50 hover:bg-white/70 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl border border-gray-300 transition'
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
//                             </svg>
//                             Filter
//                         </button>
//                     </div>
                    

//                     {/* Table */}
//                     <div className='bg-white/50 rounded-xl shadow-md overflow-x-auto'>
//                         <table className='w-full border-collapse text-sm'>
//                             <thead>
//                                 <tr className='bg-white/40'>
//                                     <th className='border border-gray-300 px-4 py-2 text-gray-600 font-medium text-left'>Item Description</th>
//                                     <th className='border border-gray-300 px-4 py-2 text-gray-600 font-medium text-left'>HSN Code</th>
//                                     <th className='border border-gray-300 px-4 py-2 text-gray-600 font-medium text-left'>Gross Weight</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr className='hover:bg-white/40 transition'>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>Sample Product 1</td>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>7113</td>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>1.5</td>
//                                 </tr>
//                                 <tr className='hover:bg-white/40 transition'>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>Sample Product 2</td>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>7113</td>
//                                     <td className='border border-gray-300 px-4 py-2 text-gray-700'>2.0</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Filter Popup */}
//                 {showFilter && (
//                     <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
//                         <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-5'>

//                             <div className='flex items-center justify-between mb-5'>
//                                 <h2 className='text-base font-semibold text-gray-700'>Filter Products</h2>
//                                 <button onClick={() => setShowFilter(false)} className='text-gray-400 hover:text-gray-600'>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             <div className='flex flex-col gap-4'>
//                                 <div className='grid grid-cols-2 gap-3'>
//                                     <div>
//                                         <label className='text-xs text-gray-500 mb-1 block'>Start Date</label>
//                                         <input type='date' name='startDate' value={filters.startDate} onChange={handleFilter}
//                                             className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
//                                     </div>
//                                     <div>
//                                         <label className='text-xs text-gray-500 mb-1 block'>End Date</label>
//                                         <input type='date' name='endDate' value={filters.endDate} onChange={handleFilter}
//                                             className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className='text-xs text-gray-500 mb-1 block'>Product Name</label>
//                                     <select name='productName' value={filters.productName} onChange={handleFilter}
//                                         className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400'>
//                                         <option value=''>All Products</option>

//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className='text-xs text-gray-500 mb-1 block'>Code</label>
//                                     <input type='text' name='code' value={filters.code} onChange={handleFilter} placeholder='e.g. 5'
//                                         className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400' />
//                                 </div>

//                                 <div>
//                                     <label className='text-xs text-gray-500 mb-1 block'>View By</label>
//                                     <div className='flex gap-2'>
//                                         {['All', 'Sold', 'Unsold', 'Deleted'].map(opt => (
//                                             <button key={opt} onClick={() => setFilters({ ...filters, viewBy: opt })}
//                                                 className={`flex-1 text-xs py-2 rounded-lg border transition font-medium
//                                                 ${filters.viewBy === opt
//                                                         ? 'bg-gray-700 text-white border-gray-700'
//                                                         : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
//                                                 {opt}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className='flex gap-3 mt-6'>
//                                 <button onClick={handleReset}
//                                     className='flex-1 text-sm py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition'>
//                                     Reset
//                                 </button>
//                                 <button onClick={handleApply}
//                                     className='flex-1 text-sm py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium'>
//                                     Apply Filters
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                 )}
//             </div>
//         </div>
//     )
// };
