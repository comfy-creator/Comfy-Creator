import { ChangeEvent, useRef, useState, useEffect } from 'react';

export type FileProps = {
   kind?: string;
   value?: string | string[];
   multiple?: boolean;
   onChange?: (value: string | string[]) => void;
};

const imageToBASE64 = (file: File) =>
   new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });

export function FilePickerWidget({ onChange, multiple = true, kind = 'file', value }: FileProps) {
   const fileRef = useRef<HTMLInputElement>(null);
   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

   useEffect(() => {
      setSelectedFiles(Array.isArray(value) ? value : typeof value === 'string' ? [value] : []);
   }, []);

   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const files = selectedFiles;
         for (let i = 0; i < e.target.files.length; i++) {
            const res = await imageToBASE64(e.target.files[i]);
            files.push(res);
         }
         multiple ? setSelectedFiles(files) : setSelectedFiles([files[files.length - 1]]);
         onChange?.(multiple ? files : files[files.length - 1]);
      }
   };

   const handleButtonClick = () => {
      if (!fileRef.current) return;
      fileRef.current.click();
   };

   return (
      <>
         {selectedFiles.map((url) => (
            <img src={url} alt="preview" style={{ width: '100%' }} />
         ))}
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
