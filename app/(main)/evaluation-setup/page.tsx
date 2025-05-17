'use client';

import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function EvaluationSetup() {
    const vendors = [
        {
            agency: 'Dentsu',
            account: 'Digital, France, Health (Digital) - updated question set',
            questionSet: ['Dig (IAegis) FR/BE/NL | 5 Sections', 'Media AG | 4 Sections'],
            clientParticipants: ['0: Owners', '3: Assessors'],
            agencyParticipants: ['0: Owners', '3: Assessors']
        },
        {
            agency: 'Dentsu',
            account: 'Digital, France, Hygiene (Digital) - updated question set',
            questionSet: ['Dig (IAegis) FR/BE/NL | 5 Sections', 'Media AG | 4 Sections'],
            clientParticipants: ['0: Owners', '2: Assessors'],
            agencyParticipants: ['0: Owners', '3: Assessors']
        }
    ];

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Header Info */}
            <div className="border-1 border-300 p-4 border-round-xl bg-white card text-sm font-medium flex flex-column md:flex-row gap-4 ">
                <div className="flex-1">
                    <div className="text-500 mb-1">Evaluation Name</div>
                    <div className="text-900 font-semibold">2025-5, H1 Media, Global</div>
                </div>
                <div className="flex-1">
                    <div className="text-500 mb-1">Evaluation Type</div>
                    <div className="text-900 font-semibold">Annual</div>
                </div>
                <div className="flex-1">
                    <div className="text-500 mb-1">Reporting Year</div>
                    <div className="text-900 font-semibold">2025</div>
                </div>
                <div className="flex-1">
                    <div className="text-500 mb-1">Reporting Month</div>
                    <div className="text-900 font-semibold">05</div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-content-end mt-4">
                <span className="p-input-icon-left w-full md:w-4">
                    <i className="pi pi-search" />
                    <input type="text" className="p-inputtext p-component w-full" placeholder="Search vendors or accounts..." />
                </span>
            </div>

            {/* Vendor Cards */}
            <div className="flex flex-column gap-4 mt-5">
                {vendors.map((vendor, idx) => (
                    <div key={idx} className="bg-white card border-round-xl px-4 border-1 border-300 ">
                        <div className="flex justify-content-between mb-2">
                            <div className="font-bold text-xl text-900">{vendor.agency}</div>
                            <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" tooltip="Delete vendor" tooltipOptions={{ position: 'top' }} />
                        </div>

                        <div className=" border-round p-1">
                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">ACCOUNT:</div>
                                <div className="flex-1">{vendor.account}</div>
                            </div>

                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">QUESTION SET:</div>
                                <div className="flex-1">
                                    <ul className="list-disc pl-4 m-0 text-sm text-800">
                                        {vendor.questionSet.map((q, i) => (
                                            <li key={i}>{q}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">CLIENT PARTICIPANTS:</div>
                                <div className="flex-1">{vendor.clientParticipants.join(', ')}</div>
                            </div>

                            <div className="mb-3 flex flex-column md:flex-row">
                                <div className="w-full md:w-3 text-700 font-semibold mb-2 md:mb-0">AGENCY PARTICIPANTS:</div>
                                <div className="flex-1">{vendor.agencyParticipants.join(', ')}</div>
                            </div>

                            <div className="mt-4 flex flex-column md:flex-row align-items-start">
                                <div className="w-full md:w-3 text-700 font-semibold">SET-UP:</div>
                                <div className="flex-1 flex gap-4 mt-2 md:mt-0">
                                    {[1, 2, 3, 4].map((step, i) => (
                                        <div key={i} className="flex flex-column align-items-center gap-1">
                                            <span className="text-xs text-600">{`Step ${step}`}</span>
                                            {i % 2 === 0 ? <i className="pi pi-check text-white bg-green-500 p-2 border-circle text-sm shadow-1" /> : <span className="text-900 font-bold text-sm">--</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
