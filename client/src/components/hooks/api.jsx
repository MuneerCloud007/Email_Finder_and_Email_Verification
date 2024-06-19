/***
*
*   useAPI hook
*   Interact with API calls – handle errors, return loading state and data
*
*   PROPS
*   method: get, post, put (string, required, default: get)
*   url: endpoint url (string, required)
*
**********/

import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import Axios from 'axios';
import { ViewContext } from 'components/lib';

export function useAPI(url, method,data){

  // wrap in useRef to prevent triggering useEffect multiple times  
  const context = useRef(useContext(ViewContext));
  const [state, setState] = useState({ data: null, loading: false })
  


  const fetch = useCallback(async () => {
    try {
    

      if (!url || !method){

        setState({ data: null, loading: false });
        return false;

      }

      setState({ loading: true });
      let res;
if(data) {

  res = await Axios({

    url: url,
    method: method || 'get',
    data:data
 
    
  })
}
else{

     res = await Axios({

        url: url,
        method: method || 'get',
     
        
      })
    }
      if(res.data?.data){
        setState({ data: res.data.data, loading: false });
      } 
      else{
        setState({ data: res.data, loading: false });

      }


    }
    catch (err){

      context?.current &&
      context.current.handleError(err);

    }
  }, [url, method, context]);

  useEffect(() => {

    fetch()

  }, [fetch]);

  return state

}
