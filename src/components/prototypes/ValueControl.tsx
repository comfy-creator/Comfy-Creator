// valueControl.beforeQueued = () => {
//   if (controlValueRunBefore) {
//     // Don't run on first execution
//     if (valueControl[HAS_EXECUTED]) {
//       applyWidgetControl();
//     }
//   }
//   valueControl[HAS_EXECUTED] = true;
// };
//
// valueControl.afterQueued = () => {
//   if (!controlValueRunBefore) {
//     applyWidgetControl();
//   }
// };
