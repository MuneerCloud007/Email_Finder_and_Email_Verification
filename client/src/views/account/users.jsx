/***
*
*   USERS
*   Enables an admin to manage the users in their application
*
**********/

import React, { Fragment, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ViewContext, Card, AccountNav, Event, Table, Button, Animate, 
  TitleRow, usePermissions, useAPI } from 'components/lib';

export function Users(props){

  const context = useContext(ViewContext);
  const permissions = usePermissions();
  const data = useAPI('/api/account/users');
  const [users, setUsers] = useState([]);

  function invite(){

    context.modal.show({
      title: props.t('account.users.invite.title'),
      text: props.t('account.users.invite.text'),
      form: {
        email: {
          label: props.t('account.users.invite.form.email.label'),
          type: 'text',
          required: true,
        },
        permission: {
          label: props.t('account.users.invite.form.permission.label'),
          type: 'select',
          default: 'user',
          options: permissions?.data?.list?.filter(x => x.value !== 'owner') 
        },
      },
      buttonText: props.t('account.users.invite.form.button'),
      url: '/api/invite',
      method: 'POST',

      }, (form, res) => {

        // add the invited user to the
        if (res.length){

          const state = [...users];

          res.forEach(invite => {
            if (!state.find(x => x.id === invite.id)){
              state.push({

                id: invite.id,
                avatar: invite.avatar,
                name: '',
                email: invite.email,
                date_created: invite.date_sent,
                permission: invite.permission || 'user',
                status: props.t('account.users.status.invited'),
                actions: {

                  invite: resendInvite,
                  delete: deleteInvite

                },
              });
            }
          });

          Event('invited_user');
          setUsers(state);

        }
    });
  }

  function editUser(data, callback){

    context.modal.show({
      title: props.t('account.users.edit.title'),
      form: {
        id: {
          type: 'hidden',
          value: data.id
        },
        name: {
          label: props.t('account.users.edit.form.name.label'),
          type: 'text',
          required: true,
          value: data.name,
          errorMessage: 'Please enter a name'
        },
        email: {
          label: props.t('account.users.edit.form.email.label'),
          type: 'email',
          value: data.email,
          required: true,
        },
        permission: {
          label: props.t('account.users.edit.form.permission.label'),
          type: data.permission === 'owner' ? null : 'select',
          options: permissions?.data?.list?.filter(x => x.value !== 'owner') ,
          default: data.permission
        }
      },
      buttonText: props.t('account.users.edit.form.button'),
      url: '/api/user',
      method: 'PATCH'

    }, (res) => {

      callback(res);

    });
  }

  function deleteUser(data, callback){

    context.modal.show({
      title: props.t('account.users.delete.title'),
      form: {},
      buttonText: props.t('account.users.delete.form.button'),
      text: `${props.t('account.users.delete.text')} ${data.name}?`,
      url: `/api/user/${data.id}`,
      method: 'DELETE',
      destructive: true

    }, () => {

      callback();

    });
  }

  function deleteInvite(data, callback){
    
    context.modal.show({
      title: props.t('account.users.delete_invite.title'),
      form: {},
      buttonText: props.t('account.users.delete_invite.form.button'),
      text: `${props.t('account.users.delete_invite.text')} ${data.email}?`,
      url: `/api/invite/${data.id}`,
      method: 'DELETE',
      destructive: true

    }, () => {

      // remove from state
      const s = [...users];
      s.splice(s.findIndex(u => u.id === data.id), 1)
      setUsers(s);

      // remove from table
      callback();

    });
  }

  async function resendInvite(data){
    try {

      context.notification.show(`${props.t('account.users.invite.resent_notification')} ${data.email}`, 'success', true);

      await axios({ 
        
        url: '/api/invite',
        method: 'post',
        data: { email: data.email }
      
      });
    }
    catch(err){

      context.handleError(err);

    }
  }
  
  useEffect(() => {

    // format the user list
    let list = [];

    if (data?.data?.users?.length){
      list = data.data.users.map(x => {
        return {

          id: x.id,
          avatar: x.avatar,
          name: x.name,
          email: x.email,
          date_created: x.date_created,
          permission: x.permission,
          status: x.verified ? props.t('account.users.status.verified') : props.t('account.users.status.registered')

        }
      })
    }

    if (data?.data?.invites?.length){
      data.data.invites.forEach(x => {
        list.push({

          id: x.id,
          avatar: x.avatar,
          name: '',
          email: x.email,
          date_created: x.date_sent,
          permission: x.permission || 'user',
          status: props.t('account.users.status.invited'),

        });
      });
    }

    setUsers(list);

  }, [data]);

  // attach the per row actions for invites
  if (users.length){
    users.forEach(u => {
      if (u.status === props.t('account.users.status.invited')){
        u.actions = {

          invite: resendInvite,
          delete: deleteInvite

        }
      }
    })
  }

  return (
    <Fragment>

      <AccountNav />
      <Animate>

        <TitleRow title={ props.t('account.users.subtitle') }>
          <Button small text={ props.t('account.users.new.button') } action={ invite }/>
        </TitleRow>

        <Card>
          <Table
            bulkActions={{ delete: 1 }}
            search
            className='restrict-width'
            data={ users }
            loading={ data.loading }
            translation='account.users'
            show={['avatar', 'email', 'name', 'date_created', 'last_login', 'permission', 'status']}
            badge={{ col: 'status', color: 'blue', condition: [

              { value: props.t('account.users.status.verified'), color: 'green' },
              { value: props.t('account.users.status.registered'), color: 'blue' },
              { value: props.t('account.users.status.invited'), color: 'orange' }

            ]}}
            actions={{ 
              
              edit: editUser, 
              delete: deleteUser, 
              email: true, 
              
            }}
          />
        </Card>

      </Animate>
    </Fragment>
  );
}
