import { ChangeEvent } from 'react';

type FileProps = {
  kind?: string;
  value?: string;
  onChange?: (value: File) => void;
};

export function File({ onChange, kind = 'file' }: FileProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // TODO: should we upload the file and set the value to the file reference?
      onChange?.(e.target.files[0]);
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      <button className="comfy-btn">Choose {kind}</button>
    </>
  );
}
