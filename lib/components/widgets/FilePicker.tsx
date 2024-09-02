import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';

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

export function FilePickerWidget({ onChange, multiple, kind = 'file', value }: FileProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const fileRef = useRef<HTMLInputElement>(null);
   const [fileNames, setFileNames] = useState<string[]>([]);
   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

   useEffect(() => {
      setSelectedFiles(Array.isArray(value) ? value : typeof value === 'string' ? [value] : []);
   }, []);

   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const files = selectedFiles;
         for (let i = 0; i < e.target.files.length; i++) {
            if (fileNames.includes(e.target.files[i].name)) continue;
            const res = await imageToBASE64(e.target.files[i]);
            files.push(res);
            setFileNames([...fileNames, e.target.files[i].name]);
         }
         multiple ? setSelectedFiles(files) : setSelectedFiles([files[files.length - 1]]);
         onChange?.(multiple ? files : files[files.length - 1]);
      }
   };

   const handleButtonClick = () => {
      if (!fileRef.current) return;
      fileRef.current.click();
   };

   const toggleModal = () => setIsModalOpen(!isModalOpen);
   const handleNavigation = (nav: 'prev' | 'next') => {
      const currentIndex = selectedFiles.indexOf(selectedImage!);
      if (currentIndex !== -1) {
         let newIndex = currentIndex;
         if (nav === 'next') {
            newIndex = (currentIndex + 1) % selectedFiles.length;
         } else if (nav === 'prev') {
            newIndex = (currentIndex - 1 + selectedFiles.length) % selectedFiles.length;
         }
         setSelectedImage(selectedFiles[newIndex]);
      }
   };

   const removeFile = (url: string) => {
      const files = selectedFiles.filter((file) => file !== url);
      setSelectedFiles(files);
      onChange?.(multiple ? files : files[0] ? files[0] : '');
   };

   return (
      <>
         <div className="files">
            {selectedFiles.map((url) => (
               <div className="file">
                  <p onClick={() => removeFile(url)} className="file_remove_icon">
                     <Cross1Icon
                        className="icon"
                        style={{
                           color: 'black',
                           margin: '0'
                        }}
                     />
                  </p>
                  <img
                     src={url}
                     alt="preview"
                     style={{ width: '100%' }}
                     onClick={() => {
                        toggleModal();
                        setSelectedImage(url);
                     }}
                  />
               </div>
            ))}
         </div>

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

         <Modal
            open={isModalOpen}
            onCancel={toggleModal}
            footer={null}
            className="menu_modal "
            width={'fit-content'}
            centered
            height="70vh"
            style={{
               justifyContent: 'center',
               alignItems: 'center'
            }}
         >
            {selectedImage && (
               <div
                  className="menu_modal_container"
                  style={{
                     justifyContent: 'center',
                     alignItems: 'center'
                  }}
               >
                  <p
                     onClick={() => handleNavigation('prev')}
                     className="menu_modal_items_button "
                     style={{
                        width: 'fit-content',
                        padding: '0'
                     }}
                  >
                     <ChevronLeftIcon
                        className="icon"
                        style={{
                           color: 'black',
                           margin: '0'
                        }}
                     />
                  </p>

                  <img
                     src={selectedImage}
                     alt="preview"
                     style={{ width: '100%' }}
                     className="image_feed-container"
                  />
                  <p
                     onClick={() => handleNavigation('next')}
                     className="menu_modal_items_button "
                     style={{
                        width: 'fit-content',
                        padding: '0'
                     }}
                  >
                     <ChevronRightIcon
                        className="icon"
                        style={{
                           color: 'black',
                           margin: '0'
                        }}
                     />
                  </p>
               </div>
            )}
         </Modal>
      </>
   );
}
