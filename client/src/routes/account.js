import { Account } from 'views/account';
import { Profile } from 'views/account/profile';
import { Billing } from 'views/account/billing';
import { Upgrade } from 'views/account/upgrade';
import { Users } from 'views/account/users';
import { Password } from 'views/account/password';
import { TwoFA } from 'views/account/2fa';
import { Notifications } from 'views/account/notifications';
import { APIKeyList } from 'views/account/apikey/list';
import { APIKeyEditor } from 'views/account/apikey/edit';

const Routes = [
  {
    path: '/account',
    view: Account,
    layout: 'app',
    permission: 'user',
    title: 'account.index.title'
  },
  {
    path: '/account/profile',
    view: Profile,
    layout: 'app',
    permission: 'user',
    title: 'account.profile.title'
  },
  {
    path: '/account/password',
    view: Password,
    layout: 'app',
    permission: 'user',
    title: 'account.password.title'
  },
  {
    path: '/account/2fa',
    view: TwoFA,
    layout: 'app',
    permission: 'user',
    title: 'account.2fa.title'
  },
  {
    path: '/account/billing',
    view: Billing,
    layout: 'app',
    permission: 'owner',
    title: 'account.billing.title'
  },
  {
    path: '/account/upgrade',
    view: Upgrade,
    layout: 'app',
    permission: 'owner',
    title: 'account.upgrade.title'
  },
  {
    path: '/account/users',
    view: Users,
    layout: 'app',
    permission: 'admin',
    title: 'account.users.title'
  },
  {
    path: '/account/notifications',
    view: Notifications,
    layout: 'app',
    permission: 'user', 
    title: 'account.notifications.title'
  },
  {
    path: '/account/apikeys',
    view: APIKeyList,
    layout: 'app',
    permission: 'developer', 
    title: 'account.api_keys.title'
  },
  {
    path: '/account/apikeys/create',
    view: APIKeyEditor,
    layout: 'app',
    permission: 'developer', 
    title: 'account.api_keys.title'
  },
  {
    path: '/account/apikeys/edit',
    view: APIKeyEditor,
    layout: 'app',
    permission: 'developer',
    title: 'account.api_keys.title'
  },
]

export default Routes;