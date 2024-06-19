/***
*
*   ACCOUNT
*   Index page for account functions
*
**********/

import React, { useContext } from 'react';
import { AuthContext, Animate, Grid, Card, Icon, Link, Loader, useAPI } from 'components/lib';

export function Account(props){

  const context = useContext(AuthContext);

  const user = useAPI('/api/user');
  const iconSize = 20;

  if (user.loading)
    return <Loader />

  return (
    <Animate>
      <Grid cols='4'>

        <Card>

          <Icon image='user' size={ iconSize }/>
          <h2>{ props.t('account.profile.title') }</h2>
          <div>{ props.t('account.profile.description') }</div>
          <Link url='/account/profile'>
            { props.t('account.profile.button') }
          </Link>

        </Card>

        <Card>

          <Icon image='lock' size={ iconSize }/>
          <h2>{ props.t('account.password.title') }</h2>
          <div>{ user?.data?.['has_password'] ? props.t('account.password.description.change') : props.t('account.password.description.create') }</div>
          <Link url='/account/password'>
            { user?.data?.['has_password'] ? props.t('account.password.button.change') : props.t('account.password.button.create') }
          </Link>

        </Card>

        <Card>

          <Icon image='shield' size={ iconSize }/>
          <h2>{ props.t('account.2fa.title') }</h2>
          <div>{ props.t('account.2fa.description') }</div>
          <Link url='/account/2fa'>
            { user?.data?.['2fa_enabled'] ? props.t('account.2fa.button.manage') : props.t('account.2fa.button.enable') }
          </Link>

        </Card>

        { context.permission?.owner &&
          <Card>

            <Icon image='credit-card' size={ iconSize }/>
            <h2>{ props.t('account.billing.title') }</h2>
            <div>{ props.t('account.billing.description') }</div>
            <Link url='/account/billing'>
              { props.t('account.billing.button') }
            </Link>

          </Card>
        }

        <Card>

          <Icon image='bell' size={ iconSize }/>
          <h2>{ props.t('account.notifications.title') }</h2>
          <div>{ props.t('account.notifications.description') }</div>
          <Link url='/account/notifications'>
            { props.t('account.notifications.button') }
          </Link>

        </Card>

        { context.permission?.developer &&
          <Card>

            <Icon image='settings' size={ iconSize }/>
            <h2>{ props.t('account.api_keys.title') }</h2>
            <div>{ props.t('account.api_keys.description') }</div>
            <Link url='/account/apikeys'>
              { props.t('account.api_keys.button') }
            </Link>

          </Card>
        }

        { context.permission?.admin &&
          <Card>

            <Icon image='users' size={ iconSize }/>
            <h2>{ props.t('account.users.title') }</h2>
            <div>{ props.t('account.users.description') }</div>
            <Link url='/account/users'>
              { props.t('account.users.button') }
             </Link>

          </Card>
        }

      </Grid>
    </Animate>
  )
}