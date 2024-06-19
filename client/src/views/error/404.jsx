import React from 'react';
import { Row, Content, Message } from 'components/lib';

export function NotFound(props){

  return(
    <Row>
      <Content>
        <Message
          type='error'
          title={ props.t('error.404.title') }
          text={ props.t('error.404.text') }
          buttonText={ props.t('error.404.button') }
          buttonLink='/'
        />
      </Content>
    </Row>
  );
}
