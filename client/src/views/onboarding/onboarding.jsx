/***
*
*   ONBOARDING
*   Example of onboarding flow*
*
**********/

import React, { Fragment, useContext } from 'react';
import { AuthContext, Onboarding, Form, Message } from 'components/lib';

export function OnboardingView(props){

  const context = useContext(AuthContext);

  const views = [{

    name: props.t('onboarding.welcome.title'),
    description: `${props.t('onboarding.welcome.description')}, ${context.user.name}!`,
    component: <Welcome t={ props.t }/>,

  }]

  if (context.permission.admin){
    views.push({

      name: props.t('onboarding.invite_team.title'),
      description: props.t('onboarding.invite_team.description'),
      component: <InviteUsers t={ props.t }/>,
      
    });
  }

  if (context.user.duplicate_user){
    views.unshift({

      name: props.t('onboarding.duplicate_user.title'),
      description: '',
      component: <DuplicateUser t={ props.t }/>,

    })
  }

  return <Onboarding save onFinish='/dashboard' views={ views }/>

}

function DuplicateUser(props){

  return (
    <Message
      type='warning'
      title={ props.t('onboarding.duplicate_user.message.title') }
      text={ props.t('onboarding.duplicate_user.message.text') }
    />    
  )
}

function Welcome(props){

  return (
    <Fragment>

      <p>{ props.t('onboarding.welcome.text.0') }</p>
      <p><strong>{ props.t('onboarding.welcome.text.1') }</strong></p>

    </Fragment>
  )
}

function InviteUsers(props){

  return (
    <Form 
      inputs={{
        email: {
          label: props.t('onboarding.invite_team.form.email.label'),
          type: 'email',
          required: true,
        }
      }}
      buttonText={ props.t('onboarding.invite_team.form.button') }
      url='/api/invite'
      method='POST'
    />
  )
}