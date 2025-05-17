'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useAppContext } from '@/layout/AppWrapper';
import { InputText } from 'primereact/inputtext';
import { get } from 'lodash';

const defaultForm = {
    templateType: null,
    assessorGroup: null,
    reviewType: null,
    questionDescription: '',
    questionTitle: '',
    minRating: '',
    maxRating: '',
    isCompulsary: '',
    ratingComment: '',
    ratio: '',
    segment: ''
};

const TemplateQuestionPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const marketingTemplateQuestionId = searchParams.get('marketingTemplateQuestionId');
    const isEditMode = searchParams.get('edit') === 'true';
    const { setAlert, setLoading } = useAppContext();
    const [form, setForm] = useState<any>(defaultForm);

    const [reviewTypes, setReviewTypes] = useState<{ reviewTypeName: string, reviewTypeId: string }[]>([]);
    const [templateTypes, setTemplateTypes] = useState<{ templateTypeName: string, templateTypeId: string }[]>([]);
    const [assessorGroups, setAssessorGroups] = useState<{ assessorGroupName: string, assessorGroupId: string }[]>([]);

    const [compulsoryOptions] = useState([{ isCompulsary: 'yes' }, { isCompulsary: 'no' }]);

    useEffect(() => {
        setLoading(false);

        const loadData = () => {
            try {
                const storedReviewTypes = JSON.parse(localStorage.getItem('Review Type') || '[]');
                const reviewTypeOptions = storedReviewTypes.map((type: string, index: number) => ({
                    reviewTypeName: type,
                    reviewTypeId: index.toString()
                }));
                setReviewTypes(reviewTypeOptions);

                // If in edit mode, load the question to edit
                if (isEditMode && marketingTemplateQuestionId) {
                    const savedTemplateQuestions = JSON.parse(localStorage.getItem('marketingTemplateQuestions') || '[]');
                    const questionToEdit = savedTemplateQuestions.find(
                        (question: { id: string }) => question.id === marketingTemplateQuestionId
                    );

                    if (questionToEdit) {
                        setForm(questionToEdit);
                        // If review type is set, load corresponding template types
                        if (questionToEdit.reviewType) {
                            handleReviewTypeChange(questionToEdit.reviewType);
                        }
                        // If template type is set, load corresponding assessor groups
                        if (questionToEdit.reviewType && questionToEdit.templateType) {
                            handleTemplateTypeChange(questionToEdit.reviewType, questionToEdit.templateType);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
                setAlert('error', 'Failed to load form data');
            }
        };

        loadData();
    }, [isEditMode, marketingTemplateQuestionId]);

    const handleReviewTypeChange = (selectedReviewType: string) => {
        // Get template types for the selected review type from localStorage
        const storedTemplateTypes = JSON.parse(localStorage.getItem('Template Type') || '{}');
        const templateTypeOptions = storedTemplateTypes[selectedReviewType] || [];

        const formattedOptions = templateTypeOptions.map((type: string, index: number) => ({
            templateTypeName: type,
            templateTypeId: index.toString()
        }));

        setTemplateTypes(formattedOptions);
        // Reset dependent fields when review type changes
        setForm((prev: any) => ({
            ...prev,
            templateType: null,
            assessorGroup: null
        }));
        setAssessorGroups([]);
    };


    const handleTemplateTypeChange = (reviewType: string, templateType: string) => {
        // Get user groups for the selected review type and template type from localStorage
        const userGroups = JSON.parse(localStorage.getItem('User Group') || '{}');

        let userGroupOptions: { userGroupName: string, userGroupId: string }[] = [];

        try {
            // Get user groups for this review type and template type
            const userGroupNames = userGroups[reviewType]?.[templateType] || [];

            userGroupNames.forEach((group: string, index: number) => {
                userGroupOptions.push({
                    userGroupName: group,
                    userGroupId: `${group}-${index}`
                });
            });
        } catch (error) {
            console.error('Error parsing user groups:', error);
        }

        setAssessorGroups(userGroupOptions as any); // Still using assessorGroups state but now storing user groups
        // Reset selection when template type changes
        setForm((prev: any) => ({
            ...prev,
            assessorGroup: null
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        try {
            // Get existing questions from localStorage
            const existingQuestions = JSON.parse(localStorage.getItem('marketingTemplateQuestions') || '[]');

            if (isEditMode) {
                // Update existing question
                const updatedQuestions = existingQuestions.map((question: { id: string | null; }) =>
                    question.id === marketingTemplateQuestionId ? { ...form, id: marketingTemplateQuestionId } : question
                );
                localStorage.setItem('marketingTemplateQuestions', JSON.stringify(updatedQuestions));
            } else {
                // Add new question with a unique ID
                const newId = Date.now().toString();
                const newQuestion = { ...form, id: newId };
                localStorage.setItem('marketingTemplateQuestions', JSON.stringify([...existingQuestions, newQuestion]));
            }

            setAlert('success', `Marketing Templates ${isEditMode ? 'Updated' : 'Added'} Successfully`);
            router.push('/marketing-questions');
        } catch (error) {
            setAlert('error', 'Something went wrong!');
            console.error('Error saving data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (name: string, val: any) => {
        if (name === 'reviewType') {
            handleReviewTypeChange(val.reviewTypeName);
        } else if (name === 'templateType' && form.reviewType) {
            handleTemplateTypeChange(form.reviewType.reviewTypeName, val.templateTypeName);
        }

        setForm((prevForm: any) => ({
            ...prevForm,
            [name]: val
        }));
    };

    // Adjust title based on edit mode
    const pageTitle = isEditMode ? 'Edit Create Question' : 'Add Create Question';

    const renderStepContent = () => {
        return (
            <div>
                <div className="flex flex-column gap-2 pt-2">
                    <h2 className="text-center font-bold ">{pageTitle}</h2>
                    <div className="p-fluid grid mx-1 pt-2">
                        <div className="field col-3">
                            <label htmlFor="reviewType" className="font-semibold">
                                Review Type
                            </label>
                            <Dropdown
                                id="reviewType"
                                value={form.reviewType}
                                options={reviewTypes}
                                optionLabel="reviewTypeName"
                                onChange={(e) => onInputChange('reviewType', e.value)}
                                placeholder="Select Review Type"
                                className="w-full mb-1"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="templateType" className="font-semibold">
                                Template Type
                            </label>
                            <Dropdown
                                id="templateType"
                                value={form.templateType}
                                options={templateTypes}
                                optionLabel="templateTypeName"
                                onChange={(e) => onInputChange('templateType', e.value)}
                                placeholder="Select Template Type"
                                className="w-full mb-1"
                                disabled={!form.reviewType}
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="assessorGroup" className="font-semibold">
                                User Groups
                            </label>
                            <Dropdown
                                id="assessorGroup"
                                value={form.assessorGroup}
                                options={assessorGroups}
                                optionLabel="userGroupName" 
                                onChange={(e) => onInputChange('assessorGroup', e.value)}
                                placeholder="Select User Groups"
                                className="w-full mb-1"
                                disabled={!form.templateType}
                            />
                        </div>

                        {/* Rest of your form fields remain the same */}
                        <div className="field col-3">
                            <label htmlFor="questionTitle" className="font-semibold">
                                Question Title
                            </label>
                            <InputText id="questionTitle" type="text" value={form.questionTitle} onChange={(e) => onInputChange('questionTitle', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Question Title" required />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="questionDescription" className="font-semibold">
                                Question Description
                            </label>
                            <InputText
                                id="questionDescription"
                                type="text"
                                value={form.questionDescription}
                                onChange={(e) => onInputChange('questionDescription', e.target.value)}
                                className="p-inputtext w-full mb-1"
                                placeholder="Enter Question Description"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="minRating" className="font-semibold">
                                Min. Rating
                            </label>
                            <InputText id="minRating" value={form.minRating} type="text" onChange={(e) => onInputChange('minRating', e.target.value)} placeholder="Enter Min. Rating" className="p-inputtext w-full mb-1" />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="maxRating" className="font-semibold">
                                Max. Rating
                            </label>
                            <InputText id="maxRating" value={form.maxRating} type="text" onChange={(e) => onInputChange('maxRating', e.target.value)} placeholder="Enter Max. Rating" className="p-inputtext w-full mb-1" />
                        </div>

                        <div className="field col-3">
                            <label htmlFor="isCompulsary" className="font-semibold">
                                Compulsory
                            </label>
                            <Dropdown
                                id="isCompulsary"
                                value={form.isCompulsary}
                                options={compulsoryOptions}
                                optionLabel="isCompulsary"
                                onChange={(e) => onInputChange('isCompulsary', e.value)}
                                placeholder="Select Compulsory"
                                className="w-full mb-1"
                            />
                        </div>

                        <div className="field col-3">
                            <label htmlFor="ratingComment" className="font-semibold">
                                Comment if rating {'(>=)'}
                            </label>
                            <InputText
                                id="ratingComment"
                                type="text"
                                value={form.ratingComment}
                                onChange={(e) => onInputChange('ratingComment', e.target.value)}
                                className="p-inputtext w-full mb-1"
                                placeholder="Enter Comment if rating (Less than or Equal to)"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="segment" className="font-semibold">
                                Segment
                            </label>
                            <InputText id="segment" type="text" value={form.segment} onChange={(e) => onInputChange('segment', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Segment" />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="ratio" className="font-semibold">
                                Ratio (%)
                            </label>
                            <InputText id="ratio" type="text" value={form.ratio} onChange={(e) => onInputChange('ratio', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Ratio (%)" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="">
            <div className="p-card">
                <div className="p-card-body">{renderStepContent()}</div>
                <hr />
                <div className="p-card-footer flex justify-content-end px-4 gap-3 py-0 bg-slate-300 shadow-slate-400">
                    <Button label={isEditMode ? 'Update' : 'Submit'} icon="pi pi-check" className="bg-primary-main border-primary-main hover:text-white mb-3" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default TemplateQuestionPage;