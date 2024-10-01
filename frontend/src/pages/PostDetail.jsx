import React,{useState,useEffect,useContext} from "react";
import PostAuthor from "../components/PostAuthor";
import {Link, useParams} from 'react-router-dom'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'
import { UserContext } from "../context/userContext";
import { REACT_APP_ASSETS_URL, REACT_APP_BASE_POST_URL } from "../.app_url";
import axios from "axios";

const PostDetail = () => {
  const {id} =useParams()
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {cUser}=useContext(UserContext)

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${REACT_APP_BASE_POST_URL}/${id}`);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      }      
      setIsLoading(false)
    };
    getPost();
  }, []);

  if (isLoading) {
    return <Loader/>
  }

  return (
    <div className="w-[90%] md:w-[70%]  bg-white mx-auto py-6 px-4 sm:px-12 mb-16 rounded-lg">
      {error && <p className="p-4 rounded-lg bg-red-500 text-white">{error}</p> }
      {post && <div>
      <div className="flex sm:flex-row gap-4 sm:gap-0 flex-col justify-between">
        <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
        {cUser?.id==post?.creator && <div className="flex gap-4">
          <Link to={`/posts/${post._id}/edit`} className="rounded-2xl py-3 px-5 bg-blue-700 text-white">
            Edit
          </Link>
          <DeletePost postId={id}/>
        </div>}
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold mt-10 mb-6">{post.title}</h1>
      <div className="">
        <img className="rounded-lg w-full" src={post.thumbnail} alt="" />
        <p className="mt-4 text-justify" dangerouslySetInnerHTML={{ __html:post.description}}>        
        </p>
      </div>
      </div>}
    </div>
  );
};

export default PostDetail;
