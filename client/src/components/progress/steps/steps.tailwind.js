const Style = {
  
  steps: 'list-none text-center [counter-reset:step]',
  item: `text-sm inline-block text-center mr-6 last:mr-0 [counter-increment:step] before:[content:counters(step,'.')]
    before:inline-block before:w-8 before:h-8 before:bg-blue-500 before:rounded-full before:text-white 
    before:leading-[2.3em] before:font-bold before:mb-1`,
  name: 'block', 
  link: 'block text-white',
  completed: 'before:bg-emerald-500'

}

export default Style;