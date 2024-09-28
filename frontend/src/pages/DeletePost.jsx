import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from 'axios'
import { REACT_APP_BASE_POST_URL } from "../.app_url";
import Loader from "../components/Loader";


const DeletePost = ({postId}) => {
  const { cUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const token = cUser?.token;
  const navigate = useNavigate();
  const location=useLocation()

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const deletePost = async()=>{
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(`${REACT_APP_BASE_POST_URL}/${postId}`,{
        withCredentials:true , headers:{Authorization:`Bearer ${token}`}})
      
      if (response.status==200) {
        if (location.pathname==`/myposts/${cUser.id}`) {
          return navigate(0)
        }
        else{return navigate('/')}
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link
    onClick={deletePost}      
      className="rounded-2xl py-3 px-5 bg-red-700 text-white"
    >
      Delete
    </Link>
  );
};

export default DeletePost;
