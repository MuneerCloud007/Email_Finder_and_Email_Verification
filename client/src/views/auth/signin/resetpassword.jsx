/***
*
*   RESET PASSWORD
*   User can set a new password using the token
*
**********/

import React, { useContext } from 'react';
import { Animate, Row, AuthContext, Card, Form, useNavigate, useLocation } from 'components/lib';
import { useParams } from 'react-router-dom';

export function ResetPassword(props){

  // context
  const navigate = useNavigate();
  const location = useLocation();
  const {id}=useParams();


  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signin.resetpassword.title') }>
        <Card restrictWidth center transparent>
          <Form
            inputs={{
              
              
              password: {
                label: "New password",
                type: 'password',
                required: true,
                complexPassword: true,
              }
            }}
            url={`/api/auth/password/reset/${id}`}
            method='POST'
            redirect="/"
            buttonText={ props.t('auth.signin.resetpassword.form.button') }
           
          />
          </Card>
      </Row>
    </Animate>
  );
}
