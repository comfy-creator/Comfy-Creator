import { useEffect, useState } from 'react';

type ToggleProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export const Toggle: React.FC<ToggleProps> = ({ label, disabled, checked, onChange }) => {
  const [input, setInput] = useState(checked);

  useEffect(() => {
    setInput(input);
  }, [input]);

  const handleToggle = () => {
    setInput((inp) => !inp);
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
          <span>{label}</span>
        </div>

        <div onClick={handleToggle} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>{String(input)}</span>
          <div
            style={{
              margin: '3px',
              height: '8px',
              width: '8px',
              borderRadius: '50%',
              background: `${input ? '#606f79' : '#363636'}`
            }}
          />
        </div>
      </div>
    </div>
  );
};

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
