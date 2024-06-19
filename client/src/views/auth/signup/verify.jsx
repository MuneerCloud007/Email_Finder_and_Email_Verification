/***
*
*   SIGN UP STEP 2
*   Verify email address
*   Step 1: create account
*   Step 2: verify email address
*   Step 3: select plan
*
**********/

import React, { useContext, useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { AuthContext, Animate, Row, Card, Message, Link, useLocation, useNavigate } from 'components/lib';

export function SignupVerification(props){

  const location = useLocation();
  const navigate = useNavigate();
  const qs = location.search;
  const authContext = useRef(useContext(AuthContext));
  
  const [message, setMessage] = useState({ 

    type: 'info',
    title: props.t('auth.signup.verify.message.info.title'),
    text: props.t('auth.signup.verify.message.info.text'),
    button: {
      text: props.t('auth.signup.verify.message.info.button'),
      action: resendVerificationEmail
    }

  });

  useEffect(() => {
    const verifyToken = async (token) => {
      
      try {

        setMessage({

          type: 'info',
          title: props.t('auth.signup.verify.message.verifying.title'),
          text: props.t('auth.signup.verify.message.verifying.text'),
          button: false,

        })

        const res = await Axios.post('/api/user/verify', { token: token });        
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
        authContext.current.update({ verified: true, token: res.data.token });
        
        const view = authContext.current.user.permission === 'user' ? '/welcome' :
          (authContext.current.user.plan ? '/dashboard' : '/signup/plan');

        return navigate(view);
      
      }
      catch (err){
  
        // // token isnt for this account, force signout
        if (err.response?.status === 401)
          return authContext.current.signout();

        setMessage({
      
          type: 'error',
          title: props.t('auth.signup.verify.message.error.title'),
          text: props.t('auth.signup.verify.message.error.text'),
          button: {
            text: props.t('auth.signup.verify.message.error.button'),
            action: resendVerificationEmail
          }
        });
      }
    }

    if (qs.includes('?token=')){
      
      // check token exists
      verifyToken(qs.substring(qs.indexOf('?token=')+7));

    }
  }, [qs, authContext, navigate]);

  async function resendVerificationEmail(){

    setMessage({

      type: 'info',
      title: props.t('auth.signup.verify.message.info.title'),
      text: props.t('auth.signup.verify.message.info.text'),

    })

    await Axios({ method: 'post', url: '/api/user/verify/request' });

  }

  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signup.verify.title') }>
        <Card loading={ false } restrictWidth center transparent>

          <Message 
            type={ message.type }
            title={ message.title }
            text={ message.text }
            buttonText={ message.button?.text }
            buttonAction={ message.button?.action }
          />

          <footer className='mt-4'>
            <Link url='/account/profile' text={ props.t('auth.signup.verify.footer.link_text') } />
          </footer>

        </Card>
      </Row>
    </Animate>
  );
}
