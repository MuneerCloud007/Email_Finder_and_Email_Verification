/***
*
*   AUTHENTICATION
*   Auth provider to manage auth functions throughout
*   the application. <PrivateRoute> component to
*   protect internal application routes from unauthenticated
*   access.
*
**********/

import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useAPI, Event } from 'components/lib';
import { Navigate } from 'react-router-dom';
import {sendMessageToExtension,sendMessageTOLogoutExtension} from "../../utils.js"
export const AuthContext = createContext();
import permissions from './permissions';

export function AuthProvider(props) {

  const cache = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(cache);
  const auth = (localStorage.getItem(user)) ? useAPI("/api/auth", post) : "";


  useEffect(() => {

    // update the auth status
    if (!auth.loading && auth.data) {

      auth.data.authenticated ?
        update(auth.data) : signout();

    }
  }, [auth]);

  function signin(res) {

    console.log(res);

    if (res.data.token) {
      console.log(res);
      sendMessageToExtension(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;

    }
    
   




   

    if (!res.data.token)
      return window.location = '/';


    return window.location = res.data.token ? '/linkedScrap/dashboard' : '/';


  }

  async function signout() {
    console.log("I am in signout")
    //signout is wrote in layer of component =>app pls check there

    sendMessageTOLogoutExtension();

    localStorage.clear();

  }

  async function switchAccount(id) {

    const res = await axios({

      method: 'post',
      url: '/api/auth/switch',
      data: { account: id }

    });

    if (res.data)
      signin(res)

  }

  function update(data) {

    if (localStorage.getItem('user')) {

      let user = JSON.parse(localStorage.getItem('user'));
      for (let key in data) {

        if (Array.isArray(data[key])) {

          user[key] = data[key]

        }
        else if (typeof data[key] === 'object') {
          for (let innerKey in data[key]) {

            user[key][innerKey] = data[key][innerKey]

          }
        }
        else {

          user[key] = data[key];

        }
      }

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

    }
  }

  return (
    <AuthContext.Provider value={{

      user: user,
      signin: signin,
      signout: signout,
      update: update,
      switchAccount: switchAccount,
      permission: permissions[user?.permission]

    }}

      {...props} />
  );
}

// custom route object checks for an auth token before
// rendering the route – redirects if token is not present
export function PrivateRoute(props) {

  // check user exists
  const user = JSON.parse(localStorage.getItem('user'));
  const path = window.location.pathname;
  const permittedRoutes = ["/SalesforceLogin", "/vms/dashboard", "/linkedScrap/dashboard"]
  console.log(user);
  console.log(path);

  if (user?.token) {

    if (user.verified) {
      console.log("user is verified");



      if (path === '/account/dashboard') {
        console.log("dashboard");
        return <Navigate to='/account/dashboard' />
      }



    }
    else {

      if (path == "/SalesforceLogin") {
        return <Navigate to='/SalesforceLogin' />;

      }

      // // user is not verified
      // if (path !== '/account/profile' && path !== '/signup/verify')
      //   return <Navigate to='/signup/verify' />;

    }

    // user is good
    return props.children;


  }

  // user is not authenticated
  return <Navigate to='/' />;

}



// Function to add a token
function addToken(db, token) {
  var transaction = db.transaction(['tokens'], 'readwrite');
  var objectStore = transaction.objectStore('tokens');

  var data = { id: 'authToken', token: token };

  var request = objectStore.put(data); // Use put instead of add to allow updates

  request.onsuccess = function (event) {
    console.log('Token added to the object store');
  };

  request.onerror = function (event) {
    console.error('Error adding token:', event.target.errorCode);
  };
}

// Function to retrieve a token
function getToken(db) {
  var transaction = db.transaction(['tokens'], 'readonly');
  var objectStore = transaction.objectStore('tokens');

  var request = objectStore.get('authToken');

  request.onsuccess = function (event) {
    if (request.result) {
      console.log('Token retrieved:', request.result.token);
    } else {
      console.log('No token found');
    }
  };

  request.onerror = function (event) {
    console.error('Error retrieving token:', event.target.errorCode);
  };
}
