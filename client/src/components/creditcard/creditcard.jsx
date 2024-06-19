/***
*
*   CREDIT CARD
*   Credit card component used in the billing UI
*
*   PROPS
*   brand: card provider name (string, required)
*   expires: expiry date (string, required)
*   last_four: last 4 digits of card number (string, required)
*
**********/

import Style from './creditcard.tailwind.js';
import { useTranslation } from 'components/lib';

export function CreditCard(props){

  const { t } = useTranslation();

  return (
    <div className={ Style.creditCard }>
      
      <div className={ Style.brand }>
        { props.brand }
      </div>

      <div className={ Style.number }>
        •••• •••• •••• { props.last_four }
      </div>

      <div className={ Style.col }>
        <div className={ Style.title }>
          { t('account.billing.card.expires') }
        </div>
        <div className={ Style.value }>
          { props.expires }
        </div>
      </div>

      <div className={ Style.col }>
        <div className={ Style.title }>
          CVV
        </div>
        <div className={ Style.value }>
          •••
        </div>
      </div>
    </div>
  )
}