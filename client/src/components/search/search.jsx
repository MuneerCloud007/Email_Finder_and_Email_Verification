/***
*
*   SEARCH
*   Search input field
*
*   PROPS
*   callback: function executed on change and submit (function, required)
*   placeholder: placeholder text (string, optional, default: Search)
*   throttle: throttle the callback execution in ms (integer, required)
*
**********/

import { useState, useEffect, useRef } from 'react';
import { Button, ClassHelper, useTranslation } from 'components/lib';

import Style from './search.tailwind.js';
import InputStyle from '../form/input/input.tailwind.js';
import {usePagination} from "../../contextApi/PaginationContext.jsx";

export function Search(props){

  const { t } = useTranslation();

  const [value, setValue] = useState(props.value || '');
  const [typing, setTyping] = useState(false);
  const {clear,setClear}=usePagination();
  const inputRef=useRef();

  useEffect(() => {

    // throttle typing
    if (props.throttle && !typing){
      const onKeyPress = () => {

        setTyping(true);
        setTimeout(() => { setTyping(false) }, props.throttle);

      }


      window.addEventListener('keydown', onKeyPress);
      return () => window.removeEventListener('keydown', onKeyPress);
      
    }
  }, [props.throttle, typing]);

  useEffect(() => {

    // callback when typing throttle done
    if (props.throttle && !typing)
      props.callback(value);

  }, [props, typing, value]);

  useEffect(()=>{
    setValue("");  
    props.callback("");
      

    
  },[clear])

  const searchStyle = ClassHelper(Style, {

    base: true,
    className: props.className

  })

  return (
    <form className={ searchStyle }>

      <input
      ref={inputRef}
        type='text'
        className={ InputStyle.textbox }
        placeholder={ props.placeholder || t('global.search') }
        style={{paddingBlock:"0.5rem",paddingInline:"1rem"}}
        value={ value }
        onChange={ e => {

          setValue(e.target.value);
          !props.throttle && props.callback(e.target.value);

        }}
      />

      <Button 
        icon='search'
        className={ Style.button }
        iconSize={ 20 }
        position='absolute'
        action={ () => props.callback(value) }
        />

    </form>
  );
}