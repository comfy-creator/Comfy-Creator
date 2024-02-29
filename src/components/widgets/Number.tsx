import { useEffect, useState } from 'react';

type NumberWidgetProps = {
  label: string;
  disabled?: boolean;
  value: number;
  onChange?: (value: number) => void;
};

export const Number: React.FC<NumberWidgetProps> = ({ label, disabled, value, onChange }) => {
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
