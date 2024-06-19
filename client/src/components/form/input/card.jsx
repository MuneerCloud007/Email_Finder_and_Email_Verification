/***
*
*   CARD INPUT
*   Stripe card input
*   Props are passed from the form
*
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   errorMessage: custom error message (string, optional)
*   label: input label (string, optional)
*   name: input name (string, required)
*   required: this input is required (boolean, optional)
*   valid: determines if the input is valid (boolean, required)
*   warning: warning highlight (boolean, optional)
*   
**********/

import { useContext } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { AuthContext, Label, Error, ClassHelper, useTranslation } from 'components/lib';
import Style from './input.tailwind.js';

export function CardInput(props){

  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const error = props.errorMessage || t('global.form.card.error');
  const darkMode = authContext.user.dark_mode;

  const cardStyle = ClassHelper(Style, {

    textbox: true, 
    cardbox: true,
    className: props.className, 
    error: props.valid === false,

  });

  return(
    <div className={ Style.input }>

      <Label
        text={ props.label }
        required={ props.required }
        for={ props.name }
      />

      <CardElement
        className={ cardStyle }
        options={{
          style: {
            base: {
              fontFamily: '"Source Sans Pro", sans-serif',
              color: darkMode ? 'white' : '#334155',
              "::placeholder": {
                color: darkMode ? '#94a3b8' : '#64748b',
              },
            },
          },
        }}
      />

      { props.valid === false && <Error message={ error }/> }

    </div>
  );
}
