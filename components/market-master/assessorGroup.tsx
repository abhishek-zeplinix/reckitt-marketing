'use client';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect, useState } from 'react';
import SubmitResetButtons from '../control-tower/submit-reset-buttons';
import { DeleteCall, GetCall, PostCall, PutCall } from '@/app/api-config/ApiKit';
import { useAppContext } from '@/layout/AppWrapper';
import CustomDataTable from '../CustomDataTable';
import { buildQueryParams, getRowLimitWithScreenHeight } from '@/utils/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { LayoutContext } from '@/layout/context/layoutcontext';
import TableSkeletonSimple from '../skeleton/TableSkeletonSimple';
import { useMarketingMaster } from '@/layout/context/marketingMasterContext';
import { useZodValidation } from '@/hooks/useZodValidation';
import { reviewTypeSchema } from '@/utils/validationSchemas';

const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    DELETE: 'delete'
};

const AddAssessorGroup = () => {
    const [templateTypesList, setTemplateTypesList] = useState<any>([]);
    const [userGroupsList, setUserGroupsList] = useState<any>([]);
    const [assessorGroup, setAssessorGroup] = useState<any>('');
    const [reviewTypeId, setReviewTypeId] = useState<any>('');
    const [templateTypeId, setTemplateTypeId] = useState<any>('');
    const [userGroupId, setUserGroupId] = useState<any>('');
    const [assessorGroupList, setAssessorGroupList] = useState<any>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const [totalRecords, setTotalRecords] = useState<any>();
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<any>(false);
    const [selectedAssessorGroupId, setSelectedAssessorGroupId] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { layoutState } = useContext(LayoutContext);
    const { setAlert, setLoading, isLoading } = useAppContext();
    const { reviewTypesList, loading } = useMarketingMaster();
    const { error: assessorGroupError, validate: validateAssessorGroup, resetError } = useZodValidation(reviewTypeSchema);

    useEffect(() => {
        if (reviewTypeId) {
            fetchAssessorGroups();
        } else {
            setAssessorGroupList([]);
            setTotalRecords(0);
        }
    }, [reviewTypeId, templateTypeId, userGroupId]);

    // Fetch template types when review type is selected
    const fetchTemplateTypes = async (reviewTypeId: any) => {
        if (!reviewTypeId) {
            setTemplateTypesList([]);
            return;
        }

        setLoading(true);

        const params = { filters: { reviewTypeId }, pagination: false};
        const queryString = buildQueryParams(params);
        try {
            const response = await GetCall(`/mrkt/api/mrkt/templateType?${queryString}`);
            setTemplateTypesList(response.data || []);
        } catch (err) {
            setAlert('error', 'Failed to fetch template types!');
            setTemplateTypesList([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user groups when template type is selected
    const fetchUserGroups = async (templateTypeId: any) => {
        if (!templateTypeId || !reviewTypeId) {
            setUserGroupsList([]);
            return;
        }

        setLoading(true);

        const params = { filters: { reviewTypeId, templateTypeId }, pagination: false};
        const queryString = buildQueryParams(params);
        try {
            const response = await GetCall(`/mrkt/api/mrkt/user-group?${queryString}`);
            setUserGroupsList(response.data || []);
        } catch (err) {
            setAlert('error', 'Failed to fetch user groups!');
            setUserGroupsList([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch assessor groups for selected filters
    const fetchAssessorGroups = async (params?: any) => {
        if (!reviewTypeId) return;

        setLoading(true);
        if (!params) {
         params = {limit: limit, page: page, filters: { reviewTypeId, templateTypeId, userGroupId }, sortOrder: "desc", sortBy: "assessorGroupId" };
        }else{
            params.filters = { reviewTypeId, templateTypeId, userGroupId };
            params.sortOrder = "desc";
            params.sortBy = "assessorGroupId";
        }
        setPage(params.page);
        const queryString = buildQueryParams(params);

        try {
            const response = await GetCall(`/mrkt/api/mrkt/marketingAssessorGroup?${queryString}`);
            setAssessorGroupList(response.data || []);
            setTotalRecords(response.total || 0);
        } catch (err) {
            setAlert('error', 'Failed to fetch assessor groups!');
            setAssessorGroupList([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateAssessorGroup(assessorGroup)) return;

        if (!reviewTypeId) {
            setAlert('error', 'Please select a Review Type!');
            return;
        }

        if (!templateTypeId) {
            setAlert('error', 'Please select a Template Type!');
            return;
        }

        if (!userGroupId) {
            setAlert('error', 'Please select a User Group!');
            return;
        }

        if (!assessorGroup.trim()) {
            setAlert('error', 'Please enter an Assessor Group!');
            return;
        }

        setLoading(true);

        if (isEditMode) {
            try {
                const payload = {
                    assessorGroupName: assessorGroup,
                };
                const response = await PutCall(`/mrkt/api/mrkt/marketingAssessorGroup/${selectedAssessorGroupId}/templateType/${templateTypeId}/reviewType/${reviewTypeId}/userGroup/${userGroupId}`, payload);

                if (response.code.toLowerCase() === 'success') {
                    setAlert('success', 'Assessor Group successfully updated!');
                    resetInput();
                    fetchAssessorGroups();
                }else{
                     setAlert('error', response.error || 'Something went wrong!');
                }
            } catch (err) {
                setAlert('error', 'Something went wrong!');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const payload = { assessorGroupName: assessorGroup };
                const response = await PostCall(`/mrkt/api/mrkt/marketingAssessorGroup/templateType/${templateTypeId}/reviewType/${reviewTypeId}/userGroup/${userGroupId}`, payload);

                if (response.code.toLowerCase() === 'success') {
                    setAlert('success', 'Assessor Group successfully added!');
                    resetInput();
                    fetchAssessorGroups();
                }else{
                    setAlert('error', response.error || 'Something went wrong!');
                }
            } catch (err) {
                setAlert('error', 'Something went wrong!');
            } finally {
                setLoading(false);
            }
        }
    };

    const onDelete = async () => {
        setLoading(true);

        try {
            const response = await DeleteCall(`/mrkt/api/mrkt/marketingAssessorGroup/${selectedAssessorGroupId}`);

            if (response.code.toLowerCase() === 'success') {
                fetchAssessorGroups();
                closeDeleteDialog();
                setAlert('success', 'Assessor Group successfully deleted!');
            } else {
                 setAlert('error', response.error || 'Something went wrong!');
                closeDeleteDialog();
            }
        } catch (error) {
            setAlert('error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const resetInput = () => {
        setAssessorGroup('');
        setIsEditMode(false);
        resetError();
    };

    const openDeleteDialog = (items: any) => {
        setIsDeleteDialogVisible(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
    };

    const onRowSelect = async (item: any, action: any) => {
        if (action === ACTIONS.DELETE) {
            openDeleteDialog(item);
            setSelectedAssessorGroupId(item.assessorGroupId);
        }

        if (action === ACTIONS.EDIT) {
            setAssessorGroup(item.assessorGroupName);
            setReviewTypeId(item.reviewTypeId);
            setTemplateTypeId(item.templateTypeId);
            setUserGroupId(item.userGroupId);
            setSelectedAssessorGroupId(item.assessorGroupId);

            // Fetch dependent dropdowns for the selected review type
            await fetchTemplateTypes(item.reviewTypeId);
            await fetchUserGroups(item.templateTypeId);
            setIsEditMode(true);
        }
    };

    const handleReviewTypeChange = async (value: any) => {
        setReviewTypeId(value);
        setTemplateTypeId('');
        setUserGroupId('');
        setAssessorGroupList([]);
        setTotalRecords(0);

        if (value) {
            await fetchTemplateTypes(value);
        } else {
            setTemplateTypesList([]);
            setUserGroupsList([]);
            setAssessorGroupList([]);
            setTotalRecords(0);
        }
    };

    const handleTemplateTypeChange = async (value: any) => {
        setTemplateTypeId(value);
        setUserGroupId('');
        setAssessorGroupList([]);
        setTotalRecords(0);

        if (value && reviewTypeId) {
            await fetchUserGroups(value);
        } else {
            setUserGroupsList([]);
            setAssessorGroupList([]);
            setTotalRecords(0);
        }
    };

    const handleUserGroupChange = (value: any) => {
        setUserGroupId(value);
        setAssessorGroupList([]);
        setTotalRecords(0);
    };

    const reviewTypeOptions = reviewTypesList?.map((reviewType: any) => ({
        label: reviewType.reviewTypeName || '',
        value: reviewType.reviewTypeId || ''
    })) || [];

    const templateTypeOptions = templateTypesList?.map((templateType: any) => ({
        label: templateType.templateTypeName || '',
        value: templateType.templateTypeId || ''
    })) || [];

    const userGroupOptions = userGroupsList?.map((userGroup: any) => ({
        label: userGroup.userGroupName || '',
        value: userGroup.userGroupId || ''
    })) || [];

    return (
        <>
            <div className="flex flex-wrap justify-center items-center gap-2">
                <div className="flex flex-column gap-2">
                    <label htmlFor="reviewType">Review Type <span style={{ color: 'red' }}>*</span></label>
                    <Dropdown
                        id="reviewType"
                        value={reviewTypeId}
                        options={reviewTypeOptions}
                        onChange={(e) => handleReviewTypeChange(e.value)}
                        placeholder="Select Review Type"
                        className="w-full sm:w-30rem"
                        filter
                        showClear
                        disabled={loading}
                    />
                    <small>
                        <i>Select a Review Type for the assessor group.</i>
                    </small>
                </div>

                {reviewTypeId && (
                    <div className="flex flex-column gap-2">
                        <label htmlFor="templateType">Template Type <span style={{ color: 'red' }}>*</span></label>
                        <Dropdown
                            id="templateType"
                            value={templateTypeId}
                            options={templateTypeOptions}
                            onChange={(e) => handleTemplateTypeChange(e.value)}
                            placeholder="Select Template Type"
                            className="w-full sm:w-30rem"
                            filter
                            showClear
                            disabled={loading || !reviewTypeId}
                        />
                        <small>
                            <i>Select a Template Type for the assessor group.</i>
                        </small>
                    </div>
                )}

                {templateTypeId && (
                    <div className="flex flex-column gap-2">
                        <label htmlFor="userGroup">User Group <span style={{ color: 'red' }}>*</span></label>
                        <Dropdown
                            id="userGroup"
                            value={userGroupId}
                            options={userGroupOptions}
                            onChange={(e) => handleUserGroupChange(e.value)}
                            placeholder="Select User Group"
                            className="w-full sm:w-30rem"
                            filter
                            showClear
                            disabled={loading || !templateTypeId}
                        />
                        <small>
                            <i>Select a User Group for the assessor group.</i>
                        </small>
                    </div>
                )}

                {userGroupId && (
                    <div className="flex flex-column gap-2">
                        <label htmlFor="assessorGroup">Assessor Group <span style={{ color: 'red' }}>*</span></label>
                        <InputText
                            id="assessorGroup"
                            aria-label="Add Assessor Group"
                            value={assessorGroup}
                            onChange={(e) => setAssessorGroup(e.target.value)}
                            className="w-full sm:w-30rem"
                            placeholder="Enter Assessor Group"
                        />
                        {assessorGroupError ? (
                            <small className="p-error">{assessorGroupError}</small>
                        ) : <small>
                            <i>Enter an Assessor Group you want to add.</i>
                        </small>}
                    </div>
                )}
            </div>

            {userGroupId && (
                <SubmitResetButtons
                    onSubmit={handleSubmit}
                    label={isEditMode ? 'Update Assessor Group' : 'Add Assessor Group'}
                    loading={isLoading}
                />
            )}

            {reviewTypeId && (
                <div className="mt-4">
                    {isLoading ? (
                        <TableSkeletonSimple columns={5} rows={5} />
                    ) : (
                        <CustomDataTable
                            ref={assessorGroupList}
                            page={page}
                            limit={limit}
                            totalRecords={totalRecords}
                            isView={false}
                            isEdit={true}
                            isDelete={true}
                            data={assessorGroupList?.map((item: any) => ({
                                assessorGroupId: item?.assessorGroupId,
                                assessorGroupName: item?.assessorGroupName,
                                reviewTypeId: item?.reviewTypeId,
                                templateTypeId: item?.templateTypeId,
                                userGroupId: item?.userGroupId,
                                reviewTypeName: item?.reviewType?.reviewTypeName || 'N/A',
                                templateTypeName: item?.templateType?.templateTypeName || 'N/A',
                                userGroupName: item?.userGroup?.userGroupName || 'N/A'
                            }))}
                            columns={[
                                {
                                    header: 'Sr. No.',
                                    body: (data: any, options: any) => {
                                        const normalizedRowIndex = options.rowIndex % limit;
                                        const srNo = (page - 1) * limit + normalizedRowIndex + 1;
                                        return <span>{srNo}</span>;
                                    },
                                    bodyStyle: { minWidth: 50, maxWidth: 50 }
                                },
                                {
                                    header: 'Review Type',
                                    field: 'reviewTypeName',
                                    filter: true,
                                    bodyStyle: { minWidth: 150, maxWidth: 200 },
                                    filterPlaceholder: 'Review Type'
                                },
                                {
                                    header: 'Template Type',
                                    field: 'templateTypeName',
                                    filter: true,
                                    bodyStyle: { minWidth: 150, maxWidth: 200 },
                                    filterPlaceholder: 'Template Type'
                                },
                                {
                                    header: 'User Group',
                                    field: 'userGroupName',
                                    filter: true,
                                    bodyStyle: { minWidth: 150, maxWidth: 200 },
                                    filterPlaceholder: 'User Group'
                                },
                                {
                                    header: 'Assessor Group',
                                    field: 'assessorGroupName',
                                    filter: true,
                                    bodyStyle: { minWidth: 150, maxWidth: 200 },
                                    filterPlaceholder: 'Assessor Group'
                                }
                            ]}
                            onLoad={(params: any) => fetchAssessorGroups(params)}
                            onDelete={(item: any) => onRowSelect(item, 'delete')}
                            onEdit={(item: any) => onRowSelect(item, 'edit')}
                        />
                    )}
                </div>
            )}

            <Dialog
                header="Delete confirmation"
                visible={isDeleteDialogVisible}
                style={{ width: layoutState.isMobile ? '90vw' : '50vw' }}
                className="delete-dialog"
                footer={
                    <div className="flex justify-content-center p-2">
                        <Button label="Cancel" style={{ color: '#DF1740' }} className="px-7" text onClick={closeDeleteDialog} />
                        <Button label="Delete" style={{ backgroundColor: '#DF1740', border: 'none' }} className="px-7 hover:text-white" onClick={onDelete} loading={isLoading} />
                    </div>
                }
                onHide={closeDeleteDialog}
            >
                <div className="flex flex-column w-full surface-border p-2 text-center gap-4">
                    <i className="pi pi-info-circle text-6xl" style={{ marginRight: 10, color: '#DF1740' }}></i>
                    <div className="flex flex-column align-items-center gap-1">
                        <span>Are you sure you want to delete this Assessor Group? </span>
                        <span>This action cannot be undone. </span>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default AddAssessorGroup;