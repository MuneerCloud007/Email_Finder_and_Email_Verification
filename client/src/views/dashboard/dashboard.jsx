/***
*
*   DASHBOARD
*   Template dashboard example demonstrating various components inside a view.
*
**********/

import React from 'react';
import { Card, Stat, ProgressBar, Chart, Table,
  Message, Grid, Animate, Feedback, useAPI } from 'components/lib';

export function Dashboard(props){

  // fetch
  const stats = useAPI('/api/demo/stats');
  const progress = useAPI('/api/demo/progress');
  const table = useAPI('/api/demo/users/list');
  const userChart = useAPI('/api/demo/users/types');
  const revenueChart = useAPI('/api/demo/revenue');
  console.log("I am in dashboard.hello");

  return (
    <Animate type='pop'>

      <Message
        closable
        title={ props.t('dashboard.message.title') }
        text={ props.t('dashboard.message.text') }
        type='info'
      />

      <Grid cols='4'>

        { stats.data?.length &&
          stats.data.map(stat => {

            return (
              <Stat
                key={ stat.label }
                loading={ stat.loading }
                value={ stat.value }
                label={ stat.label }
                icon={ stat.icon }
              />
            )
        })}
      </Grid>

      <Card name='revenue' title={ props.t('dashboard.revenue.title') }>
        <Chart
          type='line'
          legend
          loading={ revenueChart.loading }
          data={ revenueChart.data }
          color={['red', 'blue']}
        />
      </Card>

      <Grid cols='2'>
        <Card title={ props.t('dashboard.goals.title') } loading={ progress.loading }>
          { progress?.data?.map(item => {

            return (
              <ProgressBar
                key={ item.label }
                label={ item.label }
                progress={ item.value }
              />
            );

          })}
        </Card>
        <Card title={ props.t('dashboard.user_types.title') }>
          <Chart
            type='pie'
            legend={ true }
            data={ userChart.data }
            loading={ userChart.loading }
            color='purple'
          />
        </Card>
      </Grid>

      <Card title={ props.t('dashboard.users.title') } last>
        <Table
          search
          data={ table.data }
          loading={ table.loading }
          badge={{ col: 'plan', color: 'blue' }}>
        </Table>
      </Card>

      <Feedback />

    </Animate>
  );
}
