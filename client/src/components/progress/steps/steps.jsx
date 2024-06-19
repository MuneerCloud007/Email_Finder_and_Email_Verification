/***
*
*   PROGRESS STEPS
*   Steps are used to indicate the current point in a
*   multi-stage process, such as filling in a long form
*
*   PROPS
*   items: array of objects containing keys: name, url and completed boolean (array, required)
*
**********/

import { Link, ClassHelper } from 'components/lib'
import Style from './steps.tailwind.js';

export function ProgressSteps(props){

  return(
    <ol className={ Style.steps }>
      { props.items &&
        Object.keys(props.items).map(item => {

          item = props.items[item];
          const css = ClassHelper(Style, { item: true, completed: item.completed })

          return (
            <li key={ item.name } className={ css }>
              { item.url ? 
                <Link url={ item.url } text={ item.name } className={ Style.link }/> :
                <span className={ Style.name }>{ item.name }</span> 
              }
            </li>
          );
      })}
    </ol>
  )
}
