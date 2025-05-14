'use client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// import React, { useState } from 'react';
// import AddAssesorType from '@/components/market-master/assesorType';
// import AddAssesorRole from '@/components/market-master/assesorRole';
// import AddPosition from '@/components/market-master/position';
// import AddReviewType from '@/components/market-master/reviewType';
// import AddTemplateType from '@/components/market-master/templateType';
// import AddWhitelistedDomain from '@/components/market-master/whitelistedDomain';

// const Tabs = ['Year', 'Time Frame', 'Review Type', 'Country', 'Brand', 'BU'];

// const MarketingMaster = () => {
//     const [activeTab, setActiveTab] = useState('Assesor Type');

//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-between">
//                 <span className="p-input-icon-left flex align-items-center">
//                     <h3 className="mb-0">Other Master</h3>
//                 </span>
//             </div>
//         );
//     };

//     const header = renderHeader();

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'Year':
//                 return <AddAssesorType />;
//             case 'Time Frame':
//                 return <AddPosition />;
//             case 'Review Type':
//                 return <AddReviewType />;
//             case 'Country':
//                 return <AddTemplateType />;
//             case 'Brand':
//                 return <AddWhitelistedDomain />;
//             case 'BU':
//                 return <AddWhitelistedDomain />;
//             default:
//                 return <></>;
//         }
//     };

//     const tabContent = renderTabContent();

//     return (
//         <div className="grid">
//             <div className="col-12">
//                 <div className="header">{header}</div>

//                 <div className="card mt-4">
//                     <div className="">
//                         <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4">
//                             {Tabs?.map((item: any) => (
//                                 <div
//                                     key={item}
//                                     className={`px-4 py-2 font-bold transition-all duration-300 cursor-pointer ${activeTab === item ? 'text-primary-main border border-primary-main rounded-lg' : 'text-gray-500 border-none'}`}
//                                     style={{
//                                         border: activeTab === item ? '1px solid #ec4899' : 'none',
//                                         borderRadius: activeTab === item ? '12px' : '0'
//                                     }}
//                                     onClick={() => setActiveTab(item)}
//                                 >
//                                     {item}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card mt-4 px-5">{tabContent}</div>
//             </div>
//         </div>
//     );
// };

// export default MarketingMaster;

import React, { useEffect, useState } from 'react';

const Tabs = ['Year', 'Time Frame', 'Review Type', 'Country', 'Brand', 'BU'];

const MarketingMaster = () => {
    const [activeTab, setActiveTab] = useState('Year');
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState<Record<string, string[]>>({});

    useEffect(() => {
        // Load existing data from localStorage on mount
        const storedData: Record<string, string[]> = {};
        Tabs.forEach((tab) => {
            const values = localStorage.getItem(tab);
            storedData[tab] = values ? JSON.parse(values) : [];
        });
        setData(storedData);
    }, []);

    const handleSave = () => {
        if (!inputValue.trim()) return;

        const updatedTabData = [...(data[activeTab] || []), inputValue.trim()];
        const updatedData = { ...data, [activeTab]: updatedTabData };

        localStorage.setItem(activeTab, JSON.stringify(updatedTabData));
        setData(updatedData);
        setInputValue('');
    };
    console.log('data', data);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="header mb-4">
                    <h3>Other Master</h3>
                </div>

                <div className="card mb-4">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        {Tabs.map((tab) => (
                            <div
                                key={tab}
                                className={`px-4 py-2 font-bold cursor-pointer ${
                                    activeTab === tab
                                        ? 'text-pink-500 border border-pink-500 rounded-lg'
                                        : 'text-gray-500'
                                }`}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setInputValue('');
                                }}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card px-5 py-4">
                    <h4 className="mb-2">Add {activeTab}</h4>
                    <div className="flex items-center gap-2 mb-4">
                        <InputText
                            type="text"
                            className="p-2 border rounded w-1/2"
                            placeholder={`Enter ${activeTab}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button label="Save" icon="pi pi-save" onClick={handleSave} />
                    </div>

                    {data[activeTab] && data[activeTab].length > 0 && (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">S.No</th>
                                    <th className="border p-2 text-left">{activeTab}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data[activeTab].map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{item}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketingMaster;

