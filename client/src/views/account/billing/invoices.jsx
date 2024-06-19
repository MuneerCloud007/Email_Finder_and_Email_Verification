import { Card, Table, useAPI } from 'components/lib';

export function BillingInvoices(props){

  const invoices = useAPI('/api/account/invoice')

  return (
    <Card className={ props.className }>

      <Table 
        loading={ invoices.loading }
        hide={['invoice_pdf']}
        badge={{ col: 'status', color: 'red', condition: [

          { value: 'paid', color: 'green' },

        ]}}
        data={ invoices?.data?.map(x => {
          return {
            ...x,
            actions: { download: x.invoice_pdf }
          }
        })}
        translation='account.billing.invoice'
      />
    </Card>
  );
}