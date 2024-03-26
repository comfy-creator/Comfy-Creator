import { useLogging } from '../../contexts/logging.tsx';
import { useEffect, useRef } from 'react';
import { LogEntry } from '../../lib/types.ts';
import { useDialog } from '../../contexts/dialog.tsx';

function stringify(val: any, depth: number, replacer?: any, space?: any, onGetObjID?: any) {
  depth = isNaN(+depth) ? 1 : depth;
  var recursMap = new WeakMap();

  function _build(val: any, depth: number, o?: any, a?: any, r?: boolean) {
    // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
    return !val || typeof val != 'object'
      ? val
      : ((r = recursMap.has(val)),
        recursMap.set(val, true),
        (a = Array.isArray(val)),
        r
          ? (o = (onGetObjID && onGetObjID(val)) || null)
          : JSON.stringify(val, function (k, v) {
              if (a || depth > 0) {
                if (replacer) v = replacer(k, v);
                if (!k) return (a = Array.isArray(v)), (val = v);
                !o && (o = a ? [] : {});
                o[k] = _build(v, a ? depth : depth - 1);
              }
            }),
        o === void 0 ? (a ? [] : {}) : o);
  }

  return JSON.stringify(_build(val, depth), null, space);
}

const jsonReplacer = (k: string, v: any, ui: boolean) => {
  if (v instanceof Array && v.length === 1) {
    v = v[0];
  }
  if (v instanceof Date) {
    v = v.toISOString();
    if (ui) {
      v = v.split('T')[1];
    }
  }
  if (v instanceof Error) {
    let err = '';
    if (v.name) err += v.name + '\n';
    if (v.message) err += v.message + '\n';
    if (v.stack) err += v.stack + '\n';
    if (!err) {
      err = v.toString();
    }
    v = err;
  }
  return v;
};

export function LoggingDialog() {
  const { clear, entries, enabled } = useLogging();
  const { showDialog, ref: dialogRef, addActionButtons } = useDialog();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const clearButton = (
      <button key={'clearButton'} type="button" onClick={() => clear()}>
        Clear
      </button>
    );

    const exportButton = (
      <button key={'importButton'} type="button" onClick={() => exportLogs()}>
        Export logs...
      </button>
    );

    const importButton = (
      <button key={'exportButton'} type="button" onClick={() => importLogs()}>
        View exported logs...
      </button>
    );

    addActionButtons([clearButton, exportButton, importButton]);
    showLogsDialog();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'red';
      case 'warn':
        return 'orange';
      case 'debug':
        return 'dodgerblue';
    }
  };

  const clearLogs = () => {
    clear();
    showLogsDialog();
  };

  const exportLogs = () => {
    if (!anchorRef.current) return;

    const blob = new Blob([stringify(entries, 20, jsonReplacer, '\t')], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    anchorRef.current.href = url;
    anchorRef.current.download = `comfyui-logs-${Date.now()}.json`;
    anchorRef.current.click();

    setTimeout(function () {
      anchorRef.current?.remove();
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const importLogs = () => {
    if (!fileInputRef.current) return;

    fileInputRef.current.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        fileInputRef.current?.remove();
        try {
          const obj = JSON.parse(reader.result as string);
          if (obj instanceof Array) {
            showLogsDialog(obj);
          } else {
            throw new Error('Invalid file selected.');
          }
        } catch (error) {
          const err = error as Error;
          alert('Unable to load logs: ' + err?.message);
        }
      };

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        reader.readAsText(file);
      }
    };

    fileInputRef.current.click();
  };

  const showLogsDialog = (entrs?: LogEntry[]) => {
    if (!entrs) {
      entrs = entries;
    }

    if (dialogRef.current) {
      dialogRef.current.style.width = '100%';
    }

    const cols = {
      source: 'Source',
      type: 'Type',
      timestamp: 'Timestamp',
      message: 'Message'
    };
    const keys = Object.keys(cols);
    const headers = Object.values(cols).map((title, i) => (
      <div key={`heaader-${i}`} className="comfy-logging-title">
        {title}
      </div>
    ));

    const rows = entrs.map((entry, i) => {
      return (
        <div
          key={`entry-${i}`}
          className="comfy-logging-log"
          // @ts-ignore
          style={{ '--row-bg': `var(--tr-${i % 2 ? 'even' : 'odd'}-bg-color)` }}
        >
          {keys.map((key, j) => {
            let v = entry[key as keyof LogEntry];
            let color;
            if (key === 'type') {
              color = getTypeColor(v as string);
            } else {
              v = jsonReplacer(key, v, true);

              if (typeof v === 'object') {
                v = stringify(v, 5, jsonReplacer, '  ');
              }
            }

            return (
              <div key={`key-${j}`} style={{ color }}>
                {v as string}
              </div>
            );
          })}
        </div>
      );
    });

    const grid = (
      <div
        key={'grid'}
        className=" comfy-logging-logs"
        style={{
          gridTemplateColumns: `repeat(${headers.length}, 1fr)`
        }}
      >
        {headers}
        {rows}
      </div>
    );

    const disabled = (
      <h3 key={'msg'} style={{ textAlign: 'center' }}>
        Logging is disabled
      </h3>
    );

    showDialog(enabled ? grid : disabled);
  };

  return (
    <>
      <a href="" ref={anchorRef} style={{ display: 'none' }} />
      <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} />
    </>
  );
}
