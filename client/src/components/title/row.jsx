/***
*
*   TITLE ROW
*   Title and CTA button
*
*   PROPS
*   children: the action button (component, required)
*   title: title (string, required)
*
**********/

import { ClassHelper } from 'components/lib';
import Style from './row.tailwind.js';

export function TitleRow(props){

  const titleRowStyle = ClassHelper(Style, {

    row: true,
    className: props.className

  })

  return (
    <section className={ titleRowStyle } style={{display:"flex",gap:'2rem'}}>

      { props.title && 
        <h2 className={ Style.title }>
          { props.title }
        </h2> }
      
      <div className={ Style.actions }>
        { props.children }
      </div>
      
    </section>
  )
}