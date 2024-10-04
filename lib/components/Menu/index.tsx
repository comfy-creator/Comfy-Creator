import { useState } from 'react';
import { Modal } from 'antd';
import './menu.module.scss';
import { BookmarkIcon } from '@radix-ui/react-icons';
import ImageFeed from './ImageFeed';
import Models from './Models';
import { Button } from '@/components/ui/button';

const Tabs = [
   {
      id: 1,
      name: 'Image feed',
      active: true
   },
   {
      id: 2,
      name: 'Models',
      active: false
   }
];

const Menu = () => {
   const [tabs, setTabs] = useState(Tabs);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const selectTab = (tabId: number) => {
      const updatedtabs = tabs.map((tab) => {
         return {
            ...tab,
            active: tab.id === tabId ? true : false
         };
      });
      setTabs(updatedtabs);
   };

   const activeTab = tabs.find((tab) => tab.active);

   return (
      <>
   <Button
variant="outline"
className="!py-1 h-[35px] hover:!bg-white/[1%] hover:!text-fg cursor-pointer text-inputText bg-comfyInputBg rounded-[8px] border border-borderColor mt-[2px] w-full text-[20px]"
id="comfy-load-default-button"
onClick={showModal}
>
Menu
</Button>
         <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            className="menu_modal"
            width={1200}
            centered
            height="70vh"
         >
            <div className="w-full h-full flex gap-[30px]">
               <div className="!w-[150px] h-full flex flex-col items-start justify-center">
                  {tabs.map((tab) => (
                     <div
                        className={`w-full py-1 pr-2.5 mb-3.5 rounded-[10px] flex items-center justify-center transition-all ease-in-out duration-500 text-center select-none cursor-pointer text-inputText hover:color-bg hover:bg-fg ${activeTab?.id === tab.id && 'color-bg bg-fg font-medium'}`}
                        onClick={() => selectTab(tab.id)}
                     >
                        <span className={`flex justify-center items-center mr-2 p-1.5 rounded-[10px] bg-fg transition-all ease-in-out duration-500 ${activeTab?.id === tab.id && 'bg-transparent'}`}>
                           <BookmarkIcon className='fill-current text-bg' />
                        </span>
                        <span>{tab.name}</span>
                     </div>
                  ))}
               </div>
               <div className="w-full h-full">
                  {activeTab?.id === 1 ? <ImageFeed /> : activeTab?.id === 2 ? <Models /> : null}
               </div>
            </div>
         </Modal>
      </>
   );
};

export default Menu;


