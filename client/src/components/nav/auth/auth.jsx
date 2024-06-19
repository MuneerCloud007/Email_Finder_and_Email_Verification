/***
*
*   HOME NAV
*   Navigation used on the main external website. Renders a dashboard link
*   if the user is signed in, or a sign up link if they are not
*
**********/

import React, { Fragment, useContext, useState } from 'react';
import { AuthContext, Logo, Link, Row, Glass, Button, useTranslation } from 'components/lib';
import Style from './auth.tailwind.js';

export function AuthNav(props){

  // state, context
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return(
    <Row color='dark' className={ Style.wrapper }>

        <Logo className={ Style.logo }/>

        { !mobileNavOpen &&
          <Button 
            icon='menu'
            iconColor='light'
            iconSize={ 24 }
            title='Open Nav' 
            position='absolute'
            className={ Style.toggleButtonOpen } 
            action={ () => setMobileNavOpen(true) }
          /> }

        <nav className={ Style.nav }>

          <div className={ Style.desktop }>
            <Links />
          </div>

          { mobileNavOpen &&
            <div className={ Style.mobile }>
              <Glass>

                <Links/>

                <Button 
                  icon='x'
                  iconColor='dark'
                  size={ 24 }
                  title='Open Nav' 
                  position='absolute'
                  className={ Style.toggleButtonClosed } 
                  action={ () => setMobileNavOpen(false) }
                />

              </Glass>
            </div> } 
        </nav>
    </Row>
  );
}

function Links(props){

  const { t } = useTranslation();
  const context = useContext(AuthContext);
  
  return (
    <div className={ Style.links }>
    
      { context.user?.token ?
        <Button small goto='/dashboard' text={ t('auth.nav.dashboard') } className={ Style.button } /> :
        
        <Fragment>
          <Link url='/signin' text={ t('auth.nav.signin') } className={ Style.link } color='white'/>
          <Button small goto='/signup' text={ t('auth.nav.signup') } className={ Style.button } />
        </Fragment>
      }
      
    </div>
  )
}

