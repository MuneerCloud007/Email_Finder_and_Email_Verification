/***
*
*   ACCOUNT NAV
*   Acount sub nav that renders different options based
*   on user permissions. Shows billing & user admin to only account owners
*
**********/

import { SubNav, useTranslation } from 'components/lib';

export function AccountNav(props){

  const { t } = useTranslation();

  return(
    <SubNav items={[

      { link: '/account/profile', label: t('account.nav.profile') },
      { link: '/account/password', label: t('account.nav.password') },
      { link: '/account/2fa', label : t('account.nav.2fa') },
      { link: '/account/billing', label: t('account.nav.billing'), permission: 'owner' },
      { link: '/account/notifications', label: t('account.nav.notifications'), permission: 'user' },
      { link: '/account/apikeys/', label: t('account.nav.api_keys'), permission: 'developer' },
      { link: '/account/users', label: t('account.nav.users'), permission: 'admin' }

    ]}/>
  );
}