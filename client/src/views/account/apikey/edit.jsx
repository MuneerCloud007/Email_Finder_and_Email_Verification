/***
*
*   API Key Editor
*   Create or edit a new/existing API key
*
**********/

import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { Animate, AccountNav, Card, Form, Message, Breadcrumbs, 
  TextInput, Loader, useNavigate, useLocation, useAPI } from 'components/lib';

export function APIKeyEditor(props){

  const navigate = useNavigate();
  const location = useLocation();

  // get the scopes
  const scopes = useAPI('/api/key/scopes');

  // state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [newAPIKey, setNewAPIKey] = useState(false);

  const fetch = useCallback(async () => {

    setLoading(true);
    const res = await Axios.get(`/api/key/${location.search?.substring(4)}`);
    res.data.data.length ? setData(res.data.data[0]) : navigate('/404');
    setLoading(false);

  }, [location.search, navigate]);

  useEffect(() => {

    // editing existing key?
    const id = location.search;
    if (id) fetch(id);

  }, [fetch, location.search])

  if (scopes.loading)
    return <Loader />

  return (
    <Animate>
      <AccountNav/>

      <Breadcrumbs items={[
        { name: props.t('account.api_keys.edit.breadcrumbs.keys'), url: '/account/apikeys' },
        { name: `${data ? props.t('account.api_keys.edit.breadcrumbs.edit'): props.t('account.api_keys.edit.breadcrumbs.create') }`, url: '/account/apikeys/create' }
      ]}/>

      { newAPIKey ? 
        <Message 
          type='warning'
          closable
          title={ props.t('account.api_keys.edit.message.title') }
          buttonText={ props.t('account.api_keys.edit.message.button') }
          buttonLink='/account/apikeys'>

            <TextInput value={ newAPIKey } />

        </Message>  : 
 
        <Card title={ `${data ? props.t('account.api_keys.edit.breadcrumbs.edit') : props.t('account.api_keys.edit.breadcrumbs.create')} API Key` } loading={ loading }> 
          <Form 
            inputs={{
              name: {
                label: props.t('account.api_keys.edit.form.name.label'),
                type: 'text',
                required: true,
                value: data.name, 
                errorMessage: props.t('account.api_keys.edit.form.name.error')
              },
              scope: {
                label: props.t('account.api_keys.edit.form.scope.label'),
                type: 'checkbox',
                required: true,
                min: 1,
                default: data.scope,
                options: scopes?.data,
                errorMessage: props.t('account.api_keys.edit.form.scope.error')
              }
            }}
            url={ data ? `/api/key/${data.id}` : '/api/key' }
            method={ data ? 'PATCH' : 'POST' }
            buttonText={ props.t('account.api_keys.edit.form.button') }
            callback={ res => {
              
              !data && setNewAPIKey(res?.data?.data?.full_key) 
            
            }}
          />
        </Card>
        }
    </Animate>
  )
}