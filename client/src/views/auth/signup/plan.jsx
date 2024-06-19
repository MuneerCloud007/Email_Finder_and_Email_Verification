/***
*
*   SIGN UP STEP 2
*   Signup form for account owners
*   Step 1: create account
*   Step 2: verify email address
*   Step 3: select plan
*
**********/

import React, { useContext } from 'react';
import { Animate, AuthContext, Row, Card, PaymentForm, usePlans, Link, Event, useNavigate } from 'components/lib';

export function SignupPlan(props){

  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const plans = usePlans();
  const plan = window.location.hash.substring(1);

  if (!plans.data)
    return false;

  return(
    <Animate type='pop'>
      <Row title={ props.t('auth.signup.plan.title') }>
        <Card loading={ false } restrictWidth center transparent>

          <PaymentForm
            inputs={{
              plan: {
                label: props.t('auth.signup.plan.form.plan.label'),
                type: 'select',
                options: plans.data.list,
                default: plan,
                required: true,
              },
              token: {
                label: props.t('auth.signup.plan.form.token.label'),
                type: 'creditcard',
                required: true,
              }
            }}
            url='/api/account/plan'
            method='POST'
            buttonText={ props.t('auth.signup.plan.form.button') }
            callback={ res => {

              // save the plan to context, then redirect
              Event('selected_plan', { plan: res.data.plan });
              context.update({ plan: res.data.plan, subscription: res.data.subscription });
              navigate(res.data.onboarded ? '/dashboard' : '/welcome');

            }}
          />

          <footer className='mt-4'>
            <Link url='/account/profile' text={ props.t('auth.signup.plan.footer.link_text') } />
          </footer>
          
        </Card>
      </Row>
    </Animate>
  );
}
