/***
*
*   TAB VIEW
*   Split multiple elements into a tabbed section
*
*   PROPS
*   children: children to render (component(s), required)
*   initialView: set the initial tab index (integer, optional, default: 0)
*   labels: tab label strings (array, required)
*   name: specify a name to persist the active tab state (string, optional)
*
**********/

import { useState, cloneElement } from 'react';
import { ClassHelper } from 'components/lib';
import Style from './tabview.tailwind.js';

export function TabView(props){

  // init
  const init = new Array(props.children.length).fill(false);
  let activeStates = [...init];

  // is there a view saved in storage?
  const savedViewIndex = localStorage.getItem(props.name + 'Tabs');

  // loaded the saved view, or the initial view
  if (savedViewIndex){
    activeStates[savedViewIndex] = true;
  }
  else if (props.initialView){
    activeStates[props.initialView] = true;
  }
  else {
    activeStates[0] = true;
  }

  // state
  const [activeState, setActiveState] = useState(activeStates);

  function switchTab(index){

    let states = [...init];
    states[index] = true;
    setActiveState(states);

    // save the tab
    if (props.name)
      localStorage.setItem(props.name + 'Tabs', index);

  }

  return (
    <div>
      <nav className={ Style.tabs }>
        { props.labels?.map((label, index) => {

          if (label){
            return (
              <Tab key={ label }
                active={ activeState[index] }
                click={ e => switchTab(index) }>
                { label }
              </Tab>
            );
          }
          
          return false;

        })}
      </nav>

      { props.children?.map((view, index) => {

        if (view){

          let visible = 'hide';
          if (activeStates[index]) visible = 'show';
          let newView = cloneElement(view, { className: visible, key: index });
          return newView;

        }

        return false; 
        
      })}
    </div>
  );
}

function Tab(props){

  const buttonStyle = ClassHelper(Style, {

    button: true,
    button_inactive: !props.active,
    button_active: props.active,
    className: props.className,

  })

  return(
    <button
      className={ buttonStyle }
      onClick={ props.click }>
      { props.children }
    </button>
  );
}