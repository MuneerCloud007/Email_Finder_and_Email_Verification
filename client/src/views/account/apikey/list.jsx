/***
*
*   API Keys List
*   List & manage the API keys
*
**********/

import React, { Fragment, useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { ViewContext, Animate, AccountNav, Button, Card, Table, TitleRow,
  BlankSlateMessage, Loader, useNavigate, useAPI } from 'components/lib';

export function APIKeyList(props){

  const navigate = useNavigate();
  const context = useContext(ViewContext);
  const fetch = useAPI('/api/key');
  const [keys, setKeys] = useState([]);

  useEffect(() => {

    if (fetch?.data?.length)
      setKeys(fetch.data);
 
  }, [fetch]);

  function revoke(data){
    context.modal.show({
      title: props.t('account.api_keys.list.revoke.title'),
      form: {
        active: {
          type: 'hidden',
          value: false,
        }
      },
      text: props.t('account.api_keys.list.revoke.text'),
      buttonText: props.t('account.api_keys.list.revoke.button'),
      url: `/api/key/${data.id}`,
      destructive: true,
      method: 'PATCH',

      }, () => {

        const state = [...keys];
        state.find(x => x.id === data.id).active = false;
        setKeys(state);

    });
  }

  function deleteKey(data, callback){

    const multi = Array.isArray(data);
    const id = multi ? data.map(x => { return x.id }) : data.id;

    context.modal.show({
      title: multi ? props.t('account.api_keys.list.delete.title.plural') : props.t('account.api_keys.list.delete.title.single'),
      text: multi ? props.t('account.api_keys.list.delete.text.plural') : props.t('account.api_keys.list.delete.text.single'),
      buttonText: props.t('account.api_keys.list.delete.button'),
      form: { 
        id: {
          type: 'hidden',
          value: id,
        }
      },
      url: '/api/key',
      destructive: true,
      method: 'DELETE',

      }, () => {

        callback();

    });
  }

  async function reveal(data){

    // reveal the api key
    const key = (await Axios.get(`/api/key/${data.id}`))?.data?.data?.[0].key;
    const state = [...keys];
    state[state.findIndex(x => x.id === data.id)].key = key;
    setKeys(state);

  }
    
  return (
    <Fragment>

      <AccountNav/>

      { fetch.loading ? 
        <Loader /> :
        <Fragment>

          { keys?.length ?
            <Animate>

            <TitleRow title={ props.t('account.api_keys.subtitle') }>
              <Button small text={ props.t('account.api_keys.list.blank_slate.button') } goto='/account/apikeys/create' />
            </TitleRow>

            <Card>
              <Table 
                selectable
                search
                data={ keys }
                loading={ fetch.loading }
                translation='account.api_keys.list'
                show={['name', 'key', 'active']}
                actions={{ 
                  custom: [
                    { icon: 'eye', action: reveal },
                    { icon: 'rotate-ccw', action: revoke, condition: { col: 'active', value: true }}],
                  edit: (data) => { navigate(`/account/apikeys/edit?id=${data.id}`) },
                  delete: deleteKey,
                }}
                bulkActions={{

                  delete: deleteKey,

                }}
                badge={{ col: 'active', color: 'green', condition: [

                  { value: true, color: 'green' },
                  { value: false, color: 'red' }
                
                ]}}
              />
            </Card> 
          </Animate> :

          <BlankSlateMessage 
            title={ props.t('account.api_keys.list.blank_slate.title') }
            text={ props.t('account.api_keys.list.blank_slate.text') }
            buttonText={ props.t('account.api_keys.list.blank_slate.button') }
            action={ () => navigate('/account/apikeys/create') }
            marginTop='4em'
          />
          
          }
        </Fragment>
      }
    </Fragment>
  );
}
