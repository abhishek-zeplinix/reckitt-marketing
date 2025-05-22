'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Define a type for vendor objects
type Vendor = {
    agency: string;
    account: string;
    questionSet: string[];
    clientParticipants: string[];
    agencyParticipants: string[];
};

type Evaluation = {
    id: number;
    name: string;
    type: string;
    year: string;
    month: string;
};

export default function VendorTable() {
    const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [evaluationVendors, setEvaluationVendors] = useState<Record<number, Vendor[]>>({});

    const [duplicateDialogVisible, setDuplicateDialogVisible] = useState(false);
    const [newEvalDialogVisible, setNewEvalDialogVisible] = useState(false);
    const [selectedDupEvalId, setSelectedDupEvalId] = useState<number | null>(null);
    const [newMonthDate, setNewMonthDate] = useState<Date | null>(null);

    // Filters for Evaluations table
    const [evaluationFilters, setEvaluationFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        type: { value: null, matchMode: FilterMatchMode.IN },
        year: { value: null, matchMode: FilterMatchMode.IN },
        month: { value: null, matchMode: FilterMatchMode.IN }
    });

    // Filters for Vendors table
    const [vendorFilters, setVendorFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        agency: { value: null, matchMode: FilterMatchMode.CONTAINS },
        account: { value: null, matchMode: FilterMatchMode.CONTAINS },
        questionSet: { value: null, matchMode: FilterMatchMode.CONTAINS },
        clientParticipants: { value: null, matchMode: FilterMatchMode.CONTAINS },
        agencyParticipants: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [globalVendorFilterValue, setGlobalVendorFilterValue] = useState('');

    useEffect(() => {
        const storedEvaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        const storedVendors = JSON.parse(localStorage.getItem('evaluationVendors') || '{}');

        if (storedEvaluations.length === 0) {
            const initialEvaluations: Evaluation[] = [
                { id: 1, name: '2025-5, H1 Creative Global', type: 'Annual', year: '2025', month: '5' },
                { id: 2, name: '2024-12, Q4 Media Review', type: 'Quarterly', year: '2024', month: '12' },
                { id: 3, name: '2025-3, H1 Digital Audit', type: 'Biannual', year: '2025', month: '3' },
                { id: 4, name: '2025-7, H2 Creative Global', type: 'Annual', year: '2025', month: '7' },
                { id: 5, name: '2024-10, Q1 Media Review', type: 'Quarterly', year: '2024', month: '10' },
                { id: 6, name: '2025-2, H2 Digital Audit', type: 'Biannual', year: '2025', month: '2' }
            ];
            const initialVendors: Record<number, Vendor[]> = {
                1: [
                    {
                        agency: 'Agency 1',
                        account: 'Global Brand Campaign',
                        questionSet: ['Creative Evaluation Template v2'],
                        clientParticipants: ['1: Owners', '3: Assessors'],
                        agencyParticipants: ['2: Owners', '4: Assessors']
                    },
                    {
                        agency: 'Agency 2',
                        account: 'Social Media Strategy',
                        questionSet: ['Digital Performance Metrics'],
                        clientParticipants: ['2: Owners', '1: Assessors'],
                        agencyParticipants: ['1: Owners', '2: Assessors']
                    }
                ],
                2: [
                    {
                        agency: 'Agency 3',
                        account: 'Programmatic Buying',
                        questionSet: ['Media Efficiency Matrix'],
                        clientParticipants: ['1: Owners', '2: Assessors'],
                        agencyParticipants: ['1: Owners', '1: Assessors']
                    }
                ],
                3: [
                    {
                        agency: 'Agency 4',
                        account: 'Data & Measurement',
                        questionSet: ['Digital Audit Framework'],
                        clientParticipants: ['3: Owners', '2: Assessors'],
                        agencyParticipants: ['2: Owners', '3: Assessors']
                    },
                    {
                        agency: 'Agency 5',
                        account: 'Customer Experience',
                        questionSet: ['UX Evaluation Scorecard'],
                        clientParticipants: ['1: Owners', '1: Assessors'],
                        agencyParticipants: ['1: Owners', '2: Assessors']
                    },
                    {
                        agency: 'Agency 6',
                        account: 'Search Optimization',
                        questionSet: ['SEO Performance Metrics'],
                        clientParticipants: ['2: Owners', '1: Assessors'],
                        agencyParticipants: ['1: Owners', '1: Assessors']
                    }
                ]
            };
            localStorage.setItem('evaluations', JSON.stringify(initialEvaluations));
            localStorage.setItem('evaluationVendors', JSON.stringify(initialVendors));
            setEvaluations(initialEvaluations);
            setEvaluationVendors(initialVendors);
        } else {
            setEvaluations(storedEvaluations);
            setEvaluationVendors(storedVendors);
        }
    }, []);

    const getVendorsForEvaluation = (evaluationId: number): Vendor[] => {
        return evaluationVendors[evaluationId] || [];
    };

    const handleDuplicate = () => {
        setDuplicateDialogVisible(true);
    };

    const handleCreateEvaluation = () => {
        if (!newMonthDate || !selectedEvaluation) return;

        const baseEval = selectedEvaluation;
        const newMonth = `${newMonthDate.getMonth() + 1}`;
        const newId = Math.max(...evaluations.map(e => e.id)) + 1;

        const newEval = {
            id: newId,
            name: `${baseEval.year}-${newMonth}, ${baseEval.name.split(', ')[1]}`,
            type: baseEval.type,
            year: baseEval.year,
            month: newMonth,
        };

        const updatedEvals = [...evaluations, newEval];
        const updatedVendors = {
            ...evaluationVendors,
            [newId]: [...(evaluationVendors[baseEval.id] || [])]  // copy from currently selected evaluation
        };

        localStorage.setItem('evaluations', JSON.stringify(updatedEvals));
        localStorage.setItem('evaluationVendors', JSON.stringify(updatedVendors));

        setEvaluations(updatedEvals);
        setEvaluationVendors(updatedVendors);
        setNewEvalDialogVisible(false);
        setDuplicateDialogVisible(false);
    };

    const handleMapToExisting = () => {
        if (selectedEvaluation && selectedDupEvalId !== null) {
            const vendorsToCopy = evaluationVendors[selectedEvaluation.id] || [];
            const updatedVendors = {
                ...evaluationVendors,
                [selectedDupEvalId]: [...(evaluationVendors[selectedDupEvalId] || []), ...vendorsToCopy]
            };

            localStorage.setItem('evaluationVendors', JSON.stringify(updatedVendors));
            setEvaluationVendors(updatedVendors);
            setDuplicateDialogVisible(false);
        }
    };

    const setupTemplate = (rowData: Vendor) => (
        <div className="flex flex-wrap gap-3 align-items-center">
            {[1, 2, 3, 4].map((i, index) => (
                <div key={i} className="flex align-items-center gap-3">
                    <div className="flex flex-column align-items-center gap-1">
                        <span className="text-xs text-gray-600 font-medium">{i}</span>
                        <span className="text-black text-xs font-bold">
                            {i % 2 === 0 ? '__' : <i className="pi pi-check text-white bg-green-600 p-1 border-circle text-sm" />}
                        </span>
                    </div>
                    {index === 1 && (
                        <div className="h-4 border-left-1 border-gray-300 mx-2" style={{ height: '28px' }} />
                    )}
                </div>
            ))}
        </div>
    );
    const questionSetTemplate = (rowData: Vendor) => (
        <div>{rowData.questionSet.map((q, i) => <div key={i}>{q}</div>)}</div>
    );

    const participantsTemplate = (data: string[]) => (
        <div>{data.map((entry, i) => <div key={i}>{entry}</div>)}</div>
    );

    const actionBodyTemplate = () => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" />
        </div>
    );

    const viewEvaluationTemplate = (rowData: Evaluation) => (
        <Button icon="pi pi-eye" className="p-button-text p-button-sm" onClick={() => setSelectedEvaluation(rowData)} />
    );

    // const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setGlobalFilterValue(value);

    //     const newFilters: any = { ...evaluationFilters };
    //     newFilters['global'].value = value;
    //     setEvaluationFilters(newFilters);
    // };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);

        // Convert month names to numbers in the search
        const searchValue = monthNameToNumber(value);

        const newFilters: any = { ...evaluationFilters };
        newFilters['global'].value = searchValue;
        setEvaluationFilters(newFilters);
    };

    const onVendorGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalVendorFilterValue(value);

        const newFilters: any = { ...vendorFilters };
        newFilters['global'].value = value;
        setVendorFilters(newFilters);
    };


    const monthNameToNumber = (name: string) => {
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const index = monthNames.indexOf(name.toLowerCase());
        return index !== -1 ? (index + 1).toString() : name;
    };

    const renderEvaluationHeader = () => {
        const typeOptions = Array.from(new Set(evaluations.map(e => e.type)));
        const yearOptions = Array.from(new Set(evaluations.map(e => e.year)));
        // const monthOptions = Array.from(new Set(evaluations.map(e => e.month)));
        const monthOptions = Array.from({ length: 12 }, (_, i) => ({
            label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            value: (i + 1).toString()
        }));

        return (
            <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center">
                    <h2 className="text-xl font-bold m-0">Evaluation List</h2>

                </div>
                <div className="flex justify-content-end gap-3">
                    <MultiSelect
                        value={evaluationFilters.type.value}
                        options={typeOptions}
                        onChange={(e) => {
                            const newFilters = { ...evaluationFilters };
                            newFilters.type.value = e.value;
                            setEvaluationFilters(newFilters);
                        }}
                        placeholder="Filter by Type"
                        maxSelectedLabels={1}
                        className="w-full md:w-15rem"
                    />
                    <MultiSelect
                        value={evaluationFilters.year.value}
                        options={yearOptions}
                        onChange={(e) => {
                            const newFilters = { ...evaluationFilters };
                            newFilters.year.value = e.value;
                            setEvaluationFilters(newFilters);
                        }}
                        placeholder="Filter by Year"
                        maxSelectedLabels={1}
                        className="w-full md:w-15rem"
                    />
                    {/* <MultiSelect
                        value={evaluationFilters.month.value}
                        options={monthOptions}
                        onChange={(e) => {
                            const newFilters = { ...evaluationFilters };
                            newFilters.month.value = e.value;
                            setEvaluationFilters(newFilters);
                        }}
                        placeholder="Filter by Month"
                        maxSelectedLabels={1}
                        className="w-full md:w-15rem"
                    /> */}

                    <MultiSelect
                        value={evaluationFilters.month.value}
                        options={monthOptions}
                        onChange={(e) => {
                            const newFilters = { ...evaluationFilters };
                            newFilters.month.value = e.value;
                            setEvaluationFilters(newFilters);
                        }}
                        placeholder="Filter by Month"
                        maxSelectedLabels={1}
                        className="w-full md:w-20rem"
                        optionLabel="label"
                    />

                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Keyword Search"
                        />
                    </span>
                </div>
            </div>
        );
    };

    const renderVendorHeader = () => {
        const vendors = selectedEvaluation ? getVendorsForEvaluation(selectedEvaluation.id) : [];
        const agencyOptions = Array.from(new Set(vendors.map(v => v.agency)));
        const accountOptions = Array.from(new Set(vendors.map(v => v.account)));

        return (
            <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center">
                    <div className="text-sm md:text-base font-semibold">
                        Evaluation Name: <span className="font-normal">{selectedEvaluation?.name}</span> &nbsp;
                        Type: <span className="font-normal">{selectedEvaluation?.type}</span> &nbsp;
                        Year: <span className="font-normal">{selectedEvaluation?.year}</span> &nbsp;
                        Month: <span className="font-normal">{selectedEvaluation?.month}</span>&nbsp;
                        Set-up: <span className="font-normal text-xs ">
                        (1: Reckitt to Agency, 2: Agency to Reckitt, 3: Reckitt self to Agency, 4: Agency self to Reckitt)
                        </span>
                    </div>
                <Button icon="pi pi-copy" label="Duplicate" onClick={handleDuplicate} />
                </div>
                <div className="flex justify-content-end gap-3">
                    <MultiSelect
                        value={vendorFilters.agency.value}
                        options={agencyOptions}
                        onChange={(e) => {
                            const newFilters = { ...vendorFilters };
                            newFilters.agency.value = e.value;
                            setVendorFilters(newFilters);
                        }}
                        placeholder="Filter by Agency"
                        maxSelectedLabels={1}
                        className="w-full md:w-15rem"
                    />
                    <MultiSelect
                        value={vendorFilters.account.value}
                        options={accountOptions}
                        onChange={(e) => {
                            const newFilters = { ...vendorFilters };
                            newFilters.account.value = e.value;
                            setVendorFilters(newFilters);
                        }}
                        placeholder="Filter by Account"
                        maxSelectedLabels={1}
                        className="w-full md:w-15rem"
                    />
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalVendorFilterValue}
                            onChange={onVendorGlobalFilterChange}
                            placeholder="Keyword Search"
                        />
                    </span>
                </div>
            </div>
        );
    };

    if (!selectedEvaluation) {
        return (
            <div className="p-4">
                {/* {renderEvaluationHeader()} */}
                <DataTable
                    value={evaluations}
                    stripedRows
                    responsiveLayout="scroll"
                    className="text-sm mt-3"
                    filters={evaluationFilters}
                    filterDisplay="menu"
                    globalFilterFields={['name', 'type', 'year', 'month']}
                    header={renderEvaluationHeader}
                >
                    <Column field="name" header="Evaluation Name" filter filterPlaceholder="Search by name" />
                    <Column field="type" header="Type" filter filterPlaceholder="Filter by type" />
                    <Column field="year" header="Year" filter filterPlaceholder="Filter by year" />
                    {/* <Column field="month" header="Month" filter filterPlaceholder="Filter by month" /> */}
                    {/* <Column
                        header="Month"
                        body={(rowData) => {
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return monthNames[parseInt(rowData.month, 10) - 1] || rowData.month;
                        }}
                    /> */}

                    {/* <Column
                        field="month"
                        header="Month"
                        body={(rowData) => {
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return monthNames[parseInt(rowData.month, 10) - 1] || rowData.month;
                        }}
                        filter
                        filterPlaceholder="Filter by month"
                        filterField="month"
                        filterElement={(options) => (
                            <MultiSelect
                                value={options.value}
                                options={Array.from({ length: 12 }, (_, i) => ({
                                    label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
                                    value: (i + 1).toString()
                                }))}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Months"
                                className="p-column-filter"
                            />
                        )}
                    /> */}

                    <Column
                        field="month"
                        header="Month"
                        body={(rowData) => {
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return monthNames[parseInt(rowData.month, 10) - 1] || rowData.month;
                        }}
                        filter
                        filterPlaceholder="Filter by month"
                        filterField="month"
                        // filterMatchMode="equals"
                        filterElement={(options) => (
                            <MultiSelect
                                value={options.value}
                                options={Array.from({ length: 12 }, (_, i) => ({
                                    label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
                                    value: (i + 1).toString()
                                }))}
                                onChange={(e) => options.filterCallback(e.value)}
                                placeholder="Select Months"
                                className="p-column-filter"
                            />
                        )}
                    />
                    <Column
                        header="No. of Agency"
                        body={(rowData) => {
                            const vendors = evaluationVendors[rowData.id] || [];
                            const uniqueAgencies = new Set(vendors.map(v => v.agency));
                            return uniqueAgencies.size;
                        }}
                    />
                    <Column
                        header="No. of Account"
                        body={(rowData) => {
                            const vendors = evaluationVendors[rowData.id] || [];
                            const uniqueAccounts = new Set(vendors.map(v => v.account));
                            return uniqueAccounts.size;
                        }}
                    />
                    <Column body={viewEvaluationTemplate} header="View" style={{ width: '80px' }} />
                </DataTable>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Button icon="pi pi-arrow-left" label="Back to Evaluations" className="p-button-text mb-3" onClick={() => setSelectedEvaluation(null)} />

            {/* {renderVendorHeader()} */}

            <DataTable
                value={getVendorsForEvaluation(selectedEvaluation.id)}
                stripedRows
                responsiveLayout="scroll"
                className="text-sm mt-3"
                scrollable
                filters={vendorFilters}
                filterDisplay="menu"
                globalFilterFields={['agency', 'account', 'questionSet', 'clientParticipants', 'agencyParticipants']}
                header={renderVendorHeader}
            >
                <Column field="agency" header="AGENCY" filter filterPlaceholder="Search by agency" />
                <Column field="account" header="ACCOUNT" filter filterPlaceholder="Search by account" />
                <Column body={setupTemplate} header="SET-UP" style={{ width: '200px' }} />
                <Column body={questionSetTemplate} header="QUESTION SET" filter filterField="questionSet" filterPlaceholder="Search question sets" />
                <Column
                    body={(rowData) => participantsTemplate(rowData.clientParticipants)}
                    header="CLIENT PARTICIPANTS"
                    filter
                    filterField="clientParticipants"
                    filterPlaceholder="Search participants"
                />
                <Column
                    body={(rowData) => participantsTemplate(rowData.agencyParticipants)}
                    header="AGENCY PARTICIPANTS"
                    filter
                    filterField="agencyParticipants"
                    filterPlaceholder="Search participants"
                />
                <Column body={actionBodyTemplate} header="ACTIONS" style={{ width: '120px' }} />
            </DataTable>

            <Dialog header="Duplicate Evaluation" visible={duplicateDialogVisible} onHide={() => setDuplicateDialogVisible(false)}>
                <div className="flex flex-column gap-3">
                    <Dropdown
                        value={selectedDupEvalId}
                        onChange={(e) => setSelectedDupEvalId(e.value)}
                        options={evaluations.filter(e => {
                            if (!selectedEvaluation || e.id === selectedEvaluation.id) return false;

                            const getLastTwoWords = (name: string) => {
                                const parts = name.split(', ')[1]?.split(' ') || [];
                                return parts.slice(-2).join(' ').toLowerCase();
                            };

                            const selectedLastTwo = getLastTwoWords(selectedEvaluation.name);
                            const evalLastTwo = getLastTwoWords(e.name);

                            return selectedLastTwo === evalLastTwo;
                        })}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Evaluation"
                        className="w-full"
                    />

                    <div className="flex justify-content-between gap-2">
                        <Button label="Save to Selected Evaluation" onClick={handleMapToExisting} disabled={selectedDupEvalId === null} />
                        <Button label="Create New Evaluation" onClick={() => setNewEvalDialogVisible(true)} />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Create Evaluation" visible={newEvalDialogVisible} onHide={() => setNewEvalDialogVisible(false)}>
                <div className="flex flex-column gap-3">
                    <label>Select Month</label>
                    <Calendar value={newMonthDate} onChange={(e) => setNewMonthDate(e.value || new Date())} view="month" dateFormat="mm" showIcon className="w-full" />
                    <Button label="Save" onClick={handleCreateEvaluation} disabled={!newMonthDate} />
                </div>
            </Dialog>
        </div>
    );
}