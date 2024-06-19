/***
*
*   FORGOT PASSWORD
*   Trigger a password reset process
*
**********/

import React from 'react';
import { Animate, Row, Form, Card } from 'components/lib';

export function ForgotPassword(props){

  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signin.forgotpassword.title') }>
        <Card restrictWidth center transparent>

          <p className='mb-5'>{ "Please enter your username and provide an answer to the security question. Once completed, you will receive instructions on how to reset your password" }</p>

          <Form
            inputs={{
              username: {
                label:"username",
                type: 'email',
                required: true,
                errorMessage:"Please provide the username",

                
              },
              security:{

                label:"Which city you were born in (forget password security question)?",
                type:"text",

              required:true,
              errorMessage:"Please provide the security text",

              }

            }}
            url='/api/auth/password/reset/request'
            method='POST'
            redirect="/account/forgotpassword/status"
            buttonText={ props.t('auth.signin.forgotpassword.form.button') }
          />

        </Card>
      </Row>
    </Animate>
  );
}
