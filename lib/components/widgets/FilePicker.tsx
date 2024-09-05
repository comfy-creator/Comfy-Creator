import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '@nextui-org/react';

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
   const [selectedFiles, setSelectedFiles] = useState<{ name: string; url: string }[]>([]);

   useEffect(() => {
      const files = [];
      if (typeof value === 'string') {
         files.push({ name: value, url: value });
      } else if (Array.isArray(value)) {
         const newFileNames = value.map((f) => ({ name: f, url: f }));
         files.push(...newFileNames);
      }
      setSelectedFiles(files);
   }, []);

   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const files = selectedFiles;
         for (let i = 0; i < e.target.files.length; i++) {
            if (files.map((f) => f.name).includes(e.target.files[i].name)) continue;
            const res = await imageToBASE64(e.target.files[i]);
            files.push({ name: e.target.files[i].name, url: res });
         }
         multiple ? setSelectedFiles(files) : setSelectedFiles([files[files.length - 1]]);
         const onChangeFiles = multiple
            ? files.map((f) => f.url)
            : files[files.length - 1]?.url || '';
         onChange?.(onChangeFiles);
      }
   };

   const handleButtonClick = () => {
      if (!fileRef.current) return;
      fileRef.current.click();
   };

   const toggleModal = () => setIsModalOpen(!isModalOpen);
   const handleNavigation = (nav: 'prev' | 'next') => {
      const currentIndex = selectedFiles.map((f) => f.url).indexOf(selectedImage!);
      if (currentIndex !== -1) {
         let newIndex = currentIndex;
         if (nav === 'next') {
            newIndex = (currentIndex + 1) % selectedFiles.length;
         } else if (nav === 'prev') {
            newIndex = (currentIndex - 1 + selectedFiles.length) % selectedFiles.length;
         }
         setSelectedImage(selectedFiles[newIndex]?.url);
      }
   };

   const removeFile = (index: number) => {
      const files = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(files);
      const onChangeFiles = multiple ? files.map((f) => f.url) : files[files.length - 1]?.url || '';
      onChange?.(onChangeFiles);
   };

   return (
      <>
         <p className={`text-[9px] mt-[6px]`}>images</p>
         <Button
            variant="bordered"
            className="!h-[25px] mt-1 mb-2 !text-[12px] text-dragText bg-bg border-borderColor"
            onClick={handleButtonClick}
            style={{ width: '100%' }}
         >
            Choose {kind}
         </Button>
         <div className="files no_scrollbar" onWheelCapture={(e) => e.stopPropagation()}>
            {selectedFiles.map(({ url }, index) => (
               <div className="file">
                  <p onClick={() => removeFile(index)} className="file_remove_icon">
                     <Cross1Icon
                        className="icon"
                        style={{
                           color: 'black',
                           margin: '0',
                           fontSize: '4.5rem'
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
