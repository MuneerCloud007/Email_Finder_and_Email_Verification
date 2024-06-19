/***
*
*   BILLING
*   Change subscription, update card details or view past invoices
*
**********/

import React, { Fragment, useContext, useState, useEffect } from 'react';
import { AuthContext, AccountNav, TabView, Message, Animate, useAPI } from 'components/lib';

import { BillingPlan } from './plan';
import { BillingCard } from './card';
import { BillingInvoices } from './invoices';

export function Billing(props){
  
  // state/context
  const context = useContext(AuthContext);
  const [showMessage, setShowMessage] = useState(false);

  // fetch subscription
  const subscription = useAPI('/api/account/subscription');
  const isPaid = context.user.plan === 'free' ? false : true;
  const labels = [props.t('account.billing.tabs.plan')]; 
  if (isPaid) labels.push(props.t('account.billing.tabs.card'), props.t('account.billing.tabs.invoices'));

  useEffect(() => {

    // subscription did load - show message?
    if (subscription.data && subscription.data.status !== 'active' && subscription.data.status !== 'trialing')
      setShowMessage(true);

  }, [subscription.data])


  return (
    <Fragment>

      <AccountNav/>
      <Animate>

        { showMessage &&
          <Message 
            type={ subscription.data.status === 'requires_action' ? 'warning' : 'error' }
            title={ props.t(`account.billing.message.${subscription.data.status}.title`) }
            text={ props.t(`account.billing.message.${subscription.data.status}.text`) }
          /> }

        <TabView name='Billing' labels={ labels }>

          <BillingPlan 
            {...props }
            subscription={ subscription } 
            onUpdate={ () => setShowMessage(false) }/>

          { isPaid && 
          <BillingCard {...props }/> }

          { isPaid && 
          <BillingInvoices {...props }/> }

        </TabView>
      </Animate>
    </Fragment>
  );
}
