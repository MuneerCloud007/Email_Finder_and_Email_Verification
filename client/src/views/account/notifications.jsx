/***
*
*   NOTIFICATIONS
*   User can choose which notifications they receive
*
**********/

import { Fragment, useEffect, useState } from 'react';
import { AccountNav, Animate, Card, Form, useAPI } from 'components/lib';

export function Notifications(props){
  
  const [inputs, setInputs] = useState(null);
  const res = useAPI('/api/notification');
  
  useEffect(() => {

    // dynamically render the available
    // inputs for this user's permission
    if (res.data?.length){
      
      const s = {};
      res.data.forEach(input => {

        s[input.name] = {
          type: 'switch',
          default: input.active,
          label: props.t(`account.notifications.form.options.${input.name}`),
        }

      })

      setInputs(s);

    }
  }, [res.data]);
  

  return (
    <Fragment>

      <AccountNav />
      <Animate>

        <Card title={ props.t('account.notifications.subtitle') } loading={ res.loading } restrictWidth className={ props.className }>

          { inputs &&
            <Form 
              method='patch'
              url='/api/notification'
              inputs={ inputs }
              buttonText={ props.t('account.notifications.form.button') }
            />
          }

        </Card>

      </Animate>
    </Fragment>
  );
}
