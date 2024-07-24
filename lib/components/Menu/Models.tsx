import { useState } from 'react';

const Tabs = [
    {
        id: 1,
        name: 'Installed',
        active: true
    },
    {
        id: 2,
        name: 'Recommended',
        active: false
    }
];

const Models = () => {
    const [tabs, setTabs] = useState(Tabs);

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
        <div className="models">
            <h2>Models</h2>
            <h4>Your Images that has been generated</h4>

            <div className='models_main'>
                <div className="tabs">
                    {tabs.map((tab) => (
                        <div
                            className={`tab ${activeTab?.id === tab.id && 'active'}`}
                            onClick={() => selectTab(tab.id)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
                <div className="models_container">
                    <div className="models_container_item">
                        <div className="models_container_item_image">
                            <img src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="models_container_item_info">
                            <h4 className="models_container_item_info_name">Model Name</h4>
                            <p className="models_container_item_info_desc">Model Description</p>
                        </div>
                    </div>
                    <div className="models_container_item">
                        <div className="models_container_item_image">
                            <img src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="models_container_item_info">
                            <h4 className="models_container_item_info_name">Model Name</h4>
                            <p className="models_container_item_info_desc">Model Description</p>
                        </div>
                    </div>
                    <div className="models_container_item">
                        <div className="models_container_item_image">
                            <img src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="models_container_item_info">
                            <h4 className="models_container_item_info_name">Model Name</h4>
                            <p className="models_container_item_info_desc">Model Description</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Models;
