/***
*
*   UPGRADE
*   Upgrade from a free to paid plan
*
**********/

import React, { useContext } from 'react';
import { AuthContext, Card, PaymentForm, useNavigate, useLocation, Animate, Event, usePlans } from 'components/lib';

export function Upgrade(props){

  const navigate = useNavigate();
  const location = useLocation();

  // context/data
  const context = useContext(AuthContext);
  const plans = usePlans();
  const list = plans?.data?.list; let plan;

  // selected plan
  if (list){

    const qs = location.search;
    plan = qs.substring(qs.indexOf('?plan=')+6);

    // remove free & set selected
    const index = list?.findIndex(x => x.value === 'free');
    if (index > -1) list.splice(index, 1);
    plan = plan ? plan : list[0].value;

  }

  return(
    <Animate>
      <Card restrictWidth
        title={ props.t('account.upgrade.subtitle') }
        loading={ plans.loading }
        className='upgrade-form'>
          <PaymentForm
            inputs={{
              plan: {
                label: props.t('account.upgrade.form.plan.label'),
                type: 'select',
                default: plan,
                options: list,
              },
              token: {
                label: props.t('account.upgrade.form.token.label'),
                type: 'creditcard',
                required: true,
              }
            }}
            url='/api/account/upgrade'
            method='POST'
            buttonText={ props.t('account.upgrade.form.button') }
            callback={ res => {

              // update the auth context so user can use features on the new plan
              Event('upgraded', { plan: res.data.data.plan });
              context.update({ plan: res.data.data.plan, subscription: 'active' });
              setTimeout(() => navigate('/dashboard'), 2500);

            }}
          />
      </Card>
    </Animate>
  );
}
