'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const EvaluationPage = () => {
    const toast = useRef<Toast>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [savedData, setSavedData] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    // State for dropdown options
    const [yearOptions, setYearOptions] = useState<{label: string, value: string}[]>([]);
    const [monthOptions, setMonthOptions] = useState<{label: string, value: number}[]>([]);
    const [timeframeOptions, setTimeframeOptions] = useState<{label: string, value: string}[]>([]);
    const [reviewTypes, setReviewTypes] = useState<{label: string, value: string}[]>([]);
    const [countries, setCountries] = useState<{label: string, value: string}[]>([]);

    // Form state
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
    const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
    const [selectedReviewTypes, setSelectedReviewTypes] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [combinations, setCombinations] = useState<string[]>([]);

    // Load all data from localStorage
    useEffect(() => {
        setIsClient(true);
        
        // Year options from localStorage (using the "Year" key from your data)
        const storedYears = JSON.parse(localStorage.getItem('Year') || '[]');
        setYearOptions(storedYears.map((year: string) => ({
            label: year,
            value: year
        })));

        // Month options
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        setMonthOptions(months.map((m, index) => ({ label: m, value: index + 1 })));

        // Timeframe options from localStorage (using "Evaluation Period")
        const timeframes = JSON.parse(localStorage.getItem('Evaluation Period') || [] as any);
        setTimeframeOptions(timeframes.map((t: string) => ({ label: t, value: t })));

        // Review Types from localStorage (using "Review Type")
        const storedReviewTypes = JSON.parse(localStorage.getItem('Review Type') || [] as any);
        setReviewTypes(storedReviewTypes.map((r: string) => ({ label: r, value: r })));

        // Countries from localStorage (using "Country")
        const storedCountries = JSON.parse(localStorage.getItem('Country') || [] as any);
        setCountries(storedCountries.map((c: string) => ({ label: c, value: c })));
    }, []);

    // Auto-set timeframe based on selected months
    useEffect(() => {
        if (selectedMonths.length === 0) {
            setSelectedTimeframes([]);
            return;
        }

        const hasH1 = selectedMonths.some(m => m <= 6); // Jan-Jun is H1
        const hasH2 = selectedMonths.some(m => m > 6);  // Jul-Dec is H2

        const newTimeframes = [];
        if (hasH1) newTimeframes.push('H1');
        if (hasH2) newTimeframes.push('H2');

        setSelectedTimeframes(newTimeframes);
    }, [selectedMonths]);

    const handleSubmit = () => {
        if (!selectedYear || !selectedMonths.length || !selectedTimeframes.length || 
            !selectedReviewTypes.length || !selectedCountries.length) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Hold up!',
                detail: 'Please select all the fields',
                life: 3000
            });
            return;
        }

        const newCombos: string[] = [];

        selectedMonths.forEach((month) => {
            selectedTimeframes.forEach((timeframe) => {
                // Only include combinations where month matches timeframe
                if ((timeframe === 'H1' && month <= 6) || (timeframe === 'H2' && month > 6)) {
                    selectedReviewTypes.forEach((review) => {
                        selectedCountries.forEach((country) => {
                            newCombos.push(`${selectedYear}-${month}-${timeframe}, ${review}-${country}`);
                        });
                    });
                }
            });
        });

        setCombinations((prev) => [...prev, ...newCombos]);
    };

    const handleSave = () => {
    // Get existing evaluations from localStorage
    const existingEvaluations = JSON.parse(localStorage.getItem('evaluationData') || '[]');
    
    // Combine existing evaluations with new combinations
    const updatedEvaluations = [...existingEvaluations, ...combinations];
    
    // Save the combined array back to localStorage
    localStorage.setItem('evaluationData', JSON.stringify(updatedEvaluations));
    
    toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Saved successfully ✅',
        life: 3000
    });
    
    // Clear current combinations after saving
    setCombinations([]);
};

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setSavedData(data);
        setShowDialog(true);
    };

    if (!isClient) {
        return null; // or loading spinner
    }

    return (
        <div className="p-4 card">
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
                        <Dropdown 
                            value={selectedYear} 
                            options={yearOptions} 
                            onChange={(e) => setSelectedYear(e.value)} 
                            className="w-full mt-2 p-1 text-lg" 
                            placeholder={yearOptions.length ? "Select Year" : "No years available"} 
                            disabled={yearOptions.length === 0}
                        />
                    </div>
                    <div className="md:col-4">
                        <label>Months</label>
                        <MultiSelect 
                            value={selectedMonths} 
                            options={monthOptions} 
                            onChange={(e) => setSelectedMonths(e.value)} 
                            className="w-full mt-2 h-12" 
                            placeholder="Select Months" 
                        />
                    </div>
                    <div className="md:col-4">
                        <label>Time Frame</label>
                        <MultiSelect 
                            value={selectedTimeframes} 
                            options={timeframeOptions} 
                            onChange={(e) => setSelectedTimeframes(e.value)} 
                            className="w-full mt-2" 
                            placeholder={timeframeOptions.length ? "Select Time Frame" : "No time Frames available"} 
                            disabled={selectedMonths.length > 0 || timeframeOptions.length === 0}
                        />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="md:col-4">
                        <label>Review Types</label>
                        <MultiSelect 
                            value={selectedReviewTypes} 
                            options={reviewTypes} 
                            onChange={(e) => setSelectedReviewTypes(e.value)} 
                            className="w-full mt-2" 
                            placeholder={reviewTypes.length ? "Select Review Types" : "No review types available"} 
                            disabled={reviewTypes.length === 0}
                        />
                    </div>
                    <div className="md:col-4">
                        <label>Countries</label>
                        <MultiSelect 
                            value={selectedCountries} 
                            options={countries} 
                            onChange={(e) => setSelectedCountries(e.value)} 
                            className="w-full mt-2" 
                            placeholder={countries.length ? "Select Countries" : "No countries available"} 
                            disabled={countries.length === 0}
                        />
                    </div>
                </div>

                <div className="col-12 flex justify-content-end">
                    <Button 
                        label="Submit" 
                        icon="pi pi-check" 
                        onClick={handleSubmit} 
                        disabled={!yearOptions.length || !timeframeOptions.length || 
                                 !reviewTypes.length || !countries.length}
                    />
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