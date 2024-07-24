import { useState } from 'react';
import { Button, Modal } from 'antd';
import './menu.module.scss';
import { BookmarkIcon } from '@radix-ui/react-icons';
import Gallery from './Gallery';
import Models from './Models';

const Tabs = [
   {
      id: 1,
      name: 'Gallery',
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
         <button id="comfy-load-default-button" onClick={showModal}>
            Menu
         </button>
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
                  {tabs.map((tab) => (
                     <div
                        className={`menu_modal_items_button ${activeTab?.id === tab.id && 'active'}`}
                        onClick={() => selectTab(tab.id)}
                     >
                        <span className="icon">
                           <BookmarkIcon />
                        </span>
                        <span>{tab.name}</span>
                     </div>
                  ))}
               </div>
               <div className="menu_modal_content">
                  {activeTab?.id === 1 ? (
                     <Gallery />
                  ) : activeTab?.id === 2 ? (
                     <Models />
                  ) : null}
               </div>
            </div>
         </Modal>
      </>
   );
};

export default Menu;
