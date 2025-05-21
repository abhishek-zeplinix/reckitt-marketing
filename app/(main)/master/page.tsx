'use client';
import React, { useState, useRef } from 'react';
import AddBrandsControl from '@/components/market-master/brands';
import AddCountriesControl from '@/components/market-master/countries';
import AddRegionControl from '@/components/market-master/region';
import { Button } from 'primereact/button';
import AddReviewType from '@/components/market-master/reviewType';
import AddTemplateType from '@/components/market-master/templateType';
import BUControls from '@/components/market-master/bu';
import AddUserGroup from '@/components/market-master/userGroup';
import AddAssessorGroup from '@/components/market-master/assessorGroup';
import AddAssessorRole from '@/components/market-master/assesorRole';

const Tabs = ['Review Type', "Template Type", "Region", 'Country', 'Brand', 'BU', 'User Group', 'Assessor Group', 'Assessor Role', 'User'];

const MasterTower = () => {
    const [activeTab, setActiveTab] = useState('Review Type');
    const tabsContainerRef = useRef(null);

    const scrollToCenter = (element: any) => {
        if (tabsContainerRef.current && element) {
            const container: any = tabsContainerRef.current;
            const elementRect: any = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const elementCenter = elementRect.left + elementRect.width / 2;
            const containerCenter = containerRect.left + containerRect.width / 2;
            const scrollOffset = elementCenter - containerCenter;

            container.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            });
        }
    };

    const handleTabClick = (tabName: any, event: any) => {
        setActiveTab(tabName);

        setTimeout(() => {
            scrollToCenter(event.currentTarget);
        }, 50);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left flex align-items-center">
                    <h3 className="mb-0">Marketing Master</h3>
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Brand':
                return <AddBrandsControl />;
            case 'Country':
                return <AddCountriesControl />;
            case 'Region':
                return <AddRegionControl />;
            case 'Review Type':
                return <AddReviewType />;
            case 'Template Type':
                return <AddTemplateType />;
            case 'BU':
                return <BUControls />;
            case 'User Group':
                return <AddUserGroup />;
            case 'Assessor Group':
                return <AddAssessorGroup />;
            case 'Assessor Role':
                return <AddAssessorRole />;
                
            default:
                return <div className="p-4 text-center text-500">Content for {activeTab} will be implemented here</div>;
        }
    };

    const tabContent = renderTabContent();

    return (
        <div className="grid">
            <div className="col-12">
                <div className='flex justify-content-between align-items-center'>
                    <div className="header">{header}</div>
                    <Button className='text-gray-500 font-small' icon="pi pi-file" label='Bulk Upload' outlined />
                </div>

                <div className="card mt-4 p-0">
                    <div
                        style={{
                            position: 'relative',
                            borderBottom: '1px solid #e5e7eb'
                        }}
                    >
                        <div
                            ref={tabsContainerRef}
                            className="flex py-3 px-3"
                            style={{
                                overflowX: 'auto',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                // WebkitScrollbar: { display: 'none' }

                            }}
                        >

                            {Tabs.map((item) => (
                                <div
                                    key={item}
                                    className={`cursor-pointer  transition-all transition-duration-200 py-2 ${activeTab === item
                                        ? 'text-pink-500'
                                        : 'text-600'
                                        }`}
                                    onClick={(event) => handleTabClick(item, event)}
                                    style={{
                                        position: 'relative',
                                        padding: '5px 15px',  //tab text padding
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        minWidth: 'fit-content',
                                        border: activeTab === item ? '1px solid #ec4899' : 'none',
                                        borderRadius: activeTab === item ? '15px' : '0'
                                    }}
                                >
                                    {item}
                                    {activeTab === item && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-15px',
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                backgroundColor: '#ec4899',
                                                borderRadius: '1px'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='p-4'>{tabContent}</div></div>
            </div>
        </div>
    );
};

export default MasterTower;