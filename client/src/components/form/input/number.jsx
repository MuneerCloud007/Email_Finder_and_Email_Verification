/***
*
*   NUMBER INPUT
*   Number type input
*   Props are passed from the form
*
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   disabled: disable the input (boolean, optional)
*   errorMessage: custom error message (string, optional)
*   label: input label (string, optional)
*   max: maximum number required (integer, optional)
*   min: minimum number required (integer, optional)
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

export function NumberInput(props){

  const { t } = useTranslation();
  const [error, setError] = useState(props.errorMessage || t('global.form.number.error.unentered'));

  function validate(e){

    const min = props.min;
    const max = props.max;
    let value = e ? e.target.value : '';
    let valid = undefined;

    // input is required and value is blank
    if (props.required && value === '')
      valid = false;

    // input isn't required and value is blank
    if (!props.required && value)
      valid = true;

    // now test for a valid number
    if (isNaN(value)){

      valid = false;
      setError(t('global.form.number.error.invalid'));

    }

    // check for min max
    if (value && min && max){
      if (value >= min && value <= max){
        valid = true;
      }
      else {
        valid = false;
        setError(t('global.form.number.error.min_max', { min: min, max: max }));
      }
    }
    else if (min){
      if (value >= min){
        valid = true;
      }
      else {
        valid = false;
        setError(`${t('global.form.number.error.min')} ${min}`);
      }
    }
    else if (max){
      if (value <= max){
        valid = true;
      }
      else {
        valid = false;
        setError(`${t('global.form.number.error.max')} ${max}`);
      }
    }
    else {

      valid = true;

    }

    // update the parent form
    props.onChange?.(props.name, value, valid);

  }

  // style
  const numberStyle = ClassHelper(Style, {

    textbox: true, 
    className: props.className, 
    error: props.valid === false,
    success: props.valid === true,
    warning: props.warning,

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
        type='number'
        id={ props.name }
        name={ props.name }
        className={ numberStyle }
        value={ props.value || '' }
        min={ props.min }
        max={ props.max }
        disabled={ props.disabled }
        placeholder={ props.placeholder }
        onChange={ e => props.onChange?.(props.name, e.target.value, undefined) }
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
