import React, { useState,useContext } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import {REACT_APP_BASE_USER_URL} from '../.app_url'
import {UserContext} from '../context/userContext'

const Login = () => {
  const [userData,setUserData]=useState({
    email:'',
    password:'',
  })

  const [error,setError]=useState('')
  const navigate=useNavigate()

  const {setCUser}=useContext(UserContext)

  const changeInputHandler=(e)=>{
    setUserData(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const loginUser= async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response=await axios.post(`${REACT_APP_BASE_USER_URL}/login`,userData)
      const user=await response.data      
      if (!user) {
        setError("Couldn't login. Please try again")
      }
      setCUser(user)
      navigate('/')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  }
  return (
    <div className="flex flex-col items-start justify-start w-[80%] md:w-[50%] mx-auto mb-20">
      <h1 className='text-3xl font-semibold'>Sign In</h1>
      {error && <p className='rounded-lg bg-red-500 text-white p-4 mt-6 w-full'>{error}</p>}
      <form action="" onSubmit={loginUser} className='flex flex-col items-start w-full gap-4 mt-6'>        
        <input className='p-3 rounded-lg w-full' required type="email" placeholder='Email' name='email' value={userData.email} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' required type="password" placeholder='Password' name='password' value={userData.password} autoFocus onChange={changeInputHandler} />
        <button className='rounded-lg py-4 px-8 bg-blue-500 text-white' type='submit'>Login</button>
      </form>
      <p className='mt-4'>Don't have an account? <Link className='text-blue-800 font-bold duration-100 hover:underline' to='/register'>Sign Up</Link> </p>
    </div>
  )
}

export default Login