import React from 'react'
import loadingGif from '../assets/loading.gif'

const Loader = () => {
  return (
    <div className="w-full flex items-center justify-center">
        <img src={loadingGif} alt="" />
    </div>
  )
}

export default Loader