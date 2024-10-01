import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { REACT_APP_ASSETS_URL, REACT_APP_BASE_POST_URL, REACT_APP_BASE_USER_URL } from '../.app_url';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Authors = () => {
  const [author,setAuthor]=useState([])
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(REACT_APP_BASE_USER_URL);
        setAuthor(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchAuthors();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (    
    <div className="flex flex-wrap gap-10 items-start justify-center pt-10 pb-20 px-10 lg:px-36">
      {
            author.length > 0 ? author.map((author)=> {
              return (
                <Link to={`/posts/users/${author._id}`}>
                <div key={author._id} className="flex bg-white rounded-xl p-4 w-full md:w-auto">                  
                  <img className='rounded-full w-24 h-24 object-cover mr-3 shadow-md' src={author.avatar} alt="author avatar" />
                  <div className="flex flex-col gap-3">
                    <h1>{author.name}</h1>
                    <p>{author.posts}</p>
                  </div>
                </div>
                </Link>
              )
            })
            : <h1 className='text-3xl font-semibold p-10'>No authors Found!</h1>
        }
    </div>
  )
}

export default Authors