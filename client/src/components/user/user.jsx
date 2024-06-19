/***
*
*   USER
*   Shows the current user name and avatar
*   If user belongs to more than one account, they can switch accounts here
*
**********/

import { useContext } from 'react';
import { AuthContext, ViewContext, HoverNav, Button, Image, LocalePicker } from 'components/lib';
import Style from './user.tailwind.js';

export function User(props){

  const authContext = useContext(AuthContext);
  const viewContext = useContext(ViewContext);
  const accountName = authContext.user?.accounts?.find(x => x.id === authContext.user?.account_id)?.name;
  
  return (
    <div className={ Style.user }>

      <LocalePicker className={ Style.language } />

      <div className={ Style.label }>

        <div className={ Style.name }> { viewContext.t('global.welcome') }, { authContext.user?.name }</div>

        { authContext.user?.accounts?.length > 1 &&
          <HoverNav 
            dark
            icon='chevron-down'
            align='right'
            label={ accountName } 
            className={ Style.hoverNav }>
             { authContext.user.accounts.map(account => {
                
                return (
                  <Button 
                    key={ account.id }
                    text={ account.name } 
                    action={() => {
                      
                      viewContext.setLoading(true);
                      authContext.switchAccount(account.id);
                    
                    }}
                  />
                );
              }
            )}
          </HoverNav>
        } 
      
      </div>
        
      { authContext.user?.avatar && 
       <Image source={ authContext.user?.avatar } className={ Style.avatar }/> }

   </div>
  )
}