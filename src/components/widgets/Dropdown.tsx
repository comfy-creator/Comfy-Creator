import { useEffect, useState } from 'react';

type EnumProps = {
  label: string;
  disabled?: boolean;
  value: string | string[];
  options: { values: string[] | (() => string[]) };
  onChange?: (value: string | string[]) => void;
  multiSelect?: boolean;
};

export function Dropdown({ label, disabled, value, options, onChange, multiSelect }: EnumProps) {
  const values = options
    ? Array.isArray(options.values)
      ? options.values
      : options.values()
    : typeof value === 'string'
      ? [value]
      : value;

  const [input, setInput] = useState(0);

  useEffect(() => {
    setInput(input);
  }, [input]);

  const handleInputIncrement = () => {
    setInput((i) => (i === values.length - 1 ? 0 : i + 1));
  };

  const handleInputDcrement = () => {
    setInput((i) => (i === 0 ? values.length - 1 : i - 1));
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
          <EnumImgButton type={'decrement'} onClick={handleInputDcrement} />
          <span>{label}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>{values[input]}</span>
          <EnumImgButton type={'increment'} onClick={handleInputIncrement} />
        </div>
      </div>
    </div>
  );
}

function EnumImgButton({
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
