'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const MarketingDetails = () => {
    const reviewTypes = ['Creative', 'Brand Experience', 'Content/Energy Studio', 'Media', 'Digital', 'Strategy'].map((r) => ({ label: r, value: r }));
    const buOptions = ['BU 1', 'BU 2', 'BU 3'].map((b) => ({ label: b, value: b }));
    const countries = ['Global', 'UK', 'Germany'].map((c) => ({ label: c, value: c }));

    const [evaluationNames, setEvaluationNames] = useState<{ label: string; value: string }[]>([]);
    const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);

    // form state
    const [selectedEval, setSelectedEval] = useState<string | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [selectedReviewType, setSelectedReviewType] = useState<string | null>(null);
    const [administrator, setAdministrator] = useState<string>('');
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedBU, setSelectedBU] = useState<string | null>(null);

    const [comboList, setComboList] = useState<string[]>([]);
    const [savedCombos, setSavedCombos] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [vendors, setVendors] = useState<{ label: string; value: string }[]>([]);
    const toast = useRef<Toast>(null);
    useEffect(() => {
        // Fetch Evaluation Names from localStorage (first page data)
        const evals = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setEvaluationNames(evals.map((e: string) => ({ label: e, value: e })));

        const vendorsData = JSON.parse(localStorage.getItem('vendors') || '[]');
        setVendors(vendorsData.map((v: any) => ({ label: v.name, value: v.name })));
        // Fetch Accounts from previous mapping (review-country-brand combos)
        const accountsData = JSON.parse(localStorage.getItem('reviewBrandData') || '[]');
        setAccounts(accountsData.map((acc: string) => ({ label: acc, value: acc })));
    }, []);

    const handleSubmit = () => {
        if (!selectedEval || !selectedVendor || !selectedReviewType || !administrator || !selectedAccount || !selectedCountry || !selectedBU) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing!',
                detail: 'Please fill out all fields ',
                life: 3000
            });
            return;
        }

        const combo = `${selectedEval}-${selectedVendor}-${selectedReviewType}-${administrator}-${selectedAccount}-${selectedCountry}-${selectedBU}`;
        setComboList((prev) => [...prev, combo]);
    };

    const handleSave = () => {
        localStorage.setItem('finalReviewData', JSON.stringify(comboList));
        toast.current?.show({
            severity: 'success',
            summary: 'Saved!',
            detail: 'Combos saved locally ',
            life: 3000
        });
    };

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('finalReviewData') || '[]');
        setSavedCombos(data);
        setShowDialog(true);
    };

    return (
        <div className="p-4 card">
            <Toast ref={toast} />

            <Dialog header="Saved Final Combos" visible={showDialog} style={{ width: '60vw' }} onHide={() => setShowDialog(false)}>
                {savedCombos.length ? (
                    <DataTable value={savedCombos.map((c, i) => ({ id: i + 1, name: c }))}>
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Combo" />
                    </DataTable>
                ) : (
                    <p>No saved data found.</p>
                )}
            </Dialog>

            <div className="flex justify-content-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Final Review Data</h2>
                </div>
                <div>
                    <Button label="View Saved Combos" icon="pi pi-eye" onClick={handleViewSaved} />
                </div>
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="flex row col-12">
                    <div className=" col-4 ">
                        <label>Evaluation Name</label>
                        <Dropdown value={selectedEval} options={evaluationNames} onChange={(e) => setSelectedEval(e.value)} className="w-full mt-2" placeholder="Select Evaluation" />
                    </div>
                    <div className=" col-4 ">
                        <label>Vendor</label>
                        <Dropdown value={selectedVendor} options={vendors} onChange={(e) => setSelectedVendor(e.value)} className="w-full mt-2" placeholder="Select Vendor" />
                    </div>
                    <div className=" col-4 ">
                        <label>Review Type</label>
                        <Dropdown value={selectedReviewType} options={reviewTypes} onChange={(e) => setSelectedReviewType(e.value)} className="w-full mt-2" placeholder="Select Review Type" />
                    </div>
                </div>
                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Administrator</label>
                        <InputText value={administrator} onChange={(e) => setAdministrator(e.target.value)} className="w-full mt-2" placeholder="Enter Administrator" />
                    </div>
                    <div className="col-4">
                        <label>Account</label>
                        <Dropdown value={selectedAccount} options={accounts} onChange={(e) => setSelectedAccount(e.value)} className="w-full mt-2" placeholder="Select Account" />
                    </div>
                    <div className="col-4">
                        <label>Country</label>
                        <Dropdown value={selectedCountry} options={countries} onChange={(e) => setSelectedCountry(e.value)} className="w-full mt-2" placeholder="Select Country" />
                    </div>
                </div>
                <div className="flex row col-12">
                    <div className="col-4">
                        <label>BU</label>
                        <Dropdown value={selectedBU} options={buOptions} onChange={(e) => setSelectedBU(e.value)} className="w-full mt-2" placeholder="Select BU" />
                    </div>
                </div>
            </div>

            <div className="flex justify-content-end gap-2 mb-4">
                <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
            </div>

            {comboList.length > 0 && (
                <>
                    <h3 className="text-lg font-medium mb-3">Generated Combos</h3>
                    <DataTable value={comboList.map((c, i) => ({ id: i + 1, name: c }))} className="mb-4">
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Combo" />
                    </DataTable>
                    <div className="flex justify-end">
                        <Button label="Save" icon="pi pi-save" className="p-button-success" onClick={handleSave} />
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketingDetails;
