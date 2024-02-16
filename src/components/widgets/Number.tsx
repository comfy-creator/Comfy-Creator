// ctx.textAlign = "left";
//                     ctx.strokeStyle = outline_color;
//                     ctx.fillStyle = background_color;
//                     ctx.beginPath();
// 					if(show_text)
// 	                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5] );
// 					else
// 	                    ctx.rect(margin, y, widget_width - margin * 2, H );
//                     ctx.fill();
//                     if (show_text) {
// 						if(!w.disabled)
// 		                    ctx.stroke();
//                         ctx.fillStyle = text_color;
// 						if(!w.disabled)
// 						{
// 							ctx.beginPath();
// 							ctx.moveTo(margin + 16, y + 5);
// 							ctx.lineTo(margin + 6, y + H * 0.5);
// 							ctx.lineTo(margin + 16, y + H - 5);
// 							ctx.fill();
// 							ctx.beginPath();
// 							ctx.moveTo(widget_width - margin - 16, y + 5);
// 							ctx.lineTo(widget_width - margin - 6, y + H * 0.5);
// 							ctx.lineTo(widget_width - margin - 16, y + H - 5);
// 							ctx.fill();
// 						}
//                         ctx.fillStyle = secondary_text_color;
//                         ctx.fillText(w.label || w.name, margin * 2 + 5, y + H * 0.7);
//                         ctx.fillStyle = text_color;
//                         ctx.textAlign = "right";
//                         if (w.type == "number") {
//                             ctx.fillText(
//                                 Number(w.value).toFixed(
//                                     w.options.precision !== undefined
//                                         ? w.options.precision
//                                         : 3
//                                 ),
//                                 widget_width - margin * 2 - 20,
//                                 y + H * 0.7
//                             );
//                         } else {
// 							let v = w.value;
// 							if( w.options.values )
// 							{
// 								let values = w.options.values;
// 								if( values.constructor === Function )
// 									values = values();
// 								if(values && values.constructor !== Array)
// 									v = values[ w.value ];
// 							}
//                             ctx.fillText(
//                                 v,
//                                 widget_width - margin * 2 - 20,
//                                 y + H * 0.7
//                             );
//                         }
//                     }

import { NumberWidget } from '../../types.ts';
import { useEffect, useState } from 'react';

export function Number({ label, disabled, value, onChange }: NumberWidget) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(input);
  }, [input]);

  const handleInputIncrement = () => {
    const inputValue = parseInt(String(input));
    setInput(isNaN(inputValue) ? 0 : inputValue + 1);
  };

  const handleInputDcrement = () => {
    const inputValue = parseInt(String(input));
    if (isNaN(inputValue)) {
      setInput(0);
    } else if (inputValue > 0) {
      setInput(input - 1);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '15px',
        marginTop: '1px',
        marginBottom: '1px'
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          background: 'var(--comfy-input-bg)',
          color: 'var(--input-text)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NumberImgButton type={'decrement'} onClick={handleInputDcrement} />
          <span>{label}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>{input}</span>
          <NumberImgButton type={'increment'} onClick={handleInputIncrement} />
        </div>
      </div>
    </div>
  );
}

function NumberImgButton({
  type,
  onClick
}: {
  type: 'increment' | 'decrement';
  onClick: () => void;
}) {
  return (
    <>
      <img
        src={type === 'decrement' ? '/lcaret.svg' : '/rcaret.svg'}
        style={{ width: '10px', height: '10px' }}
        onClick={onClick}
      />
    </>
  );
}
