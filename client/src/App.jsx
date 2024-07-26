import React, { useMemo, useEffect } from 'react'
import Header from './pages/Header'
import Footer from './pages/Footer'
import { Outlet } from "react-router-dom"
import "./App.css"
import "./index.css"
import io, { Socket } from 'socket.io-client';
import { useDispatch } from "react-redux"
import { addEmailVerifier,updateCredits } from "./features/slice/emailVerifier";
import socketContextApi from "./contextApi/SocketContextApi";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function App() {



  return (
    <socketContextApi.Provider >
      <div className="app ">
        <Header />
        <Outlet />
      </div>
      <Footer/>
    </socketContextApi.Provider>

  )
}

export default App