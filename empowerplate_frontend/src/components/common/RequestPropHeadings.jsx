import React from 'react'

function RequestPropHeadings() {
    return (
        <div className='p-5 grid grid-cols-5 gap-4 bg-gray-800 text-white'>
            <div>
                <strong>Request Type</strong>
            </div>
            <div>
                <strong>Current Status</strong>
            </div>
            <div>
                <strong>Updated At</strong>
            </div>
            <div>
                <strong>Food Type</strong>
            </div>
            <div>
                <strong>Amount</strong>
            </div>
        </div>
    )
}

export default RequestPropHeadings
