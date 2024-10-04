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
        <div className="w-full h-full">
            <h2>Models</h2>
            <h4>Models available for you to choose for your workflow</h4>

            <div className='h-[calc(100%-100px)] overflow-y-auto'>
                <div className="flex gap-2.5 mb-5">
                    {tabs.map((tab) => (
                        <div
                            className={`py-0 px-2.5 text-lg text-inputText cursor-pointer transition-all duration-300 ease-in-out hover:text-fg ${activeTab?.id === tab.id && 'text-fg border-2 border-fg'}`}
                            onClick={() => selectTab(tab.id)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <div className="w-[250px] h-[300px] p-[15px] flex flex-col justify-center items-center rounded-[10px] bg-borderColor cursor-pointer">
                        <div className="w-[220px] h-[220px] rounded-[10px]">
                            <img className="w-full h-full object-contain rounded-[10px]" src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="w-full mt-5 flex justify-center items-start flex-col">
                            <h4 className="m-[5px] text-sm font-medium text-fg">Model Name</h4>
                            <p className="m-0 text-xs font-normal text-trEvenBgColor">Model Description</p>
                        </div>
                    </div>
                    <div className="w-[250px] h-[300px] p-[15px] flex flex-col justify-center items-center rounded-[10px] bg-borderColor cursor-pointer">
                        <div className="w-[220px] h-[220px] rounded-[10px]">
                            <img className="w-full h-full object-contain rounded-[10px]" src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="w-full mt-5 flex justify-center items-start flex-col">
                            <h4 className="m-[5px] text-sm font-medium text-fg">Model Name</h4>
                            <p className="m-0 text-xs font-normal text-trEvenBgColor">Model Description</p>
                        </div>
                    </div>
                    <div className="w-[250px] h-[300px] p-[15px] flex flex-col justify-center items-center rounded-[10px] bg-borderColor cursor-pointer">
                        <div className="w-[220px] h-[220px] rounded-[10px]">
                            <img className="w-full h-full object-contain rounded-[10px]" src="https://via.placeholder.com/150" alt="image" />
                        </div>
                        <div className="w-full mt-5 flex justify-center items-start flex-col">
                            <h4 className="m-[5px] text-sm font-medium text-fg">Model Name</h4>
                            <p className="m-0 text-xs font-normal text-trEvenBgColor">Model Description</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Models;