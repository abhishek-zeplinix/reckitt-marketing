'use client';
import React, { useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const EvaluationPage = () => {
    const toast = useRef(null);
    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        label: `${currentYear + i}`,
        value: `${currentYear + i}`
    }));

    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => ({ label: m, value: m }));

    const timeframeOptions = ['H1', 'H2'].map((t) => ({ label: t, value: t }));

    const reviewTypes = [
        'Creative',
        'Brand Experience',
        'Content/Energy Studio',
        'Media',
        'Digital',
        'Strategy',
        'Medical Marketing (UK only)',
        'USA Procurement (shopper data)',
        'In-house Digital media',
        'IT&D',
        'Briefing & Strategy (Global)',
        'USA Procurement (local Nielsen)'
    ].map((r) => ({ label: r, value: r }));

    const countries = ['Global', 'UK', 'Germany', 'USA', 'India'].map((c) => ({ label: c, value: c }));

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
    const [selectedReviewTypes, setSelectedReviewTypes] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [combinations, setCombinations] = useState<string[]>([]);

    const [showDialog, setShowDialog] = useState(false);
    const [savedData, setSavedData] = useState<string[]>([]);

    const handleSubmit = () => {
        if (!selectedYear || !selectedMonths.length || !selectedTimeframes.length || !selectedReviewTypes.length || !selectedCountries.length) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Hold up!',
                detail: 'Please select all the fields 😅',
                life: 3000
            });
            return;
        }

        const newCombos: string[] = [];

        selectedMonths.forEach((month) => {
            selectedTimeframes.forEach((timeframe) => {
                selectedReviewTypes.forEach((review) => {
                    selectedCountries.forEach((country) => {
                        newCombos.push(`${selectedYear}-${month}-${timeframe}-${review}-${country}`);
                    });
                });
            });
        });

        setCombinations((prev) => [...prev, ...newCombos]);
    };

    const handleSave = () => {
        localStorage.setItem('evaluationData', JSON.stringify(combinations));
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Saved successfully ✅',
            life: 3000
        });
    };

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setSavedData(data);
        setShowDialog(true);
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <Dialog header="Saved Evaluations" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                {savedData.length > 0 ? (
                    <DataTable value={savedData.map((val, i) => ({ id: i + 1, name: val }))}>
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Evaluation Name" />
                    </DataTable>
                ) : (
                    <p>No saved evaluations found.</p>
                )}
            </Dialog>

            <div className="flex justify-content-between mb-3">
                <h2 className="text-xl font-semibold">Evaluation Name</h2>
                <Button label="View Saved Evaluations" icon="pi pi-eye" onClick={handleViewSaved} />
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="flex row col-12">
                    <div className="md:col-4">
                        <label>Year</label>
                        <Dropdown value={selectedYear} options={yearOptions} onChange={(e) => setSelectedYear(e.value)} className="w-full mt-2" placeholder="Select Year" />
                    </div>
                    <div className="md:col-4">
                        <label>Months</label>
                        <MultiSelect value={selectedMonths} options={monthOptions} onChange={(e) => setSelectedMonths(e.value)} className="w-full mt-2" placeholder="Select Months" />
                    </div>
                    <div className="md:col-4">
                        <label>Timeframes</label>
                        <MultiSelect value={selectedTimeframes} options={timeframeOptions} onChange={(e) => setSelectedTimeframes(e.value)} className="w-full mt-2" placeholder="Select Timeframes" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="md:col-4">
                        <label>Review Types</label>
                        <MultiSelect value={selectedReviewTypes} options={reviewTypes} onChange={(e) => setSelectedReviewTypes(e.value)} className="w-full mt-2" placeholder="Select Review Types" />
                    </div>
                    <div className="md:col-4">
                        <label>Countries</label>
                        <MultiSelect value={selectedCountries} options={countries} onChange={(e) => setSelectedCountries(e.value)} className="w-full mt-2" placeholder="Select Countries" />
                    </div>
                </div>

                <div className="col-12 flex justify-content-end">
                    <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
                </div>
            </div>

            {combinations.length > 0 && (
                <>
                    <h3 className="text-lg font-medium mt-5 mb-3">Generated Evaluations</h3>
                    <DataTable value={combinations.map((c, i) => ({ id: i + 1, name: c }))} className="mb-4">
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Evaluation Name" />
                    </DataTable>
                    <div className="flex justify-content-end">
                        <Button label="Save" icon="pi pi-save" onClick={handleSave} className="p-button-success" />
                    </div>
                </>
            )}
        </div>
    );
};

export default EvaluationPage;
