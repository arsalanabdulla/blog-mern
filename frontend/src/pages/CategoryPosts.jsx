import React, { useEffect, useState } from 'react'
import PostItem from '../components/PostItem'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { REACT_APP_BASE_POST_URL } from '../.app_url'
import Loader from '../components/Loader'

const CategoryPosts = () => {
  const {category} = useParams()
  const [posts,setPosts]=useState([])
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${REACT_APP_BASE_POST_URL}/categories/${category}`);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [category]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-10 w-full items-start justify-start py-10 px-10 md:px-36">
        {
            posts.length > 0 ? posts.map((post)=> <PostItem key={post._id} post={post}/>)
            : <h1 className='text-3xl font-semibold p-10 mx-auto'>No Post Found!</h1>
        }
    </div>
  )
}

export default CategoryPosts