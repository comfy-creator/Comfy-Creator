export function keyPressHandler(keyName: string, event: any) {
  event.preventDefault();
  switch (keyName) {
    case 'ctrl+enter':
      // Handle ctrl+enter
      alert('Current graph has been queued for generation');
      break;
    case 'ctrl+shift+enter':
      alert('Current graph has been queued for generation');
      // Handle ctrl+shift+enter
      break;
    case 'ctrl+s':
      const response = prompt('Save workflow as:', 'workflow.json');
      alert(`Workflow saved as ${response}`);
      break;
    case 'ctrl+o':
      console.log('ctrl+o');
      // Handle ctrl+o (open)
      break;
    case 'ctrl+a':
      console.log('ctrl+a');
      // Handle ctrl+a (select all)
      break;
    case 'ctrl+m':
      console.log('ctrl+m');
      // Handle ctrl+m
      break;
    case 'del':
      console.log('del');
      // Handle delete
      break;
    case 'backspace':
      console.log('backspace');
      // Handle backspace
      break;
    case 'ctrl+del':
      console.log('ctrl+del');
      // Handle ctrl+delete
      break;
    case 'ctrl+backspace':
      console.log('ctrl+backspace');
      // Handle ctrl+backspace
      break;
    case 'space':
      console.log('space');
      // Handle space
      break;
    case 'ctrl+left':
      console.log('ctrl+left');
      // Handle ctrl+left
      break;
    case 'shift+left':
      console.log('shift+left');
      // Handle shift+left
      break;
    case 'ctrl+c':
      console.log('ctrl+c');
      // Handle ctrl+c (copy)
      break;
    case 'ctrl+v':
      console.log('ctrl+v');
      // Handle ctrl+v (paste)
      break;
    case 'ctrl+shift+v':
      console.log('ctrl+shift+v');
      // Handle ctrl+shift+v
      break;
    case 'ctrl+d':
      console.log('ctrl+d');
      // Handle ctrl+d
      break;
    case 'q':
      console.log('q');
      // Handle q
      break;
    case 'h':
      console.log('h');
      // Handle h
      break;
    case 'r':
      console.log('r');
      // Handle r
      break;
    default:
      // Handle other keys
      break;
  }
}
