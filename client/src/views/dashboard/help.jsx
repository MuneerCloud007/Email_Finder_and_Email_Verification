/***
*
*   HELP
*   Information for user to get help and support
*
**********/

import React, { Fragment } from 'react';
import { Card, Form, Message, Loader, useAPI } from 'components/lib';

export function Help(props){

  const user = useAPI('/api/user');

  return (
    <Fragment>

      <Message 
        type='info'
        title={ props.t('help.message.title') }
        text={ props.t('help.message.text') }
      />

      { user.loading ? 
        <Loader /> :
        <Card title={ props.t('help.subtitle') } restrictWidth>      
          <Form 
            inputs={{
              support_enabled: {
                type: 'radio',
                options: props.t('help.form.support_enabled.options', { returnObjects: true }),
                required: true,
                errorMessage: props.t('help.form.support_enabled.error'),
                default: user.data?.support_enabled ? props.t('help.form.support_enabled.options.0')  : props.t('help.form.support_enabled.options.1'),
                label: props.t('help.form.support_enabled.label')
              }
            }}
            submitOnChange
            method='PATCH'
            url='/api/user'
          />
          <Form 
            inputs={{
              email: {
                type: 'hidden',
                value: user?.data?.email,
              },
              name: {
                type: 'hidden',
                value: user?.data?.name
              },
              template: { 
                type: 'hidden', 
                value: 'help',
              },
              message: {
                type: 'textarea',
                label: props.t('help.form.message.label'),
                errorMessage: props.t('help.form.message.error'),
                required: true,
              }
            }}
            method='POST'
            url='/api/utility/mail'
            buttonText={ props.t('help.form.button') }
          />
      </Card>
     }
    </Fragment>
  )
}