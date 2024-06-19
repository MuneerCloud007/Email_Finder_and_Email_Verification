import React, { Fragment, useState, useEffect } from 'react';
import { Animate, AccountNav, Card, Form, Message, useAPI } from 'components/lib';

export function TwoFA(props){

  // get the user state 
  const user = useAPI('/api/user');
  const [qrCode, setQrCode] = useState(undefined);
  const [enabled, setEnabled] = useState(undefined);
  const [backupCode, setBackupCode] = useState(undefined);

  useEffect(() => {

    setEnabled(user.data?.['2fa_enabled']);

  }, [user.data])

  return (
    <Fragment>
      
      <AccountNav/>
      <Animate>
      <Card title={ props.t('account.2fa.subtitle') } restrictWidth className={ props.className } loading={ user.loading }>
      
      <Form 
        url='/api/user/2fa'
        method='put'
        submitOnChange
        inputs={{
          '2fa_enabled': {
            type: 'switch',
            label: props.t('account.2fa.form.2fa_enabled.label'),
            default: user?.data?.['2fa_enabled']
          }
        }}
        callback={ res => {
          
          setQrCode(res.data.data.qr_code);

          if (!res.data.data['2fa_enabled'])
            setEnabled(false);
        
        }}
      />

      { qrCode ? 
        <Fragment>
        <Message 
          type='info'
          title={ props.t('account.2fa.message.scan_qr_code.title') }
          text={ props.t('account.2fa.message.scan_qr_code.text') }
         />

          <img src={ qrCode } alt='' style={{ marginBottom: '1em', marginLeft: '-0.75em' }}/>

            <Form 
              method='post'
              url='/api/user/2fa/verify'
              buttonText={ props.t('account.2fa.form.button') }
              inputs={{
                code: {
                  label: props.t('account.2fa.form.code.label'),
                  type: 'text',
                }
              }}
              callback={ res => { 
                
                setQrCode(null);
                setEnabled(true);
                setBackupCode(res.data.data.backup_code)}

              }
            />
        </Fragment>: 
        <Fragment>
    
          { enabled ?
          <Fragment>
            { backupCode ?
             <Message 
              type='success'
               title={ props.t('account.2fa.message.backup_code.title') }
               text={ props.t('account.2fa.message.backup_code.text') }
               >
               <Form 
                inputs={{ 
                 code: {
                   type: 'text',
                   value: backupCode
                 }
               }}/>
            </Message> : 
            <Message 
              type='success'
              title={ props.t('account.2fa.message.2fa_enabled.title') }
              text={ props.t('account.2fa.message.2fa_enabled.text') }
             /> }
          </Fragment> :
          <Message
            type='warning'
            title={ props.t('account.2fa.message.enable_2fa.title') }
            text={ props.t('account.2fa.message.enable_2fa.text') }
          />
          }
        </Fragment>
      }
    </Card>
    </Animate>
    </Fragment>
  )
}