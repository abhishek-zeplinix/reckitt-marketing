'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { DataTableExpandedRows } from 'primereact/datatable';
const STORAGE_KEYS = {
    MARKETING_TEMPLATE_QUESTIONS: 'marketingTemplateQuestions'
};

const MarketingDetails = () => {
    const [buOptions, setBuOptions] = useState<{ label: string; value: string }[]>([]);
    const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
    const [evaluationNames, setEvaluationNames] = useState<{ label: string; value: string }[]>([]);
    const [vendors, setVendors] = useState<{ label: string; value: string }[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
    


    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];
    const brands = [
        { label: 'Airwick', value: 'Airwick' },
        { label: 'Finish', value: 'Finish' },
        { label: 'Gaviscon', value: 'Gaviscon' }
    ];

    const userGroups = [
        { label: 'Global Marketing', value: 'Global Marketing' },
        { label: 'Local Marketing', value: 'Local Marketing' },
        { label: 'Procurement', value: 'Procurement' }
    ];

    const assessorGroups = [
        { label: 'Agency', value: 'Agency' },
        { label: 'Global Marketing', value: 'Global Marketing' },
        { label: 'Procurement', value: 'Procurement' }
    ];

    const templateTypes = [
        { label: 'Reckitt to Agency', value: 'Reckitt to Agency' },
        { label: 'Agency to Reckitt', value: 'Agency to Reckitt' }
    ];

    const [selectedEval, setSelectedEval] = useState<string | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [administrator, setAdministrator] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedBU, setSelectedBU] = useState<string | null>(null);
    const [selectedUserGroup, setSelectedUserGroup] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedAssessorGroup, setSelectedAssessorGroup] = useState<string | null>(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState<string | null>(null);

    const [comboList, setComboList] = useState<any[]>([]);
    const [savedCombos, setSavedCombos] = useState<any[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef<Toast>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS);
        if (saved) {
            setQuestions(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
    if (selectedTemplateType && questions.length > 0) {
        const mapped = questions.filter((q) => q.templateType.templateTypeName === selectedTemplateType);
        setFilteredQuestions(mapped);
        console.log('mapped',selectedTemplateType)

        // Load previously selected from local storage
        const saved = localStorage.getItem(`${STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS}_${selectedTemplateType}`);
        if (saved) {
            setSelectedQuestions(JSON.parse(saved));
        } else {
            setSelectedQuestions([]);
        }
    }
}, [selectedTemplateType, questions]);
    const handleQuestionToggle = (question: any) => {
    let updated;
    if (selectedQuestions.some((q) => q.id === question.id)) {
        updated = selectedQuestions.filter((q) => q.id !== question.id);
    } else {
        updated = [...selectedQuestions, question];
    }
    setSelectedQuestions(updated);
    localStorage.setItem(`${STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS}_${selectedTemplateType}`, JSON.stringify(updated));
};


    useEffect(() => {
        const getStoredValues = (key: string) => {
            const data = localStorage.getItem(key);
            if (!data) return [];
            try {
                return JSON.parse(data).map((item: any) => ({ label: item, value: item }));
            } catch {
                return [];
            }
        };
        setBuOptions(getStoredValues('BU'));
        setCountries(getStoredValues('Country'));
        // setBrands(getStoredValues('Brand'));
    }, []);

    useEffect(() => {
        const evals = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setEvaluationNames(evals.map((e: string) => ({ label: e, value: e })));

        const vendorsData = JSON.parse(localStorage.getItem('vendors') || '[]');
        setVendors(vendorsData.map((v: any) => ({ label: v.name, value: v.name })));
    }, []);

 const handleFinalSave = () => {
    if (
        !selectedEval || !selectedVendor || !administrator || !selectedCountry ||
        !selectedBU || !selectedStatus || !selectedBrand || !selectedAssessorGroup ||
        !selectedTemplateType
    ) {
        toast.current?.show({
            severity: 'warn',
            summary: 'Missing!',
            detail: 'Please fill out all fields',
            life: 3000
        });
        return;
    }

    if (selectedQuestions.length === 0) {
        toast.current?.show({
            severity: 'warn',
            summary: 'Missing!',
            detail: 'Please select at least one question',
            life: 3000
        });
        return;
    }

    const trimmedEval = selectedEval?.split(',')[0] || '';
    const evalWords = trimmedEval.trim().split(' ');
    const extractedEvalWord = evalWords[evalWords.length - 1] || '';
    const accountName = `${extractedEvalWord}-${selectedCountry}-${selectedBrand}`;

    const newCombo = {
        accountName,
        evaluation: selectedEval,
        vendor: selectedVendor,
        administrator,
        country: selectedCountry,
        bu: selectedBU,
        status: selectedStatus,
        brand: selectedBrand,
        assessorGroup: selectedAssessorGroup,
        templateType: selectedTemplateType,
        questions: selectedQuestions // ✅ Attach selected questions here
    };

    setComboList((prev) => [...prev, newCombo]);

    toast.current?.show({
        severity: 'success',
        summary: 'Success!',
        detail: 'Final combo saved successfully',
        life: 3000
    });
};
const rowExpansionTemplate = (data: any) => {
    return (
        <div className="p-4">
            <h5 className="font-bold mb-2">Mapped Questions:</h5>
            {data.questions && data.questions.length > 0 ? (
                
                    <DataTable value={data.questions} paginator rows={10} emptyMessage="No questions found">
                                    <Column field="segment" header="Segment" />
                                    <Column field="questionTitle" header="Question Title" />
                                    <Column field="questionDescription" header="Description" />
                                    <Column field="templateType.templateTypeName" header="Template Type ID" />
                                    <Column field="assessorGroup.assessorGroupName" header="Assessor Group ID" />
                                    <Column field="reviewType.reviewTypeName" header="Review Type ID" />
                                    <Column field="minRating" header="Min Rating" />
                                    <Column field="maxRating" header="Max Rating" />
                                    <Column field="isCompulsary.isCompulsary" header="Is Compulsory" />
                                    <Column field="ratingComment" header="Rating Comment" />
                                    <Column field="ratio" header="Ratio" />
                                    
                                </DataTable>
            ) : (
                <p>No questions mapped.</p>
            )}
        </div>
    );
};

console.log('comboList', comboList);

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('finalReviewData') || '[]');
        setSavedCombos(data);
        setShowDialog(true);
    };
 const groupedQuestions: any[] = [];
const sortedQuestions = [...filteredQuestions].sort((a, b) => a.segment.localeCompare(b.segment));

let lastSegment: string | null = null;
sortedQuestions.forEach((q) => {
    if (q.segment !== lastSegment) {
        groupedQuestions.push({ isGroupHeader: true, segment: q.segment });
        lastSegment = q.segment;
    }
    groupedQuestions.push(q);
});


const handleSegmentToggle = (segment: any) => {
    const segmentQuestions = sortedQuestions.filter(q => q.segment === segment);
    const allSelected = segmentQuestions.every(q => selectedQuestions.some(sq => sq.id === q.id));

    let newSelected;
    if (allSelected) {
        // Unselect all questions in the segment
        newSelected = selectedQuestions.filter(q => q.segment !== segment);
    } else {
        // Select all questions in the segment
        const newQuestions = segmentQuestions.filter(
            q => !selectedQuestions.some(sq => sq.id === q.id)
        );
        newSelected = [...selectedQuestions, ...newQuestions];
    }

    setSelectedQuestions(newSelected);
};


    return (
        <div className="p-4 card">
            <Toast ref={toast} />

            <Dialog
                header="Saved Final Combos"
                visible={showDialog}
                style={{ width: '60vw' }}
                onHide={() => setShowDialog(false)}
            >
                {comboList.length ? (
                    <DataTable
                value={comboList}
                dataKey="id" // Make sure each row in comboList has a unique `id`
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
                rowExpansionTemplate={rowExpansionTemplate}
            >

            <Column expander style={{ width: '3em' }} />
            <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '50px' }} />
            <Column field="accountName" header="Account Name" />
            <Column field="evaluation" header="Evaluation Name" />
            <Column field="vendor" header="Vendor" />
            <Column field="administrator" header="Administrator" />
            <Column field="country" header="Country" />
            <Column field="bu" header="BU" />
            <Column field="status" header="Status" />
            <Column field="brand" header="Brand" />
            <Column field="assessorGroup" header="Assessor Group" />
            <Column field="templateType" header="Template Type" />
        </DataTable>
    ) : (
        <p>No saved data found.</p>
    )}
</Dialog>

            <div className="flex justify-content-between items-center mb-4">
                <h2 className="text-xl font-semibold">Final Review Data</h2>
                <Button label="View Saved Combos" icon="pi pi-eye" onClick={handleViewSaved} />
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Evaluation Name</label>
                        <Dropdown value={selectedEval} options={evaluationNames} onChange={(e) => setSelectedEval(e.value)} className="w-full mt-2" placeholder="Select Evaluation" />
                    </div>
                    <div className="col-4">
                        <label>Vendor</label>
                        <Dropdown value={selectedVendor} options={vendors} onChange={(e) => setSelectedVendor(e.value)} className="w-full mt-2" placeholder="Select Vendor" />
                    </div>
                    <div className="col-4">
                        <label>Status</label>
                        <Dropdown value={selectedStatus} options={statusOptions} onChange={(e) => setSelectedStatus(e.value)} className="w-full mt-2" placeholder="Select Status" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Administrator</label>
                        <InputText value={administrator} onChange={(e) => setAdministrator(e.target.value)} className="w-full mt-2" placeholder="Enter Administrator" />
                    </div>
                    <div className="col-4">
                        <label>Country</label>
                        <Dropdown value={selectedCountry} options={countries} onChange={(e) => setSelectedCountry(e.value)} className="w-full mt-2" placeholder="Select Country" />
                    </div>
                    <div className="col-4">
                        <label>BU</label>
                        <Dropdown value={selectedBU} options={buOptions} onChange={(e) => setSelectedBU(e.value)} className="w-full mt-2" placeholder="Select BU" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Brand</label>
                        <Dropdown value={selectedBrand} options={brands} onChange={(e) => setSelectedBrand(e.value)} className="w-full mt-2" placeholder="Select Brand" />
                    </div>
                    <div className="col-4">
                        <label>Template Type</label>
                        <Dropdown value={selectedTemplateType} options={templateTypes} onChange={(e) => setSelectedTemplateType(e.value)} className="w-full mt-2" placeholder="Select Template Type" />
                    </div>
                    <div className="col-4">
                        <label>User Group</label>
                        <Dropdown value={selectedUserGroup} options={userGroups} onChange={(e) => setSelectedUserGroup(e.value)} className="w-full mt-2" placeholder="Select User Group" />
                    </div>
                    
                </div>
                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Assessor Group</label>
                        <Dropdown value={selectedAssessorGroup} options={assessorGroups} onChange={(e) => setSelectedAssessorGroup(e.value)} className="w-full mt-2" placeholder="Select Assessor Group" />
                    </div>
                    
                </div>
            </div>

            {selectedTemplateType && (
    <div className="mt-4">
        <h3>Mapped Questions</h3>
<DataTable value={groupedQuestions} rowClassName={(rowData) => rowData.isGroupHeader ? 'font-bold' : ''}>
    <Column
    header="Segment"
    body={(rowData) => {
        if (rowData.isGroupHeader) {
            const segmentQuestions = sortedQuestions.filter(q => q.segment === rowData.segment);
            const allSelected = segmentQuestions.every(q =>
                selectedQuestions.some(sq => sq.id === q.id)
            );

            return (
                <div className="flex items-center font-bold border-y bg-gray-100">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => handleSegmentToggle(rowData.segment)}
                        className="mr-2"
                    />
                    {rowData.segment}
                </div>
            );
        }

        return (
            <input
                type="checkbox"
                checked={selectedQuestions.some((q) => q.id === rowData.id)}
                onChange={() => handleQuestionToggle(rowData)}
            />
        );
    }}
    style={{ width: '200px' }}
/>


    <Column
        field="questionTitle"
        header="Question Title"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.questionTitle}
    />
    <Column
        field="questionDescription"
        header="Description"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.questionDescription}
    />
    <Column
        field="templateType.templateTypeName"
        header="Template Type"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.templateType?.templateTypeName}
    />
    <Column
        field="assessorGroup.assessorGroupName"
        header="Assessor Group"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.assessorGroup?.assessorGroupName}
    />
    <Column
        field="reviewType.reviewTypeName"
        header="Review Type"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.reviewType?.reviewTypeName}
    />
    <Column
        field="minRating"
        header="Min Rating"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.minRating}
    />
    <Column
        field="maxRating"
        header="Max Rating"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.maxRating}
    />
    <Column
        field="isCompulsary.isCompulsary"
        header="Is Compulsory"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.isCompulsary?.isCompulsary}
    />
    <Column
        field="ratingComment"
        header="Rating Comment"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.ratingComment}
    />
    <Column
        field="ratio"
        header="Ratio"
        body={(rowData) => rowData.isGroupHeader ? null : rowData.ratio}
    />
</DataTable>


         <Button
                    label="Save Final Combo"
                    icon="pi pi-save"
                    className="mt-4"
                    onClick={handleFinalSave}
                />
    </div>
)}

        </div>
    );
};

export default MarketingDetails;
