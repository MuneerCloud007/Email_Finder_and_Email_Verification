import { createRoot } from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import Store from 'Store';
import { PaginationProvider } from "./contextApi/PaginationContext";
import axios from 'axios';
import "./index.css";

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const container = document.getElementById('root');
const root = createRoot(container);
axios.interceptors.response.use(
  function (response) {
    // Handle successful response
    if (response.status >= 200 && response.status <= 300) {
      return response

    }
  },
  function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error);
      if (error.response.status == 401) {

         localStorage.clear();
         location.href = "/";
      }


    } else if (error.request) {
      // The request was made but no response was received
      console.log('Request made but no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.log('Error setting up the request:', error.message);
    }

    return Promise.reject(error);
   
  }

);

root.render(
  <Provider store={Store}>
    <PaginationProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </PaginationProvider>
  </Provider>
);

const welcome = () => console.log('Welcome to Gravity 🚀')
welcome('de529c70-eb80-4dfb-9540-5075db7545bf')
