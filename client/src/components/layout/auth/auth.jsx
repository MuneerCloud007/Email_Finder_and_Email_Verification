/***
*
*   AUTH LAYOUT
*   Layout for the signup/signin pages
*
*   PROPS
*   children: will be passed from router > view > here (component(s), required)
*
**********/

import { AuthNav } from 'components/lib';
import Style from './auth.tailwind.js';
import { NavLink } from 'react-router-dom';
import CloudVandana from "../../../../public/assets/icons/CloudVandanaLogo.png"
// import Avatar from "../../../../public/assets/icons/avatar.png"
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export function AuthLayout(props){
 const user= localStorage.getItem("user");
const navigate=useNavigate();
 

  return (
    <main className={ Style.auth }>
      
      <PublicNavBar />
      { props.children }
    </main>
  );
}


function ProtectedNavBar(){

  return(<div className="navbar bg-slate-400">
  <div className="flex-1">
  <NavLink to={"/account/dashboard"}>
  <img
  src={CloudVandana}
  className=' w-20 md:h-16 h-12 '
  />
  </NavLink>
  </div>
  <div className="flex-none gap-2">
    
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component" src={Avatar} />
        </div>
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between">
            Profile
          </a>
        </li>
        <li><a onClick={()=>{
 localStorage.clear();
 return window.location = '/'
        }}>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  )

}


function PublicNavBar(){
  return(<div className="navbar bg-slate-400 p-5">
  <div className="flex-1">
  <NavLink to={"/"}>
  <img
  src={CloudVandana}
  className=' w-20 md:h-16 h-12 '
  />
  </NavLink>
  </div>
 
</div>
  )
}