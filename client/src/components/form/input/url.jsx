/***
*
*   URL INPUT
*   Url type input
*   Props are passed from the form
*
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   disabled: disable the input (boolean, optional)
*   errorMessage: custom error message (string, optional)
*   id: id of the input (string, optional)
*   label: input label (string, optional)
*   name: input name (string, required)
*   onChange: callback function that executes on change (function, required)
*   placeholder: placeholder value (string, optional)
*   required: this input is required (boolean, optional)
*   valid: determines if the input is valid (boolean, required)
*   value: initial value (string, optional)
*   warning: warning highlight (boolean, optional)
*   
**********/

import { useState } from 'react';
import { Label, Error, Icon, ClassHelper, useTranslation } from 'components/lib';
import Style from './input.tailwind.js';

export function URLInput(props){

  const { t } = useTranslation();
  const [error, setError] = useState(

    props.errorMessage || t('global.form.url.error')

  );

  function validate(e){

    let value = e ? e.target.value : '';
    let valid = undefined;

    // input is required and value is blank
    if (props.required && value === '')
      valid = false;

    // input isn't required and value is blank
    if (!props.required && value === '')
      valid = true;

    // test for a valid url
    const rex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9-]+(\.[a-z-]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

    if (rex.test(value)){

      valid = true;

    }
    else {

      valid = false;
      setError(t('global.form.url.error'));

    }

    // update the parent form
    props.onChange(props.name, value, valid);

  }

  // style
  const urlStyle = ClassHelper(Style, {

    textbox: true, 
    className: props.className, 
    error: props.valid === false, 
    success: props.valid === true,
    warning: props.warning
    
  });

  return(
    <div className={ Style.input }>

      { props.label && 
        <Label
          text={ props.label }
          required={ props.required }
          for={ props.name }
        /> }

      <input
        type='url'
        id={ props.id }
        name={ props.name }
        className={ urlStyle }
        value={ props.value || '' }
        disabled={ props.disabled }
        placeholder={ props.placeholder }
        onChange={ e => props.onChange(props.name, e.target.value, undefined) }
        onBlur={ e => validate(e) }
      />

      { props.valid === false &&
        <Error message={ error }/> }

      { props.valid === true &&
        <Icon
          image='check'
          color='#8CC57D'
          className={ Style.successIcon }
          size={ 16 }
        />}

    </div>
  );
}
