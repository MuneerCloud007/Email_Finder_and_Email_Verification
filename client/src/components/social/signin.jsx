/***
*
*   SOCIAL SIGN IN BUTTONS
*   To sign up/in with Facebook, Google, Twitter or 500+ networks supported by passport.js
*     
*   PROPS
*   network: array of social network names (array, required)
*   showOr: show an or separator under the buttons (boolean, optional)
* 
**********/

import { useState } from 'react';
import { Button } from 'components/lib';
import { ClassHelper, Grid, useTranslation } from 'components/lib';
import settings from 'settings';
import Style from './social.tailwind.js';

export function SocialSignin(props){

  const { t } = useTranslation();
  const [loading, setLoading] = useState(props.network?.map(x => { return { [x]: false }}));
  const serverURL = settings[process.env.NODE_ENV].server_url;

  // construct query string
  let qs = '';
  if (props.invite) qs = `?invite=${props.invite}`;
  if (props.signup) qs = '?signup=1'


  return (
    <div className={ Style.signinButtons }>
      <Grid cols={ 2 }>
        { props.network?.map(n => {

          const css = ClassHelper(Style, { [n]: true, signinButton: true });
          
          return (
            <Button  
              key={ n }
              loading={ loading[n] }
              icon={['fab', n]}
              iconPack='fontawesome'
              iconSize='1x'
              iconButton
              lowercase
              className={ css }
              action={ () => setLoading({ [n]: true }) }
              url={ `${serverURL}/auth/${n}${qs}` }
              text={ `${t('global.social.use')} ${n.charAt(0).toUpperCase() + n.slice(1)}` }
            />
          )
        })}
      </Grid>

      { props.showOr && 
        <span className={ Style.or }>{ t('global.social.or') }</span> }

    </div>
  );
}
