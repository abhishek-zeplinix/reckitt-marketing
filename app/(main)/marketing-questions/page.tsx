'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';

const STORAGE_KEYS = {
    MARKETING_TEMPLATE_QUESTIONS: 'marketingTemplateQuestions'
};

const MarketingQuestionsTable = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [templateTypeFilter, setTemplateTypeFilter] = useState<string | null>(null);
    const [userGroupFilter, setUserGroupFilter] = useState<string | null>(null);
    const [reviewTypeFilter, setReviewTypeFilter] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS);
        if (saved) {
            setQuestions(JSON.parse(saved));
        }
    }, []);

    const handleCreateNavigation = () => {
        router.push('/marketing-questions/add-questions');
    };

    // Get unique filter options
    const templateTypeOptions = useMemo(() => {
        const set = new Set(questions.map((q) => q.templateType?.templateTypeName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);

    const userGroupOptions = useMemo(() => {
        const set = new Set(questions.map((q) => q.assessorGroup?.userGroupName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);

    const reviewTypeOptions = useMemo(() => {
        const set = new Set(questions.map((q) => q.reviewType?.reviewTypeName));
        return Array.from(set)
            .filter(Boolean)
            .map((name) => ({ label: name, value: name }));
    }, [questions]);

    // Apply filters
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            const matchesTemplate = !templateTypeFilter || q.templateType?.templateTypeName === templateTypeFilter;
            const matchesUserGroup = !userGroupFilter || q.assessorGroup?.userGroupName === userGroupFilter;
            const matchesReviewType = !reviewTypeFilter || q.reviewType?.reviewTypeName === reviewTypeFilter;
            return matchesTemplate && matchesUserGroup && matchesReviewType;
        });
    }, [questions, templateTypeFilter, userGroupFilter, reviewTypeFilter]);

    return (
        <div className="card">
            <div className="flex justify-content-between items-center mb-4">
                <h3>Marketing Template Questions</h3>
                <Button label="Add Questions" className="bg-primary-main border-primary-main hover:text-white" onClick={handleCreateNavigation} />
            </div>

            <div className="flex justify-content-between gap-3 mb-4">
                <div></div>
                <div className="flex gap-3">
                    <Dropdown value={templateTypeFilter} options={templateTypeOptions} onChange={(e) => setTemplateTypeFilter(e.value)} placeholder="Filter by Template Type" showClear className="w-full" />
                    <Dropdown value={userGroupFilter} options={userGroupOptions} onChange={(e) => setUserGroupFilter(e.value)} placeholder="Filter by User Group" showClear className="w-full" />
                    <Dropdown value={reviewTypeFilter} options={reviewTypeOptions} onChange={(e) => setReviewTypeFilter(e.value)} placeholder="Filter by Review Type" showClear className="w-full" />
                </div>
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
        </div>
    );
};

export default MarketingQuestionsTable;
