import { useState } from 'react';
import { ComfyItems } from '../types/api.ts';
import { useApiContext } from '../contexts/api.tsx';

// import { useLoadGraphData } from '../hooks/useLoadGraphData';

interface ComfyListProps {
  text: string;
  type?: string;
  reverse?: boolean;
  show: boolean;
}

export const ComfyList = ({ show, text, type, reverse = false }: ComfyListProps) => {
  const [items, setItems] = useState({});
  const { getItems, clearItems, deleteItem } = useApiContext();

  // const { loadGraphData } = useLoadGraphData();

  const load = async () => {
    const items = await getItems(type || text.toLowerCase());
    setItems(items);
  };

  return (
    <div className="comfy-list" style={{ display: show ? 'block' : 'none' }}>
      {Object.keys(items).flatMap((section) => [
        <h4 key={section}>{section}</h4>,
        <div className="comfy-list-items" key={`${section}-items`}>
          {(reverse
            ? Object.values((items as ComfyItems[])[section as keyof typeof items]).reverse()
            : Object.values(items[section as keyof typeof items])
          ).map((item, index) => {
            const removeAction = item.remove || {
              name: 'Delete',
              cb: () => deleteItem(type || text.toLowerCase(), item.prompt[1])
            };

            return (
              <div key={index}>
                {item.prompt[0]}:
                <button
                  onClick={async () => {
                    // await loadGraphData(item.prompt[3].extra_pnginfo.workflow);
                    if (item.outputs) {
                      // app.nodeOutputs = item.outputs;
                    }
                  }}
                >
                  Load
                </button>
                <button
                  onClick={async () => {
                    await removeAction.cb();
                    await load();
                  }}
                >
                  {removeAction.name}
                </button>
              </div>
            );
          })}
        </div>
      ])}

      <div className="comfy-list-actions">
        <button
          onClick={async () => {
            await clearItems(type ?? text.toLowerCase());
            await load();
          }}
        >
          Clear {text}
        </button>

        <button onClick={load}>Refresh</button>
      </div>
    </div>
  );
};
