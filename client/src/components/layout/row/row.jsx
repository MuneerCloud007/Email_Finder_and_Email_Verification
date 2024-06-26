/***
*
*   ROW
*   Row layout with title and description
*
*   PROPS
*   children: children to render (component(s), required)
*   desc: description below the title (string, optional)
*   header: render a header row (boolean, optional)
*   mainTitle: the main title of the row (string, optional)
*   title: the title of the row (string, required)
*
**********/

import { ClassHelper } from 'components/lib'
import { RowHeader } from './header';
import { Content } from './content'
import Style from './row.tailwind.js';

export function Row(props){

  const css = ClassHelper(Style, {

    row: true,
    [props.color]: props.color, 
    className: props.className,

  });

  if (props.header){
    return (
      <header className={ Style.row }>
        <Content>

          { props.children }

        </Content>
      </header>
    );
  }

  return (
    <section className={ css }>
      <Content>

        <RowHeader
          title={ props.title }
          desc={ props.desc }
          color={ props.color }
          mainTitle={ props.mainTitle }
        />

        { props.children }

      </Content>
    </section>
  )
}