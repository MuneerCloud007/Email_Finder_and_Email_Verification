/***
*
*   SIGN UP (user)
*   Signup form for child users
*
**********/

import React, { useContext } from 'react';
import { Animate, Row, AuthContext, Card, Form, Link, SocialSignin } from 'components/lib';

export function SignupUser(props){

  const context = useContext(AuthContext);
  const url = window.location.href;
  const id = url.substring(url.indexOf('?id=')+4, url.indexOf('&email'));
  const email = url.substring(url.indexOf('&email')+7);

  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signup.user.title') }>
        <Card restrictWidth center transparent>

          <SocialSignin network={['facebook', 'twitter']} showOr invite={ id } />

          <Form
            inputs={{
              name: {
                label: props.t('auth.signup.user.form.name.label'),
                value: '',
                type: 'text',
                required: true,
                errorMessage: props.t('auth.signup.user.form.name.error'),
              },
              email: {
                label: props.t('auth.signup.user.form.email.label'),
                value: email,
                type: 'email',
                required: true,
              },
              password: {
                label: props.t('auth.signup.user.form.password.label'),
                type: 'password',
                required: true,
                complexPassword: true,
              },
              confirm_password: {
                type: 'hidden',
                value: null,
              },
              invite_id: {
                type: 'hidden',
                value: id
              },
            }}
            url='/api/user/register'
            method='POST'
            redirect='/dashboard'
            buttonText={ props.t('auth.signup.user.form.button') }
            callback={ context.signin }
          />

          <footer className='mt-4'>
            { props.t('auth.signup.user.footer.text') }<Link url='/signin' text={ props.t('auth.signup.user.footer.link_text') }/>
          </footer>

        </Card>
      </Row>
    </Animate>
  );
}
