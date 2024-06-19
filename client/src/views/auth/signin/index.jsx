/***
*
*   SIGN IN
*   Sign in form for all account types (including master).
*
**********/

import React, { useContext, useState, useEffect } from 'react';
import {
  Animate, AuthContext, ViewContext, Button, Form, Card, Link, Row, Message,
  SocialSignin, useLocation, useNavigate
} from 'components/lib';



export function Signin(props) {

  // context
  const authContext = useContext(AuthContext);
  const viewContext = useContext(ViewContext);

  const location = useLocation();
  const navigate = useNavigate();

  // state
  const [form, setForm] = useState({

    username: {
      label: 'username',
      name: 'username',
      errorMessage: "Enter a valid username",
      required: true,
    },
    password: {
      label: 'password',
      name: 'password',
      type: 'password',
      errorMessage: "Enter a valid password",

      required: true,
    },
    forgotpassword: {
      type: 'link',
      url: '/forgotpassword',
      text: props.t('auth.signin.index.form.forgotpassword.text'),
    }
  });

  console.log("I am in login page!!!!");

  



  return (
    <Animate type='pop'>
      <Row title={"Chrome extension Login Auth"}>
        <Row >
          <h1 className=' text-center font-semibold text-xl'>Sign in</h1>


          <Card restrictWidth center transparent>

            <Form
              inputs={form}
              method='POST'
              url={"/api/v1/user/login"}
              buttonText={"Log in"}
              callback={res => {
                console.log("I am inside");
                authContext.signin(res)

              }}
            />

            <footer className='mt-4'>
              {props.t('auth.signin.index.footer.text')}<Link url='/signup' text={props.t('auth.signin.index.footer.link_text')} />
            </footer>

          </Card>

        </Row>
      </Row>

    </Animate>
  );
}
