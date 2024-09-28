import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isBar, setIsBar] = useState(true);
  const { cUser } = useContext(UserContext);
  return (
    <div className="z-10 bg-white/30 fixed top-0 left-0 w-full border-b-4 border-b-gray-100 backdrop-blur-md">
      <div className="flex items-center justify-between container w-[80%] mx-auto py-2">
        <Link onClick={() => setIsBar(true)} to="/">
          <img className="w-16 object-cover" src={logo} alt="" />
        </Link>
        {
          cUser?.id ? <div className="gap-8 hidden md:flex">
          <Link to={`/profile/${cUser.id}`}>{cUser.name}</Link>
          <Link to="/create">Create Post</Link>
          <Link to="/authors">Authors</Link>
          <Link to="/logout">Logout</Link>
        </div> : <div className="gap-8 hidden md:flex">          
          <Link to="/authors">Authors</Link>
          <Link to="/login">Login</Link>
        </div>
        }
        <button onClick={() => setIsBar((e) => !e)} className={`md:hidden`}>
          {isBar ? <FaBars /> : <AiOutlineClose />}
        </button>
      </div>
      {
        cUser?.id ? <div
        className={`${
          isBar ? "hidden" : "flex"
        } flex-col gap-4 items-center bg-white py-4 font-semibold md:hidden`}
      >
        <Link onClick={() => setIsBar((e) => !e)} to="/profile/2">
          {cUser.name}
        </Link>
        <div className="w-full h-[2px] bg-gray-50"></div>
        <Link onClick={() => setIsBar((e) => !e)} to="/create">
          Create Post
        </Link>
        <div className="w-full h-[2px] bg-gray-50"></div>
        <Link onClick={() => setIsBar((e) => !e)} to="/authors">
          Authors
        </Link>
        <div className="w-full h-[2px] bg-gray-50"></div>
        <Link onClick={() => setIsBar((e) => !e)} to="/logout">
          Logout
        </Link>
      </div> : <div
        className={`${
          isBar ? "hidden" : "flex"
        } flex-col gap-4 items-center bg-white py-4 font-semibold md:hidden`}
      >        
        <Link onClick={() => setIsBar((e) => !e)} to="/authors">
          Authors
        </Link>
        <div className="w-full h-[2px] bg-gray-50"></div>
        <Link onClick={() => setIsBar((e) => !e)} to="/login">
          Login
        </Link>
      </div>
      }
    </div>
  );
};

export default Header;
