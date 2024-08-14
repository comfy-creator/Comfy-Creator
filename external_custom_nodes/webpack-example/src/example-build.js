var e = {
      d: (t, o) => {
         for (var r in o)
            e.o(o, r) && !e.o(t, r) && Object.defineProperty(t, r, { enumerable: !0, get: o[r] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: (e) => {
         'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(e, '__esModule', { value: !0 });
      }
   },
   t = {};
e.r(t), e.d(t, { default: () => r });
const o = window['@xyflow/react'],
   r = function () {
      return React.createElement(
         React.Fragment,
         null,
         React.createElement(o.NodeResizeControl, {
            style: { width: '12px', height: '12px', border: 'none', cursor: 'se-resize' },
            color: 'transparent',
            position: 'bottom-right',
            minWidth: 400,
            minHeight: 400
         }),
         React.createElement(
            'div',
            {
               style: { fontSize: 12, color: 'gray', width: '400px', height: '400px' },
               className: 'node_container'
            },
            React.createElement(
               'div',
               { className: 'node_label_container' },
               React.createElement(
                  'span',
                  { className: 'node_label', style: { color: 'gray' } },
                  'Group'
               )
            )
         )
      );
   };
window.GroupNode = t;
