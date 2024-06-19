import React, { useState } from 'react'
import Axios from "axios";
import { useEffect } from 'react';
import { Loader, useNavigate } from 'components/lib';
import axios from 'axios';

function SalesforceLogin() {
    const [AuthToken,setAuthToken]=useState(false);
    const navigate=useNavigate();

const fetchAuth=async ()=>{
    try{    
        const url_code = new URLSearchParams(window.location.search).get('code');
            if(url_code){
            console.log(url_code);
            
            const data=await Axios({

                url: '/api/auth/oauth/login',
                method: 'post',
                data: {
                    code:url_code,
                    redirect_uri:"https://vms-setup.vercel.app/salesforceLogin/"
                }

            })
            console.log("Inside salesforce login");
            console.log(data);

            if(data.status==200) {
                setAuthToken(data);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.data.access_token;
                // axios.defaults.headers.common['Instance_url']=`${data.data.data.instance_url}`

                 localStorage.setItem("user",JSON.stringify({verified:true,token:`${data.data.data.access_token}`}))
                 localStorage.setItem("instance_url",data.data.data.instance_url)
                 navigate("/setupAudit")

            }
        
        
        
        
        
         
        
        
        
        
        
        
        }
    }
    catch(err){
        localStorage.clear()
        location.href="/";
        console.log(err);
    }
}

    useEffect( () => {
        if(!AuthToken) {
            fetchAuth();

        }

        
    
      
    }, [AuthToken])


  return (
    <Loader/>
  )
}

export default SalesforceLogin