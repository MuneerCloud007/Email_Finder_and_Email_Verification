/***
*
*   FIELDSET
*   Group of radio and checkbox inputs
*   Props are passed from the form
*   
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   default: default selected option (string, optional)
*   errorMessage: custom error message (string, optional)
*   label: input label passed to legend (string, required)
*   max: maximum selection required (integer, optional)
*   min: minimum selection required (integer, optional)
*   name: name of this input (string, required)
*   options: list of options (array, required)
*   required: determine if this input is required (boolean, optional)
*   type: radio or checkbox (string, required)
*   valid: determines if the selection is valid (boolean, required)
*
**********/

import { useState } from 'react';
import { Grid, Radio, Checkbox, Error, Legend, ClassHelper, useTranslation } from 'components/lib';
import Style from './fieldset.tailwind.js';

export function Fieldset(props){

  const { t } = useTranslation();

  // init
  const Input = props.type === 'radio' ? Radio : Checkbox;
  let init = new Array(props.options.length).fill(false);

  // default
  if (props.type === 'radio'){

    const defaultIndex = props.options.indexOf(props.default ? props.default : 0);
    init[defaultIndex] = true;

  }
  else if (props.type === 'checkbox'){
    if (Array.isArray(props.default)){
      props.default.forEach(opt => {

        init[props.options.indexOf(opt)] = true;
        
      });
    }
  }

  // state
  const [checked, setChecked] = useState([...init]);
  const [error, setError] = useState(props.errorMessage ? 
    props.errorMessage : t('global.form.fieldset.error.unselected'));

  if (!props.options?.length)
    return false;

  function change(index, state, option){

    // update state
    let data = [...checked];

    // reset radios on select
    if (props.type === 'radio')
      data = new Array(props.options.length).fill(false)

    // toggle the checked state
    data[index] = !checked[index];

    // update & validate
    setChecked(data);
    validate(data, option);

  }

  function validate(data, option){

    let options = [];
    let errorMessage;
    let valid = undefined;
    let count = data.filter(Boolean).length;

    // validate radio
    if (props.type === 'radio'){

      valid = props.required ? (count >= 1 ? true : false) : true;
      props.onChange(props.name, option, valid);
      return false;

    }

    // validate checkbox
    if (props.type === 'checkbox'){
      if (props.min && !props.max){

        // check for min value
        if (count >= props.min){
          valid = true;
        }
        else {

          valid = false;
          setError(`${t('global.form.fieldset.error.min')} ${props.min}`);

        }
      }
      else if (!props.min && props.max){

        // check for max value
        if (count <= props.max){
          valid = true;
        }
        else {

          valid = false;
          setError(`${t('global.form.fieldset.error.max')} ${props.max}`);

        }
      }
      else if (props.min && props.max){

        // check for min and max value
        if (count >= props.min && count <= props.max){
          valid = true;
        }
        else {

          valid = false;
          setError(t('global.form.fieldset.error.min_max', { min: props.min, max: props.max }));

        }
      }
      else if (props.required){

        valid = count ? true : false;

      }
    }

    data.forEach((opt, index) => {
      if (opt) options.push(props.options[index])
    });

    // update the parent form state
    props.onChange(props.name, options, valid);

  }

  // style
  const fieldsetStyle = ClassHelper(Style, {
    
    error: props.valid === false,
    className: props.className,

  });

  return(
    <fieldset className={ fieldsetStyle }>

      <Legend 
        valid={ props.valid === false ? false : true }
        text={ props.label } 
        required={ props.required }
      />

      <Grid cols='3'>
        { props.options.map((option, index) => {
          return (
            <Input
              key={ index }
              name={ props.name }
              index={ index }
              option={ option }
              checked={ checked[index] }
              callback={ change }
            />
          );
        })}
      </Grid>

      { props.valid === false && 
        <Error message={ error } className={ Style.errorMessage }/> }

    </fieldset>
  );
}