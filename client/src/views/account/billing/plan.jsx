/***
*
*   BILLING / PLAN
*   Update the billing plan
*
**********/

import { useContext, useState, useEffect } from 'react';
import { AuthContext, Card, Form, Helper, usePlans, useAPI } from 'components/lib';

export function BillingPlan(props){

  // fetch
  const plans = usePlans();

  // context, state
  const context = useContext(AuthContext);
  const [usage, setUsage] = useState('');
  const [tiered, setTiered] = useState(false);

  useEffect(() => {

    if (plans.data?.raw?.plans.length){

     const active = plans.data.raw.plans.find(x => x.id === plans.data.raw.active);
     if (active.type === 'tiered') setTiered(true); 

    }
  }, [plans.data])

  return (
    <Card loading={ plans.loading || props.subscription.loading } restrictWidth className={ props.className }>

      { tiered &&
        <FetchUsage callback={ u => setUsage(u) } /> }

      { usage &&
        <Helper text={ `${ props.t('account.billing.plan.usage_helper') } ${usage}` } icon='pie-chart' /> }
      
      <Form
        inputs={{
          plan: {
            label: props.t('account.billing.plan.form.plan.label'),
            type: 'select',
            required: true,
            default: plans?.data?.active,
            options: plans?.data?.list
          }
        }}
        url='/api/account/plan'
        method='PATCH'
        buttonText={ props.t('account.billing.plan.form.button') }
        callback={ res => {

          context.update({ plan: res.data.data.plan, subscription: 'active' });
          props.onUpdate();

        }}
      />

      { props.subscription?.data?.object && 
        <footer className='mt-4'>
          { `${props.t('account.billing.plan.billing_cycle')} ${props.subscription.data.object.current_period_start} to 
            ${props.subscription.data.object.current_period_end}` }
        </footer> }

  </Card>
  )
} 

function FetchUsage(props){

  const usage = useAPI('/api/account/usage');

  useEffect(() => {

    if (usage.data)
      props.callback(`${usage.data.total} ${usage.data.label} this ${usage.data.period}`)

  }, [props, usage.data])
}