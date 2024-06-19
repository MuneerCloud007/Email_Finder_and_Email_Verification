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
import Style from '../auth/auth.tailwind';
import { NavLink } from 'react-router-dom';
import CloudVandana from "../../../../public/assets/icons/CloudVandanaLogo.png"
import { useContext, useEffect,useState } from 'react';
import avatar from "../../../../public/assets/icons/avatar.png"


import { useNavigate } from 'react-router-dom';
import React from "react";
import { Row } from 'components/lib';
import { HoverNav,Button } from 'components/lib';
import {useDispatch} from "react-redux";
import "./app.module.scss";
import "./app.css";
import {AuthProvider} from "../../../app/auth"
import {sendMessageTOLogoutExtension} from "../../../../utils"



export function AppLayout(props){


const navigate=useNavigate();
const [updateLogout,setUpdateLogout]=useState(false);
const dispatch=useDispatch();

// useEffect(()=>{
//   if(updateLogout) {
//   if(localStorage.getItem("table_user")){


//     console.log("I am in logout localstorage.");
//   const dummyArr = {
//     ...JSON.parse(localStorage.getItem("percievedOrder")), AccountId__c: `${JSON.parse(localStorage.getItem("user"))["accountId"]}`,
//   }
//   console.log(dummyArr);
  
//   dispatch(updatePercievedOrderSlice({
//     url: `/salesforce/api/v1/orderPerceived/${localStorage.getItem("table_user")}/update`,
//     data: dummyArr,
//     method: 'patch'
//   }))
  
  
  

//   setTimeout(()=>{
//   localStorage.clear();
//   // localStorage.removeItem("percievedOrder");
//   // localStorage.removeItem("table_user")
//   window.location = '/';
//   },[1000])
//   setUpdateLogout(false);
  
  
  
  
  
  
  
//   }
// }
  
// },[updateLogout])


 

  return (
    <main className={ Style.auth } >
      <ProtectedNavBar setUpdateLogout={setUpdateLogout}/>
      


      { props.children }
    </main>
  );
}


function ProtectedNavBar({setUpdateLogout}){
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
  sendMessageTOLogoutExtension();
    localStorage.clear();
    window.location = '/';
    return true;
  };

  return(<div className="  flex p-4 mb-4 app items-center main-nav-bar"  style={{background:"#F8FAFC",paddingInline:"1.5rem"}}>
  <div className="">
  <NavLink  className={"navbar "}> 
  <img
  src={CloudVandana}
  className=' w-20 md:h-16 h-12 '

  />
  </NavLink>
  </div>
  < div className=' mx-auto  text-center  nav_text' style={{fontSize:"larger",fontWeight:700}}>
  Chrome extension data
    </div>
  <HoverNav  align='left' icon={avatar} >
    <button onClick={()=>{
      handleLogout();
      
     
    }}>Log out</button>
        <button>{""}</button>

</HoverNav>
  {/* <div className="flex-none gap-2 bg-white">
      <div className="relative">
        <button
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
          onClick={toggleDropdown}
        >
          <div className="w-10 h-10 rounded-full">
            <img alt="Avatar" src={avatar} className="rounded-full w-full h-full object-cover" />
          </div>
        </button>
        {isOpen && (
         <ul className="absolute right-0 mt-3 z-10  shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 bg-white px-8 py-4">
         <li className=" hover:bg-slate-700 border-b-2 hover: bg-slate-900">
           <a href="#" className="justify-between block py-2 px-2 p-4">Profile</a>
         </li>
         <li className=" hover:bg-slate-700">
           <button onClick={handleLogout} className="w-full text-left">Logout</button>
         </li>
       </ul>
       
        )}
      </div>
    </div> */}
  
  </div>

  )

}






function PublicNavBar(){
  return(<div className="navbar bg-slate-400">
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