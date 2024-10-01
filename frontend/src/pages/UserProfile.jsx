import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import {UserContext} from '../context/userContext'
import axios from 'axios';
import { REACT_APP_ASSETS_URL, REACT_APP_BASE_USER_URL } from '../.app_url';

const UserProfile = () => {
  const {cUser}=useContext(UserContext)
  const token=cUser?.token
  const navigate=useNavigate()
  const [error,setError]=useState()
  const [avatar,setAvatar]=useState()
  const [avatarC,setAvatarC]=useState(false)

  useEffect(()=>{
    if (!token) {
      navigate('/login')
    }
  },[])

  const [userData,setUserData]=useState({
    name:'',
    email:'',
    currentPassword:'',
    password:'',
    password2:''
  })

  const changeInputHandler=(e)=>{
    setUserData(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  useEffect(()=>{
    const getPost=async()=>{
      try {
        const response = await axios.get(`${REACT_APP_BASE_USER_URL}/${cUser.id}`,{
          withCredentials:true , headers:{Authorization:`Bearer ${token}`}})
          setUserData({
            name: response.data.name,
            email: response.data.email,
          });
        setAvatar(response.data.avatar)        
      } catch (err) {
        setError(err.response.data.message);
      }
    }
    getPost()
  },[])

  const changeAvatarHandler= async ()=>{
    setAvatarC(false)
    try {
      const postData=new FormData()
      postData.set('avatar',avatar)
      const response=await axios.post(`${REACT_APP_BASE_USER_URL}/change-avatar`,postData,{
        withCredentials:true , headers:{Authorization:`Bearer ${token}`}})
      setAvatar(response.data.avatar)
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  const updateUser=async(e)=>{
    e.preventDefault()
    try {
      // const userData1 = new FormData(); 
      // userData1.set('name', userData.name); 
      // userData1.set('email', userData.email); 
      // userData1.set('currentPassword', userData.currentPassword); 
      // userData1.set('newPassword', userData.password); 
      // userData1.set('confirmNewPassword', userData.password2); 
      const response=await axios.patch(`${REACT_APP_BASE_USER_URL}/edit-user`,{
        name: userData.name,
        email: userData.email,
        currentPassword: userData.currentPassword,
        newPassword: userData.password,
        confirmNewPassword: userData.password2
      },{
        withCredentials:true , headers:{Authorization:`Bearer ${token}`}})
      if (response.status==200) {
        navigate('/logout')
      }

    }
    catch(err){
      setError(err.response.data.message)
    }
  }
  return (
    <div className="flex flex-col items-center justify-start w-[80%] md:w-[50%] mx-auto mb-20">
      <Link to={`/myposts/${cUser.id}`} className='p-3 rounded-xl bg-white mb-4 hover:bg-gray-900 hover:text-white duration-100'>My Posts</Link>
      <div className="relative">
        <img className='rounded-full border-8 border-white w-40 h-40 object-cover' src={avatar} alt={userData.name} />
        <div className={`cursor-pointer absolute bottom-2 right-4 rounded-full p-2 ${avatarC?'bg-blue-600':'bg-gray-900'} `}>
          <form action="" encType="multipart/form-data">
            <input className='hidden' type="file" name='avatar' id='avatar' accept='png, jpg, jpeg' onChange={e=>setAvatar(e.target.files[0])} />
            <label className={`text-xl cursor-pointer ${avatarC?'hidden':'block'}`} htmlFor="avatar" onClick={()=>setAvatarC(true)}>
              <FaEdit color='white'/>            
            </label >
            {avatarC && <label className='cursor-pointer' onClick={changeAvatarHandler}>
              <FaCheck color='white'/>            
            </label> }           
          </form>
        </div>
      </div>
      <h1 className='text-3xl font-semibold mt-2'>{cUser.name}</h1>
      {error && <p className='rounded-lg bg-red-500 text-white p-4 mt-6 w-full'>{error}</p>}
      <form action="" onSubmit={updateUser} className='flex flex-col items-start w-full gap-4 mt-6'>        
        <input className='p-3 rounded-lg w-full' type="text" placeholder='Full Name' name='name' value={userData.name} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' type="email" placeholder='Email' name='email' value={userData.email} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' type="password" placeholder='Current Password' name='currentPassword' value={userData.currentPassword} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' type="password" placeholder='New Password' name='password' value={userData.password} autoFocus onChange={changeInputHandler} />
        <input className='p-3 rounded-lg w-full' type="password" placeholder='Confirm New Password' name='password2' value={userData.password2} autoFocus onChange={changeInputHandler} />
        <button className='rounded-lg py-4 px-6 bg-blue-500 text-white' type='submit'>Update Profile Details</button>
      </form>
    </div>
  );
};

export default UserProfile;
