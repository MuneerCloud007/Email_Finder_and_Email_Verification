/***
*
*   PROFILE
*   Update the user profile or close the account
*
**********/

import React, { Fragment, useContext } from 'react';
import { AuthContext, ViewContext, Form, Card,
  AccountNav, Button, useNavigate, Animate, Event, useAPI } from 'components/lib';

export function Profile(props){

  const navigate = useNavigate();
  
  // context
  const authContext = useContext(AuthContext);
  const viewContext = useContext(ViewContext);

  // fetch
  const user = useAPI('/api/user');

  function closeAccount(){
    viewContext.modal.show({

      title: props.t('account.profile.form.close_account.title'),
      form: {},
      buttonText: props.t('account.profile.form.close_account.button'),
      url: authContext.permission.owner ? '/api/account' : '/api/user',
      method: 'DELETE',
      destructive: true,
      text: props.t('account.profile.form.close_account.text'),

    }, () => {

      // destory user
      Event('closed_account');
      localStorage.clear();
      navigate('/signup');

    });
  }

  return (
    <Fragment>
      <AccountNav />
      <Animate>
        <Card
          title={ props.t('account.profile.subtitle') }
          loading={ user.loading } restrictWidth>

          { user?.data &&
            <Form
              buttonText={ props.t('account.profile.form.button') }
              url='/api/user'
              method='PATCH'
              inputs={{
                name: {
                  label: props.t('account.profile.form.name.label'),
                  type: 'text',
                  required: true,
                  value: user.data.name,
                  errorMessage: props.t('account.profile.form.name.error'),
                },
                email: {
                  label: props.t('account.profile.form.email.label'),
                  type: 'email',
                  required: true,
                  value: user.data.email,
                  errorMessage:  props.t('account.profile.form.email.error'),
                },
                avatar: {
                  label: props.t('account.profile.form.avatar.label'),
                  type: 'file', 
                  required: false, 
                  max: 1,
                },
                dark_mode: {
                  label: props.t('account.profile.form.dark_mode.label'),
                  type: 'switch',
                  default: user.data.dark_mode,
                },
                ...user.data.permission === 'owner' && {
                  account_name: {
                    type: 'text',
                    label: props.t('account.profile.form.account_name.label'),
                    value: user.data.account_name
                  }
                },
                ...user.data.accounts?.length > 1 && {
                  default_account: {
                    label: props.t('account.profile.form.default_account.label'),
                    type: 'select',
                    default: user.data.default_account,
                    options: user.data.accounts.map(x => { return {

                      value: x.id, label: x.name

                    }})
                  }
                }
              }}
              callback={ res => {

                const data = res.data.data;

                // update the account name
                if (data.account_name && authContext.user?.accounts?.length > 0){

                  const accounts = [...authContext.user.accounts]
                  accounts[accounts.findIndex(x => x.id === authContext.user.account_id)].name = data.account_name;
                  authContext.update({ accounts: accounts })

                }

                // update the user name
                if (data.name)
                  authContext.update({ name: data.name });

                // update the avatr
                if (data.avatar)
                  authContext.update({ avatar: data.avatar });

                // user changed email and needs to verify
                if (data.hasOwnProperty('verified') && !data.verified){

                  authContext.update({ verified: false });
                  navigate('/signup/verify')

                }

                // toggle dark mode
                if (data.hasOwnProperty('dark_mode')){

                  authContext.update({ dark_mode: data.dark_mode })

                  data.dark_mode ?
                    document.getElementById('app').classList.add('dark') :
                    document.getElementById('app').classList.remove('dark');

                }
              }}
            />
          }

          <Fragment>
            <br/>
            <Button
              textOnly
              action={ closeAccount }
              lowercase
              text={ props.t('account.profile.form.close_account.title') }
            />
          </Fragment>
        </Card>
      </Animate>
    </Fragment>
  );
}
