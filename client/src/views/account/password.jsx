/***
*
*   PASSWORD
*   Update the users password
*
*   if the user has a password show old and new inputs
*   if no existing password (eg. in case of social signin)
*   then allow the user to set a password on their account
*
**********/

import React, { Fragment, useContext, useState } from 'react';
import { AuthContext, AccountNav, Animate, Card, Form, Message } from 'components/lib';

export function Password(props){

  const context = useContext(AuthContext);
  const [done, setDone] = useState(false);
  
  return (
    <Fragment>

      <AccountNav />
      <Animate>
      <Card title={ props.t('account.password.subtitle') } restrictWidth className={ props.className }>

    { !done ?  
      <Form
        url='/api/user/password'
        method='PUT'
        buttonText={ props.t('account.password.form.button') }
        inputs={{
          ...context.user.has_password && { 
            oldpassword: {
              label: props.t('account.password.form.old_password.label'),
              type: 'password',
              required: true
            },
            has_password: {
              type: 'hidden',
              value: true,
            }
          },
          newpassword: {
            label: props.t('account.password.form.new_password.label'),
            type: 'password',
            required: true,
            complexPassword: true
          },
        }}
        callback={ () => {
          
          setDone(true);
          context.update({ has_password: true });

        }}
      /> : 
      <Message 
        type='success'
        title={ props.t('account.password.success_message.title') }
        text={ props.t('account.password.success_message.text') }
      />
    }
    </Card>
    </Animate>
    
    </Fragment>
  );
}
