import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <Link className='bg-slate-800 text-white p-4 rounded-xl' to='/'>Go Back Home</Link>
      <h1 className='mt-8 text-4xl font-semibold'>Page Note Found</h1>
    </div>
  )
}

export default ErrorPage