import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { REACT_APP_ASSETS_URL, REACT_APP_BASE_USER_URL } from '../.app_url';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const PostAuthor = ({authorID,createdAt}) => {
  const [author, setAuthor] = useState([]);
  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_USER_URL}/${authorID}`);
        setAuthor(response.data);
      } catch (error) {
        console.log(error);
      }      
    };
    getAuthor();
  }, []);
  return (
    <Link to={`/posts/users/${author._id}`}>
    <div className="flex">
        <img className='w-10 object-cover rounded-lg mr-2' src={`${REACT_APP_ASSETS_URL}/uploads/${author.avatar}`} alt="" />
        <div className="flex flex-col gap-2">
            <h2 className='font-semibold text-sm'>By: {author.name}</h2>
            <p className='text-sm'><ReactTimeAgo date={new Date(createdAt)} locale='en-US'/></p>
        </div>
    </div>
    </Link>
  )
}

export default PostAuthor