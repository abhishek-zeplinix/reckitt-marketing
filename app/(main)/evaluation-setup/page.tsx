'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
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
        <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-column align-items-center gap-1">
                    <span className="text-xs text-gray-600 font-medium">{i}</span>
                    <span className="text-black text-xs font-bold">{i % 2 === 0 ? '__' : <i className="pi pi-check text-white bg-green-600 p-1 border-circle text-sm" />}</span>
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

    if (!selectedEvaluation) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Evaluation List</h2>
                <DataTable value={evaluations} stripedRows responsiveLayout="scroll" className="text-sm">
                    <Column field="name" header="Evaluation Name" />
                    <Column field="type" header="Type" />
                    <Column field="year" header="Year" />
                    <Column field="month" header="Month" />
                    <Column body={viewEvaluationTemplate} header="View" style={{ width: '80px' }} />
                </DataTable>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Button icon="pi pi-arrow-left" label="Back to Evaluations" className="p-button-text mb-3" onClick={() => setSelectedEvaluation(null)} />
            <div className="flex justify-content-between align-items-center mb-3">
                <span className="text-sm md:text-base font-semibold">
                    Evaluation Name: <span className="font-normal">{selectedEvaluation.name}</span> &nbsp;
                    Type: <span className="font-normal">{selectedEvaluation.type}</span> &nbsp;
                    Year: <span className="font-normal">{selectedEvaluation.year}</span> &nbsp;
                    Month: <span className="font-normal">{selectedEvaluation.month}</span>
                </span>
                <Button icon="pi pi-copy" label="Duplicate" onClick={handleDuplicate} />
            </div>

            <DataTable value={getVendorsForEvaluation(selectedEvaluation.id)} stripedRows responsiveLayout="scroll" className="text-sm" scrollable>
                <Column field="agency" header="AGENCY" />
                <Column field="account" header="ACCOUNT" />
                <Column body={setupTemplate} header="SET-UP" style={{ width: '200px' }} />
                <Column body={questionSetTemplate} header="QUESTION SET" />
                <Column body={(rowData) => participantsTemplate(rowData.clientParticipants)} header="CLIENT PARTICIPANTS" />
                <Column body={(rowData) => participantsTemplate(rowData.agencyParticipants)} header="AGENCY PARTICIPANTS" />
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
