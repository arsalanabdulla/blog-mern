import React, { useState,useContext, useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {UserContext} from '../context/userContext'
import {useNavigate} from 'react-router-dom'
import categories from '../categories'
import axios from 'axios'
import {REACT_APP_BASE_POST_URL} from '../.app_url'

const modules={
  toolbar:[
    [{'header':[1,2,3,4,5,6,false]}],
    ['bold','italic','underline','strike','blockquote'],
    [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'},],
    ['link','image'],
    ['clean']
  ]
}

const formats=[
  'header',
  'bold','italic','underline','strike','blockquote',
  'list','bullet','indent',
  'link','image'
]
const CreatePost = () => {  
  const {cUser}=useContext(UserContext)
  const token=cUser?.token
  const navigate=useNavigate()

  useEffect(()=>{
    if (!token) {
      navigate('/login')
    }
  },[])

  const [error,setError]=useState('')
  const [thumbnail,setThumbnail]=useState()
  const [des,setDes]=useState('')
  const [userData,setUserData]=useState({
    title:'',
    category:'Uncategorized',    
  })

  const changeInputHandler=(e)=>{
    setUserData(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const createPost=async(e)=>{
    e.preventDefault()
    const postData=new FormData()
    postData.set('title',userData.title)
    postData.set('category',userData.category)
    postData.set('thumbnail',thumbnail)
    postData.set('description',des)

    try {
      const response=await axios.post(REACT_APP_BASE_POST_URL,postData,{
        withCredentials:true , headers:{Authorization:`Bearer ${token}`}})
      
      if (response.status==200) {
        return navigate('/')
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <div className="flex flex-col items-start justify-start w-[90%] lg:w-[50%] mx-auto mb-20">
      <h1 className='text-3xl font-semibold'>Create Post</h1>
      {error && <p className='rounded-lg bg-red-500 text-white p-4 mt-6 w-full'>{error}</p>}
      <form action="" onSubmit={createPost} className='flex flex-col items-start w-full gap-4 mt-6'>        
        <input className='p-3 rounded-lg w-full' required type="text" placeholder='Title' name='title' value={userData.title} autoFocus onChange={changeInputHandler} />
        <select className='p-3 rounded-lg w-full' name='category' value={userData.category} onChange={changeInputHandler}>
          {
            categories.map((cat)=> <option key={cat}>{cat}</option> )
          }
        </select>
        <ReactQuill modules={modules} formats={formats} theme="snow" value={des} onChange={setDes} className='p-3 rounded-lg w-full'/>
        <input className='p-3 rounded-lg w-full'  type="file" onChange={e=>setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
        {/* <input className='p-3 rounded-lg w-full'  type="password" placeholder='Confirm Password' name='password2' value={userData.password2} autoFocus onChange={changeInputHandler} /> */}
        <button className='rounded-lg py-4 px-8 bg-blue-500 text-white' type='submit'>Create</button>
      </form>
    </div>
  )
}

export default CreatePost