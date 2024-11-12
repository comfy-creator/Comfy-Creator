import { useState } from 'react';
import { Modal } from 'antd';
import './menu.module.scss';
import { BookmarkIcon } from '@radix-ui/react-icons';
import ImageFeed from './ImageFeed';
import Models from './Models';
import { Button } from '../ui/button';

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
            className="!py-1 h-[35px] hover:!bg-white/[1%] hover:!text-fg"
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
            <div className="menu_modal_container">
               <div className="menu_modal_items">
                  {tabs.map((tab, index) => (
                     <div
                        className={`menu_modal_items_button ${activeTab?.id === tab.id && 'active'}`}
                        onClick={() => selectTab(tab.id)}
                        key={index}
                     >
                        <span className="icon">
                           <BookmarkIcon />
                        </span>
                        <span>{tab.name}</span>
                     </div>
                  ))}
               </div>
               <div className="menu_modal_content">
                  {activeTab?.id === 1 ? <ImageFeed /> : activeTab?.id === 2 ? <Models /> : null}
               </div>
            </div>
         </Modal>
      </>
   );
};

export default Menu;
