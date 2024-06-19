import React, { useContext } from 'react';
import { AuthContext, Animate, Row, Card, Form, useNavigate, useLocation } from 'components/lib';

export function SigninOTP(props){

  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);

  const token = location?.search?.substring(7);
  if (!token) navigate('/signin');

  return (
    <Animate type='pop'>
      <Row title={ props.t('auth.signin.otp.title') } desc={ props.t('auth.signin.otp.description') }>

        <Card restrictWidth center transparent>
          <Form 
            method='post'
            url='/api/auth/otp'
            inputs={{
              code: {
                type: 'text',
                label: props.t('auth.signin.otp.form.code.label'),
                required: true
              },
              jwt: {
                type: 'hidden',
                value: token,
              } 
            }}
            buttonText={ props.t('auth.signin.otp.form.code.label') }
            callback={ context.signin }
          />

          <footer className='mt-4'>
            { props.t('auth.signin.otp.footer.text') }
          </footer>

        </Card>

      </Row>
    </Animate>
  )
}