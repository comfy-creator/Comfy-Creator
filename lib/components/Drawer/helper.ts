export const changeAnchor = (anchor: any, classes: any) => {
  switch (anchor) {
    case 'left':
      return classes.left;
    case 'right':
      return classes.right;
    default:
      return classes.left;
  }
};
