import React from 'react'
import {Link} from 'react-router-dom'
import PostAuthor from './PostAuthor'
import { REACT_APP_ASSETS_URL } from '../.app_url'

const PostItem = ({post}) => {
  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  const dess=stripHtml(post.description)
  const shortDesc=dess.length > 140 ? dess.substr(0,140) + '...' : dess
  const shortTitle=post.title.length > 40 ? post.title.substr(0,40) + '...' : post.title    

  return (
    <div className='xl:w-[30%] lg:w-[45%] w-full duration-200 hover:drop-shadow-2xl'>
        <div className="p-3 bg-white rounded-t-3xl">
        <Link to={`/posts/${post._id}`}>
        <img className='w-full lg:h-60 object-cover rounded-3xl' src={`${REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" /></Link>
        <div className="mt-4 mb-2">
            <Link className='font-bold' to={`/posts/${post._id}`}>{shortTitle}</Link>
            <p className='mt-4 text-gray-900'>{shortDesc}</p>
        </div>
        </div>
        <div className="flex justify-between items-center bg-gray-100 py-6 px-2 rounded-b-3xl shadow-md">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            <div className="">
            <Link className='bg-blue-100 text-blue-900 p-2 rounded-lg text-sm duration-100 hover:bg-slate-950 hover:text-white' to={`/posts/categories/${post.category}`}>{post.category}</Link>
            </div>
        </div>
    </div>
  )
}

export default PostItem