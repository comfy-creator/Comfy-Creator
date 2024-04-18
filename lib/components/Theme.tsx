import { useSettingsStore } from '../store/settings.ts';

interface ThemeProps {
  value: string;
  onChange: (value: string) => void;
}

export function Theme({ value, onChange }: ThemeProps) {
  const { themes } = useSettingsStore();
  const options = Object.values(themes).map((c) => (
    <option key={c.id} value={c.id} selected={c.id === value}>
      {c.name}
    </option>
  ));

  const select = (
    <select
      style={{ marginBottom: '0.15rem', width: '100%' }}
      onChange={(e) => onChange(e.target.value)}
    >
      {options}
    </select>
  );

  return (
    <tr>
      <td>
        <label htmlFor={'theme'}>Theme</label>
      </td>
      <td>
        {select}
        <div style={{ display: 'grid', gap: '4px', gridAutoFlow: 'column' }}>
          <input
            id={'theme'}
            type={'button'}
            value={'Export'}
            onClick={async () => {
              // const colorPaletteId = app.ui.settings.getSettingValue(id, defaultColorPaletteId);
              // const colorPalette = await completeColorPalette(getColorPalette(colorPaletteId));
              // const json = JSON.stringify(colorPalette, null, 2); // convert the data to a JSON string
              // const blob = new Blob([json], { type: 'application/json' });
              // const url = URL.createObjectURL(blob);
              // const a = $el('a', {
              //   href: url,
              //   download: colorPaletteId + '.json',
              //   style: { display: 'none' },
              //   parent: document.body
              // });
              // a.click();
              // setTimeout(function () {
              //   a.remove();
              //   URL.revokeObjectURL(url);
              // }, 0);
            }}
          />

          <input type={'button'} value={'Import'} onClick={() => {} /*fileInput.click()*/} />

          <input
            type={'button'}
            value={'Template'}
            onClick={() => {
              // const colorPalette = await getColorPaletteTemplate();
              // const json = JSON.stringify(colorPalette, null, 2); // convert the data to a JSON string
              // const blob = new Blob([json], { type: 'application/json' });
              // const url = URL.createObjectURL(blob);
              // const a = $el('a', {
              //   href: url,
              //   download: 'color_palette.json',
              //   style: { display: 'none' },
              //   parent: document.body
              // });
              // a.click();
              // setTimeout(function () {
              //   a.remove();
              //   URL.revokeObjectURL(url);
              // }, 0);
            }}
          />

          <input
            type={'button'}
            value={'Delete'}
            onClick={() => {
              // let colorPaletteId = app.ui.settings.getSettingValue(id, defaultColorPaletteId);
              //
              // if (colorPalettes[colorPaletteId]) {
              //   alert('You cannot delete a built-in color palette.');
              //   return;
              // }
              //
              // if (colorPaletteId.startsWith('custom_')) {
              //   colorPaletteId = colorPaletteId.substr(7);
              // }
              //
              // await deleteCustomColorPalette(colorPaletteId);
            }}
          />
        </div>
      </td>
    </tr>
  );
}
