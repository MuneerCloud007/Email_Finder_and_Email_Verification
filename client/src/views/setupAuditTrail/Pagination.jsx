import React, { Children } from 'react'

export function PaginationCustom({children}) {
  return (
    <div className="w-full border-t border-gray-300">
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p>
            showing <strong>1</strong> to <strong>10</strong> of <strong>20</strong> results
          </p>
        </div>
        <div className="space-x-2">
         {children}
        </div>
      </div>
    </div>
  )
}
