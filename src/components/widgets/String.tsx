type StringProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function String({ label, disabled, value, onChange }: StringProps) {
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}
