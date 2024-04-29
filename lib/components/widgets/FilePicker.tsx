import { ChangeEvent, useRef } from 'react';

type FileProps = {
  kind?: string;
  value?: string;
  multiple?: boolean;
  onChange?: (value: FileList | File) => void;
};

export function FilePickerWidget({ onChange, multiple, kind = 'file' }: FileProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange?.(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button className="comfy-btn" onClick={handleButtonClick} style={{ width: '100%' }}>
        Choose {kind}
      </button>
    </>
  );
}
