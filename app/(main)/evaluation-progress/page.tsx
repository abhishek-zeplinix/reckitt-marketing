'use client';

import { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

const TablePage = () => {
    const [selected, setSelected] = useState<string[]>([]);

    const data = [
    {
            agency: 'Agency 1',
            account: 'Creative , Global ,Airwick',
            openComplete: [true, false, true, false],
            clientSubmission: '0 of 3',
            agencySelf: 'N/A',
            agencySubmission: '0 of 3',
            clientSelf: 'N/A'
        },
        {
            agency: 'Agency 2',
            account: 'Creative , Global ,Airwick',
            openComplete: [true, false, true, false],
            clientSubmission: '0 of 2',
            agencySelf: 'N/A',
            agencySubmission: '0 of 3',
            clientSelf: 'N/A'
        }
];


  const lockTemplate = (rowData: any) => (
        <div className="flex flex-wrap gap-3">
            {/* First set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">1</span>
                <i className="pi pi-lock text-yellow-600 text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">2</span>
                <span className="text-black text-xs font-bold">__</span>
            </div>

            {/* Second set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">3</span>
                <i className="pi pi-lock text-yellow-600 text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">4</span>
                <span className="text-black text-xs font-bold">__</span>
            </div>
        </div>
    );


    const toggleSelection = (account: string) => {
        if (selected.includes(account)) {
            setSelected(selected.filter((a) => a !== account));
        } else {
            setSelected([...selected, account]);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Header Info */}
            <div className="text-sm text-gray-700 mb-3">
                <div className="mb-1">
                    <strong>Evaluation:</strong> 2025-5, H1 Creative Global &nbsp;&nbsp;
                    <strong>Evaluation Type:</strong> Annual &nbsp;&nbsp;
                    <strong>Reporting Year:</strong> 2025 &nbsp;&nbsp;
                    <strong>Reporting Month:</strong> 5
                </div>
            </div>

            <div className="flex justify-content-end mt-4">
                <span className="p-input-icon-left w-full md:w-4">
                    <i className="pi pi-search" />
                    <input type="text" className="p-inputtext p-component w-full" placeholder="Search vendors or accounts..." />
                </span>
            </div>
            {/* Vendor Cards */}
            <div className="flex flex-column gap-4 mt-4">
                {data.map((vendor, idx) => (
                    <div key={idx} className=" bg-white card border-round-xl px-4 border-1 border-300 ">
                        <div className="flex justify-content-end mb-2">
                            <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" tooltip="Delete vendor" tooltipOptions={{ position: 'top' }} />
                        </div>
                        <div className=" border-round p-1">
                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">Agency:</div>
                                <div className="flex-1">{vendor.agency}</div>
                            </div>
                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">ACCOUNT:</div>
                                <div className="flex-1">{vendor.account}</div>
                            </div>

                            <div className="mt-4 flex flex-column md:flex-row align-items-start">
                                <div className="w-full md:w-3 text-700 font-semibold">OPEN/COMPLETE:</div>
                                <div className="flex-1 flex gap-4 mt-2 md:mt-0">
                                    {[1, 2, 3, 4].map((step, i) => (
                                        <div key={i} className="flex flex-column align-items-center gap-1">
                                            <span className="text-xs text-600">{`Step ${step}`}</span>
                                            {i % 2 === 0 ? <i className="pi pi-lock text-red-600  p-2 border-circle text-sm shadow-1" /> : <span className="text-900 font-bold text-sm">--</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3 flex flex-column md:flex-row mt-3">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">CLIENT SUBMISSION (1):</div>
                                <div className="flex-1">
                                    <div className="flex-1">{vendor.clientSubmission}</div>
                                </div>
                            </div>
                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">AGENCY SELF (2):</div>
                                <div className="flex-1">
                                    <div className="flex-1">{vendor.agencySelf}</div>
                                </div>
                            </div>

                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">AGENCY SUBMISSION (3):</div>
                                <div className="flex-1">{vendor.agencySubmission}</div>
                            </div>
                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">CLIENT SELF:</div>
                                <div className="flex-1">{vendor.clientSelf}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TablePage;
