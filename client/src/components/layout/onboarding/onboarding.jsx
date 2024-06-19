/***
*
*   ONBOARDING LAYOUT
*   Simple layout to focus on user onboarding actions
*
*   PROPS
*   children: will be passed from router > view > here (component(s), required)
*
**********/

import Style from './onboarding.tailwind.js';

export function OnboardingLayout(props){

  return (
    <main className={ Style.onboarding }>

      { props.children }

    </main>
  );
}