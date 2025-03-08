import React from 'react'

function Container({children}) {
  return (
    <div className='p-0 m-0 bg-orange-50 h-full w-full'>
      {children}
    </div>
  )
}

export default Container
