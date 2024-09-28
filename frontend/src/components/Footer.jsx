import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  "Technology",
  "Programming",
  "Web Development",
  "Personal Development",
  "Business",
  "Lifestyle",
  "Education",
  "Finance",
  "Entertainment",
  "Science",
  "Gaming",
  "Fashion",
  "Sport",
  "History",
  "Uncategorized"
];
const Footer = () => {
  return (
    <div className="bg-gray-900 text-white">
      <div className='flex flex-wrap items-center justify-center gap-6 py-16 '>
      {categories.map((category, index) => (
        <Link
          key={index}
          className='bg-slate-700 p-4 rounded-xl duration-100 hover:bg-white hover:text-black'
          to={`/posts/categories/${category}`} // Replacing spaces with dashes for URL
        >
          {category}
        </Link>
      ))}
      </div>
    <div className="flex justify-center p-6 border-t-2 border-gray-600">
      All Rights Reserved &copy; Copyright, Arsalan Abdulla
    </div>
    </div>
  )
}

export default Footer