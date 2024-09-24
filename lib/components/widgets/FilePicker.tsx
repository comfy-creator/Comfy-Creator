import { ChangeEvent, useRef, useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useApiContext } from '../../contexts/api';
import { API_URL } from '../../config/constants';
import { useFlowStore } from '../../store/flow';
import { ProgressBar } from '../ProgressBar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@nextui-org/react';

export type FileProps = {
   nodeId?: string;
   kind?: string;
   value?: string | string[];
   multiple?: boolean;
   onChange?: (value: string | string[]) => void;
   outputInfo?: {
      name: string;
   };
   displayName?: string;
};

const imageToBASE64 = (file: File) =>
   new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });

export function FilePickerWidget({
   nodeId,
   onChange,
   multiple,
   kind = 'file',
   value,
   outputInfo,
   displayName
}: FileProps) {
   const { uploadFile, makeServerURL } = useApiContext();
   const { setAppLoading, nodes } = useFlowStore((state) => state);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const fileRef = useRef<HTMLInputElement>(null);
   const [selectedFiles, setSelectedFiles] = useState<
      { name: string; url: string; loading: boolean }[]
   >([]);

   const [numOfFilesToUpload, setNumOfFilesToUpload] = useState(0);
   const [numOfFilesUploaded, setNumOfFilesUploaded] = useState(0);
   const [uploadProgress, setUploadProgress] = useState(0);

   useEffect(() => {
      const files = [];
      if (typeof value === 'string') {
         files.push({ name: value, url: value, loading: false });
      } else if (Array.isArray(value)) {
         const newFileNames = value.map((f) => ({ name: f, url: f, loading: false }));
         files.push(...newFileNames);
      }
      setSelectedFiles(files);
   }, []);

   const handleUpdate = (files: { name: string; url: string; loading: boolean }[]) => {
      updateOutputData(files);
      const onChangeFiles = multiple ? files.map((f) => f.url) : [files[files.length - 1]?.url] || [];
      onChange?.(onChangeFiles);
   }

   const updateOutputData = (files: { name: string; url: string; loading: boolean }[]) => {
      if (nodeId && outputInfo) {
         let outputs: any = {};
         const node = nodes.find((node) => node.id === nodeId);
         if (node) {
            outputs = node.data.outputs;
            outputs[outputInfo.name] = {
               ...outputs[outputInfo.name],
               value: files?.map((f) => f.url) || []
            };
         }
      }
   };

   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setAppLoading(true);
      const newFiles = Array.from(e.target.files || []).map((file) => ({
         name: file.name,
         url: URL.createObjectURL(file),
         loading: true
      }));

      const filteredNewFiles = newFiles.filter(
         (newFile) => !selectedFiles.some((file) => file.name === newFile.name)
      );

      const files = [...selectedFiles, ...filteredNewFiles];
      handleUpdate(files);
      setSelectedFiles(files);

      setNumOfFilesToUpload(filteredNewFiles.length);
      if (filteredNewFiles.length > 0) {
         for (let i = 0; i < filteredNewFiles.length; i++) {
            const file = filteredNewFiles[i];
            const fileIndex = files.findIndex((f) => f.name === file.name);
            if (fileIndex === -1) continue;

            const fileBlob = await fetch(file.url).then((r) => r.blob());
            const res = await imageToBASE64(
               new File([fileBlob], file.name, { type: fileBlob.type })
            );

            await new Promise((resolve) => setTimeout(resolve, 3000));
            files[fileIndex].url = res;
            files[fileIndex].loading = false;
            setNumOfFilesUploaded((prev) => prev + 1);
            setUploadProgress((prev) => prev + 100 / filteredNewFiles.length);
         }
         setSelectedFiles(files);
         handleUpdate(files);

         setNumOfFilesToUpload(0);
         setNumOfFilesUploaded(0);
         setUploadProgress(0);
      }
      setAppLoading(false);
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
      handleUpdate(files);
   };

   const handleUpload = useCallback(
      async function (file: File) {
         const formData = new FormData();
         formData.append('file', file);

         try {
            const total = file.size;
            let loaded = 0;

            const response = await fetch(makeServerURL(API_URL.UPLOAD), {
               method: 'POST',
               body: formData,
               cache: 'no-store'
            });

            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response?.body?.getReader()!;
            const chunks = [];

            while (true) {
               const { done, value } = await reader.read();

               if (done) {
                  break;
               }

               chunks.push(value);
               loaded += value.length;
               const percentComplete = (loaded / total) * 100;
            }

            const responseData = JSON.parse(
               new TextDecoder().decode(new Uint8Array(chunks.flatMap((chunk) => [...chunk])))
            );
            console.log('File uploaded successfully');
            return responseData.url;
         } catch (error) {
            console.log('Error occurred while uploading file:', error);
            // Handle the error here
         }
      },
      [numOfFilesToUpload, numOfFilesUploaded, uploadProgress]
   );

   return (
      <>
         <p className={`text-[9px] mt-[5px]`}>{displayName}</p>
         <Button
            variant="outline"
            className="!h-[25px] mt-1 mb-2 !text-[12px] text-dragText bg-bg border-borderColor hover:bg-white/[3%] hover:text-fg"
            onClick={handleButtonClick}
            style={{ width: '100%' }}
         >
            Choose {kind}
         </Button>
         {numOfFilesToUpload > 0 && (
            <div className="w-full flex items-center justify-between">
               <p>
                  {numOfFilesUploaded} / {numOfFilesToUpload}
               </p>
               <p>{uploadProgress.toFixed(2)}%</p>
            </div>
         )}
         <ProgressBar progress={(uploadProgress || 0)?.toFixed(2)?.toString()} />
         <div
            className="flex flex-wrap no_scrollbar overflow-y-auto gap-2 !max-h-fit !h-fit"
            onWheelCapture={(e) => e.stopPropagation()}
         >
            {selectedFiles.map(({ url, loading }, index) => (
               <div className="file relative" key={index}>
                  {!loading && (
                     <p
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 hover:bg-red-500/60 w-[20px] h-[20px] rounded-full flex items-center cursor-pointer justify-center p-1 transition-all duration-300 z-[99]"
                     >
                        <Cross1Icon
                           className="icon text-white hover:text-white"
                           style={{
                              margin: '0',
                              fontSize: '4rem'
                           }}
                        />
                     </p>
                  )}
                  <div className="relative" style={{ width: '100%' }}>
                     <img
                        src={url}
                        alt="preview"
                        style={{ width: '100%', opacity: loading ? 0 : 1 }}
                        onClick={() => {
                           toggleModal();
                           setSelectedImage(url);
                        }}
                     />
                     {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 z-[999] animate-pulse p-10">
                           {/* <ProgressBar progress="100" /> */}
                           <Spinner size="sm" />
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         <input
            type="file"
            ref={fileRef}
            multiple={multiple}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            key={selectedFiles.length}
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
                     className="menu_modal_items_button bg-white !p-1 rounded-full"
                     style={{
                        width: 'fit-content',
                        padding: '0'
                     }}
                  >
                     <ChevronLeftIcon
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
                     className="menu_modal_items_button bg-white !p-1 rounded-full"
                     style={{
                        width: 'fit-content',
                        padding: '0'
                     }}
                  >
                     <ChevronRightIcon
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