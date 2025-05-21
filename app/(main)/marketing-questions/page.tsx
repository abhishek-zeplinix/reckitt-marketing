'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { usePathname, useRouter } from 'next/navigation';
 
interface Question {
    question: string;
    ratings: string;
    openTextComment: string;
    trigger: string;
    userGroups: {
        agency: string;
        assetProduction: string;
    };
}
 
interface SegmentData {
    segment: string;
    questions: Question[];
}
 
// Your hardcoded JSON data - this represents the template data that would come from Excel
const TEMPLATE_DATA: SegmentData[] = [
    {
        segment: 'STRATEGY & PLANNING',
        questions: [
            {
                question: 'STRATEGIC PLANNING Client provides a clear and consistent strategic direction with relevant research and data as part of their briefs (open to do more research if needed).',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 2',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question:
                    'STRATEGIC GROWTH AUDIENCES Client provides clear target segments, growth audiences / the community(ies) the brand can disproportionately benefit and creative bullseye per brief and is open to new insights from Agency to drive growth with as part of its Fight and Superior Solutions.',
                ratings: '1 to 5, N/A',
                openTextComment: 'no',
                trigger: 'score 1, 3',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question: 'BEHAVIOUR CHANGE Client is clear on the trigger and motivations that will drive consumer behaviour change.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 4',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            }
        ]
    },
    {
        segment: 'CREATIVE EFFECTIVENESS',
        questions: [
            {
                question:
                    "CREATIVITY THAT DRIVES EFFECTIVENESS When briefed to deliver creative, Client greenlights breakthough ideas in line with Brand's Fight and/or its Superior Solutions worthy of being shortlisted or winning creative and/or effectiveness awards.",
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 5',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question: 'POSITVE PORTRAYAL IN COMMUNICATIONS Client provides clear guidance on representantion and portrayal ambitions as part of all projects.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 6',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question:
                    'MEDIA-AGNOSTIC IDEAS Client briefs request omnichannel creative ideas or include key channels based on audience and media strategy as part of the brief encouraging work that is activated across a variety of channels beyond TV.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 7',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            }
        ]
    },
    {
        segment: 'OMNI-CHANNEL THINKING',
        questions: [
            {
                question: 'OMNI CHANNEL THINKING Client sets up a cross functional team of experts to encourage multi-channel ideas.',
                ratings: '1 to 5, N/A',
                openTextComment: 'no',
                trigger: 'score 1, 8',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            }
        ]
    },
    {
        segment: 'PRODUCTION',
        questions: [
            {
                question: 'PRODUCTION Reckitt and its production director understand the creative ambition and is delivering production advice during the creative process that enables and enhances the creative execution potential.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 9',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question:
                    "SOW My Content Demand Management (CDM) is giving Agency the right day to day support, as well as providing Agency with the right project information (timing, output required, etc.) to plan Agency's resource in time to deliver high quality outcome, on time and inside the given target price. CDM and Marketing work in partnership with Agency bringing transparency early to enable corrective actions in case timings or target price cannot be achieved",
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 10',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question: 'ASSET REUSE Client is open to Agency suggestions on reusability for leveraging existing creative assets when applicable.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 11',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            }
        ]
    },
    {
        segment: 'CLIENT-AGENCY PARTNERSHIP',
        questions: [
            {
                question: 'BIC PROJECT MANAGEMENT (TIMING) Client gives Agency reasonable timelines at the start of the project and plays an active role in ensuring that project timelines are followed and/or adapting as work progresses.',
                ratings: '1 to 5, N/A',
                openTextComment: 'no',
                trigger: 'score 1, 12',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question: 'BIC PROJECT MANAGEMENT (BUDGET) Client is transparent about the assigned budget before work commences, and advises Agency when funding limitations can affect ongoing projects.',
                ratings: '1 to 5, N/A',
                openTextComment: 'no',
                trigger: 'score 1, 13',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            },
            {
                question: 'OPEN AND TRANSPARENT RELATIONSHIP Client encourages meaningful partnership and collaboration, throughout the comms development and production process.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 14',
                userGroups: {
                    agency: 'Yes',
                    assetProduction: 'No'
                }
            }
        ]
    },
    {
        segment: 'COPPOLA',
        questions: [
            {
                question:
                    'PRODUCTION DIRECTOR (A) Production Director is an active part of the agency briefing, having worked closely with their Brand team counterparts to ensure the brief has clear objectives, a production budget and outlines outcome expecations and actionable recommendations to maximize creativity.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 15',
                userGroups: {
                    agency: 'No',
                    assetProduction: 'Yes'
                }
            },
            {
                question: 'PRODUCTION DIRECTOR (B) My Production Director advises accurate production budget that is sufficient for the creative ambition with time manner',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 16',
                userGroups: {
                    agency: 'No',
                    assetProduction: 'Yes'
                }
            },
            {
                question: 'PRODUCTION DIRECTOR (C) Production Director involves in key stages of process to ensure creative ambition delivered accurate, high-quality of work and the agreed number of deliverables within awarded package.',
                ratings: '1 to 5, N/A',
                openTextComment: 'yes',
                trigger: 'score 1, 17',
                userGroups: {
                    agency: 'No',
                    assetProduction: 'Yes'
                }
            }
        ]
    }
];
 
const STORAGE_KEYS = {
    MARKETING_TEMPLATE_QUESTIONS: 'marketingTemplateQuestions',
    UPLOADED_TEMPLATE_DATA: 'uploadedTemplateData'
};
 
const TEMPLATE_TYPE_OPTIONS = [
    { label: 'Reckitt to Agency', value: 'Reckitt to Agency' },
    { label: 'Agency to Reckitt', value: 'Agency to Reckitt' },
    { label: 'Reckitt self to Agency', value: 'Reckitt self to Agency' },
    { label: 'Agency self to Reckitt', value: 'Agency self to Reckitt' }
];
 
const MarketingQuestionsTable = () => {
    const [questions, setQuestions] = useState([]);
    const [templateTypeFilter, setTemplateTypeFilter] = useState(null);
    const [userGroupFilter, setUserGroupFilter] = useState(null);
    const [reviewTypeFilter, setReviewTypeFilter] = useState(null);
    const [showUploadedData, setShowUploadedData] = useState(false);
    const [uploadedTemplateData, setUploadedTemplateData] = useState<SegmentData[]>([]);
    const [isUploadDialogVisible, setIsUploadDialogVisible] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState('Agency to Reckitt');
    const fileInputRef = useRef(null);
    const toast = useRef<Toast>(null);
 
    const router = useRouter();
 
    useEffect(() => {
        // Load questions from localStorage if they exist
        const saved = localStorage.getItem(STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS);
        if (saved) {
            setQuestions(JSON.parse(saved));
        }
 
        // Check if there's previously uploaded template data
        const savedTemplateData = localStorage.getItem(STORAGE_KEYS.UPLOADED_TEMPLATE_DATA);
        if (savedTemplateData) {
            setUploadedTemplateData(JSON.parse(savedTemplateData));
            setShowUploadedData(false); // Changed from true to false
        }
    }, []);
 
    const handleCreateNavigation = () => {
        router.push('/marketing-questions/add-questions');
    };
 
    const openUploadDialog = () => {
        setIsUploadDialogVisible(true);
    };
 
    const closeUploadDialog = () => {
        setIsUploadDialogVisible(false);
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
    };
 
    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };
 
    const simulateUpload = () => {
        if (!selectedFile) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a file to upload',
                life: 3000
            });
            return;
        }
 
        setIsUploading(true);
        setUploadProgress(0);
 
        // Simulate progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                const newProgress = prev + Math.floor(Math.random() * 15) + 5;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, 300);
 
        // After "completion"
        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);
 
            // Save template data to localStorage
            localStorage.setItem(STORAGE_KEYS.UPLOADED_TEMPLATE_DATA, JSON.stringify(TEMPLATE_DATA));
            setUploadedTemplateData(TEMPLATE_DATA);
 
            // Finish upload process
            setTimeout(() => {
                setIsUploading(false);
                setShowUploadedData(true); // Changed from setShowUploadedTable
                closeUploadDialog();
 
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Template uploaded successfully!',
                    life: 3000
                });
            }, 500);
        }, 2000);
    };
 
    const templateTypeOptions = useMemo(() => {
        const set = new Set((questions as any[]).map((q) => q.templateType?.templateTypeName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);
 
    const userGroupOptions = useMemo(() => {
        const set = new Set((questions as any[]).map((q) => q.assessorGroup?.userGroupName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);
 
    const reviewTypeOptions = useMemo(() => {
        const set = new Set((questions as any[]).map((q) => q.reviewType?.reviewTypeName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);
 
    const filteredQuestions = useMemo(() => {
        return (questions as any[]).filter((q) => {
            const matchesTemplate = !templateTypeFilter || q.templateType?.templateTypeName === templateTypeFilter;
            const matchesUserGroup = !userGroupFilter || q.assessorGroup?.userGroupName === userGroupFilter;
            const matchesReviewType = !reviewTypeFilter || q.reviewType?.reviewTypeName === reviewTypeFilter;
            return matchesTemplate && matchesUserGroup && matchesReviewType;
        });
    }, [questions, templateTypeFilter, userGroupFilter, reviewTypeFilter]);
 
    const uploadDialogFooter = (
        <div className="mt-2 mb-2">
            <Button label="Cancel" className="p-button-text" onClick={closeUploadDialog} disabled={isUploading} />
            <Button label="Upload" icon="pi pi-upload" className="p-button-success" onClick={simulateUpload} disabled={!selectedFile || isUploading} />
        </div>
    );
 
    return (
        <div className="card">
            <Toast ref={toast} />
 
            <div className="flex justify-content-between items-center mb-4">
                <h3>Marketing Template Questions</h3>
                <div className="flex gap-2">
                    <Button
                        label="Add Questions"
                        icon="pi pi-plus"
                        className="bg-white border-primary-main text-red-600"
                        onClick={() => {
                            setShowUploadedData(false);
                            handleCreateNavigation();
                        }}
                    />
                    <Button label="Upload Template" icon="pi pi-upload" className="" onClick={openUploadDialog} />
                </div>
            </div>
            <hr className="my-4" /> 
 
            {/* Regular Questions Table - Only shown when uploaded table is not visible */}
            {!showUploadedData && (
                <>
                    <div className="flex justify-content-start gap-3 mb-4">
                        <Dropdown value={templateTypeFilter} options={templateTypeOptions} onChange={(e) => setTemplateTypeFilter(e.value)} placeholder="Filter by Template Type" showClear />
                        <Dropdown value={userGroupFilter} options={userGroupOptions} onChange={(e) => setUserGroupFilter(e.value)} placeholder="Filter by User Group" showClear />
                        <Dropdown value={reviewTypeFilter} options={reviewTypeOptions} onChange={(e) => setReviewTypeFilter(e.value)} placeholder="Filter by Review Type" showClear />
                    </div>
 
                    <DataTable value={filteredQuestions} paginator rows={10} emptyMessage="No questions found">
                        <Column field="questionTitle" header="Question Title" />
                        <Column field="questionDescription" header="Description" />
                        <Column field="templateType.templateTypeName" header="Template Type" />
                        <Column field="assessorGroup.userGroupName" header="User Group" />
                        <Column field="reviewType.reviewTypeName" header="Review Type" />
                        <Column field="minRating" header="Min Rating" />
                        <Column field="maxRating" header="Max Rating" />
                        <Column field="isCompulsary.isCompulsary" header="Is Compulsory" />
                        <Column field="ratingComment" header="Rating Comment" />
                        <Column field="ratio" header="Ratio" />
                        <Column field="segment" header="Segment" />
                    </DataTable>
                </>
            )}
 
            {/* Upload Dialog */}
            <Dialog header="Upload Template" visible={isUploadDialogVisible} style={{ width: '500px' }} footer={uploadDialogFooter} onHide={closeUploadDialog} closable={!isUploading}>
                <div className=" gap-4">
                    <label htmlFor="fileUpload" className="font-medium">
                            Template Type
                        </label>
                    <div className="flex justify-content-between align-items-center mb-4 mt-2">
                        <Dropdown
                            value={selectedTemplateType}
                            options={TEMPLATE_TYPE_OPTIONS}
                            onChange={(e) => setSelectedTemplateType(e.value)}
                            placeholder="Select Template Type"
                            className="w-full md:w-14rem"
                        />
                    </div>
 
                    <div className=" gap-2">
                        <label htmlFor="fileUpload" className="font-medium">
                            Select Excel Template
                        </label>
                        <input ref={fileInputRef} type="file" id="fileUpload" accept=".xlsx, .xls" onChange={handleFileChange} disabled={isUploading} className="border p-2 rounded" />
                    </div>
 
                    {isUploading && (
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Upload Progress</label>
                            <ProgressBar value={uploadProgress} showValue={true} />
                            <p className="text-center text-blue-600">{uploadProgress < 100 ? 'Uploading...' : 'Processing template...'}</p>
                        </div>
                    )}
                </div>
            </Dialog>
 
            {/* Uploaded Template Data Table - Only shown when showUploadedData is true */}
            {showUploadedData && (
                <div>
                    <h1 className="text-xl font-semibold mb-2  p-2 rounded">{selectedTemplateType}</h1>
 
                    {uploadedTemplateData.map((segmentData, idx) => (
                        <div key={idx} className="mb-6 border rounded  bg-gray-50">
                            <h5 className="text-lg font-semibold  px-2 rounded">{segmentData.segment}</h5>
                            <DataTable value={segmentData.questions} className="mb-4">
                                <Column field="question" header="Question" style={{ width: '40%' }} />
                                <Column field="ratings" header="Ratings" style={{ width: '10%' }} />
                                <Column field="openTextComment" header="Compulsory" style={{ width: '10%' }} />
                                <Column field="trigger" header="If Yes what is the trigger" style={{ width: '15%' }} />
                                <Column field="userGroups.agency" header="Agency" style={{ width: '10%' }} />
                                <Column field="userGroups.assetProduction" header="Asset Production" style={{ width: '10%' }} />
                            </DataTable>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
 
export default MarketingQuestionsTable;
 
 