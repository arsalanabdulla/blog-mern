import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UserContext} from '../context/userContext'
import Loader from "../components/Loader";
import DeletePost from './DeletePost'
import { REACT_APP_ASSETS_URL, REACT_APP_BASE_POST_URL } from "../.app_url";
import axios from "axios";

const Dashboard = () => {
  const [posts,setPosts]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const {cUser}=useContext(UserContext)
  const token=cUser?.token
  const navigate=useNavigate()
  const {id}=useParams()

  useEffect(()=>{
    if (!token) {
      navigate('/login')
    }
  },[])

  useEffect(()=>{
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${REACT_APP_BASE_POST_URL}/users/${id}`,{
          withCredentials:true , headers:{Authorization:`Bearer ${token}`}});
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  },[id])

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col gap-4 w-[80%] mx-auto mb-10">
      {
            posts.length > 0 ? posts.map((post)=> {
              return(
                <div key={post._id} className="flex md:flex-row flex-col w-full py-2 px-4 rounded-xl bg-white justify-between">
                  <div className="flex gap-4 items-center">
                    <img className='w-20 h-20 object-cover rounded-lg' src={`${REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                    <h1>{post.title}</h1>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-5 md:mt-0">
                    <Link to={`/posts/${post._id}`} className='p-3 bg-slate-200 rounded-lg duration-150 hover:bg-slate-300'>View</Link>
                    <Link to={`/posts/${post._id}/edit`} className='p-3 bg-blue-500 text-white rounded-lg duration-150 hover:bg-blue-600'>Edit</Link>
                    <DeletePost postId={post._id}/>
                  </div>                  
                </div>
              )
            })
            : <h1 className='text-3xl font-semibold p-10'>You have no posts yet!</h1>
        }
    </div>
  )
}

export default Dashboard