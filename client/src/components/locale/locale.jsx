import { useContext } from 'react';
import axios from 'axios';
import { ViewContext, AuthContext, ClassHelper } from 'components/lib';
import { GB, ES } from 'country-flag-icons/react/3x2'
import i18n from 'i18next';
import Style from './locale.tailwind.js';

const flags = { en: GB, es: ES }

export function LocalePicker(props){

  const viewContext = useContext(ViewContext);
  const authContext = useContext(AuthContext);

  const css = ClassHelper(Style, {

    picker: true,
    className: props.className

  });

  function show(){
    viewContext.modal.show({

      title: viewContext.t('global.locale.title'),
      method: 'PATCH',
      url: '/api/user',
      form: {
        locale: {
          label: viewContext.t('global.locale.form.language.label'),
          type: 'select',
          default: i18n.resolvedLanguage,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español - Spanish' }
          ]
        }
      },
      buttonText: 'Save',
    }, (form) => {

      axios.defaults.headers.common['Accept-Language'] = form.locale.value;
      i18n.changeLanguage(form.locale.value);
      authContext.update({ locale: form.locale.value })

    })
  }

  const Flag = flags[i18n.resolvedLanguage];
  
  return (
    <div className={ css } onClick={ show }>
      <Flag/>
    </div>
  )
}