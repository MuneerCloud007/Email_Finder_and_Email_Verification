/***
*
*   DATE INPUT
*   Date picker input
*   Props are passed from the form
*
*   PROPS
*   errorMessage: custom error message (string, optional)
*   label: input label (string, optional)
*   max: maximum date accepted (date, optional)
*   min: minimum date accepted (date, optional)
*   name: input name (string, required)
*   onChange: callback function that executes on change (function, required)
*   placeholder: placeholder value (string, optional)
*   required: determine if this input is required (boolean, optional)
*   valid: determines if the input is valid (boolean, required)
*   value: initial value (string, optional)
*   
**********/

import { Label, Error, Icon, ClassHelper, useTranslation } from 'components/lib';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import InputStyle from '../input.module.scss';
import Style from './date.module.scss';

export function DateInput(props){

  const { t } = useTranslation();

  // init default value
  let date = props.value;

  if (date && date.indexOf('-') && date.length >= 10){

    date = date.split('-');

    date = {

      year: parseInt(date[0]),
      month: parseInt(date[1]),
      day: parseInt(date[2])

    }
  }
  else {

    const now = new Date();
    date = {

      year: now.getFullYear(),
      month: now.getMonth()+1,
      day: now.getDate()

    }
  }

  function formatDateString(d){

    return `${d.year}-${ d.month < 10 ? '0' + d.month : d.month }-${ d.day < 10 ? '0' + d.day : d.day }`

  }

  function change(date){

    let valid;

    if (props.required)
      valid = date.year && date.day && date.month ? true : false;

    props.onChange(props.name, formatDateString(date), valid);

  }

  const dateStyle = ClassHelper(InputStyle, {

    textbox: true, 
    error: props.valid === false,
    success: props.valid === true,

  });

  function customInput({ ref }){

    return (
      <input 
        ref={ ref } 
        value={ props.value?.split('T')[0] }
        placeholder={ props.placeholder || t('global.form.date.error') }
        className={ dateStyle }
      />
    );
  }
  
  return (
    <div className={ InputStyle.input }>

      { props.label && 
        <Label 
          text={ props.label } 
          required={ props.required }
          for={ props.name }
        /> }

        <DatePicker
          value={ date }
          onChange={ change }
          minimumDate={ props.min }
          maximumDate={ props.max }
          colorPrimary='#73B0F4'
          wrapperClassName={ Style.date }
          renderInput={ customInput }
          calendarPopperPosition='bottom'
        >
        </DatePicker>

        { props.valid === false &&
          <Error message={ props.errorMessage || t('global.form.date.error') }/> }

        { props.valid === true &&
          <Icon
            image='check'
            color='#8CC57D'
            className={ InputStyle.successIcon }
            size={ 16 }
          /> }

    </div>
  )
}