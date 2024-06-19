/***
*
*   SIGN UP STEP 1
*   Signup form for account owners
*   Step 1: create account
*   Step 2: verify email address
*   Step 3: select plan
*
**********/

import React, { useContext } from 'react';
import { AuthContext, Animate, Row, Card, SocialSignin, Form, Link } from 'components/lib';

export function Signup(props){

  const context = useContext(AuthContext);
  
  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signup.account.title') }>
        <Card loading={ false } restrictWidth center transparent>

          <SocialSignin network={['facebook', 'twitter']} showOr signup />

          <Form
            inputs={{
              name: {
                label: "username",
                type: 'text',
                required: true,
                errorMessage: props.t('auth.signup.account.form.name.error')
              },
              email: {
                label: "email",
                type: 'email',
                required: true,
              },
              password: {
                label: "password",
                type: 'password',
                required: true,
                complexPassword: true
              },
              confirm_password: {
                type: 'hidden',
                value: null,
              },
            }}
            url='/api/v1/user/register'
            method='POST'
            buttonText={ props.t('auth.signup.account.form.button') }
            callback={ context.signin }/>

            <footer className='mt-4'>
              { props.t('auth.signup.account.footer.text') }
              <Link url='/signin' text={ props.t('auth.signup.account.footer.link_text')  } />
            </footer>

        </Card>
      </Row>
    </Animate>
  );
}
