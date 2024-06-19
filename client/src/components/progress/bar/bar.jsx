/***
*
*   PROGRESS BAR
*   Percentage-based progress bar with animated fill
*
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   label: text label (string, optional)
*   progress: percentage eg. 75% (string, required)
*
**********/

import { ClassHelper } from 'components/lib';
import Style from './bar.tailwind.js';

export function ProgressBar(props){

  const barStyle = ClassHelper(Style, { 

    bar: true,
    className: props.className

  });

  return (
    <section>

      { props.label &&
        <div className={ Style.label }>{ props.label }
        </div>
      }

      <div className={ barStyle }>
        <div className={ Style.fill } style={{ width: props.progress }}></div>
      </div>

    </section>
  );
}