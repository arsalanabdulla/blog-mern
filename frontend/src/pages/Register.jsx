import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import {REACT_APP_BASE_USER_URL} from '../.app_url'

const Register = () => {
  const [userData,setUserData]=useState({
    name:'',
    email:'',
    password:'',
    password2:''
  })

  const [error,setError]=useState('')
  const navigate=useNavigate()

  const changeInputHandler=(e)=>{
    setUserData(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const verifyEmail = async (email) => {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=ddedc0f2502e411ae07d9de8470311872f511f83`
      );
      const verificationData = response.data.data;
      return verificationData.status === "valid"; // "valid", "invalid", or "risky"
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const registerUser= async (e)=>{
    e.preventDefault()
    setError('')

    const isEmailValid = await verifyEmail(userData.email);
    if (!isEmailValid) {
      return setError('Email does not exist or is not valid.');
    }
    try {
      const response=await axios.post(`${REACT_APP_BASE_USER_URL}/register`,userData)
      const newUser=await response.data      
      if (!newUser) {
        setError("Couldn't register user. Please try again")
      }
      navigate('/login')
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
      <h1 className='text-3xl font-semibold'>Sign Up</h1>
      {error && <p className='rounded-lg bg-red-500 text-white p-4 mt-6 w-full'>{error}</p>}
      <form action="" onSubmit={registerUser} className='flex flex-col items-start w-full gap-4 mt-6'>        
        <input className='p-3 rounded-lg w-full' required type="text" placeholder='Full Name' name='name' value={userData.name} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' required type="email" placeholder='Email' name='email' value={userData.email} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' required type="password" placeholder='Password' name='password' value={userData.password} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' required type="password" placeholder='Confirm Password' name='password2' value={userData.password2} autoFocus onChange={changeInputHandler} />
        <button className='rounded-lg py-4 px-8 bg-blue-500 text-white' type='submit'>Register</button>
      </form>
      <p className='mt-4'>Already have an account? <Link className='text-blue-800 font-bold duration-100 hover:underline' to='/login'>Sign In</Link> </p>
    </div>
  )
}

export default Register