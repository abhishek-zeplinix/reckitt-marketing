/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import CustomDataTable, { CustomDataTableRef } from '@/components/CustomDataTable';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { buildQueryParams, getRowLimitWithScreenHeight } from '@/utils/utils';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { useAppContext } from '@/layout/AppWrapper';
import { DeleteCall, GetCall, PostCall } from '@/app/api-config/ApiKit';
import { CustomResponse, Rules, SetRulesDir } from '@/types';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
// import { useLoaderContext } from '@/layout/context/LoaderContext';
import { RadioButton } from 'primereact/radiobutton';
import TableSkeletonSimple from '@/components/skeleton/TableSkeletonSimple';
import { limitOptions } from '@/utils/constant';

const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    DELETE: 'delete'
};

const UserGroups = () => {
    const router = useRouter();
    const { layoutState } = useContext(LayoutContext);
    const [isShowSplit, setIsShowSplit] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const dataTableRef = useRef<CustomDataTableRef>(null);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const [rules, setRules] = useState<SetRulesDir[]>([]);
    const [userGroups, setuserGroups] = useState<[]>([]);
    const [totalRecords, setTotalRecords] = useState();
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [selectedRuleSetId, setSelectedRuleSetId] = useState<any>([]);
    const [action, setAction] = useState(null);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isAllDeleteDialogVisible, setIsAllDeleteDialogVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [procurementCategories, setprocurementCategories] = useState([]);
    const [filterCategories, setCategories] = useState([]);
    const [supplierDepartment, setSupplierDepartment] = useState([]);
    const [rulesGroup, setRulesGroup] = useState('');
    const [selectedglobalSearch, setGlobalSearch] = useState('');
    const [SelectedSubCategory, setSelectedSubCategory] = useState('');
    const [chooseRules, setChooseRules] = useState('');
    const [selectedRuleType, setSelectedRuleType] = useState<string | null>(null);
    // const [isValid, setIsValid] = useState(true);
    // const { loader } = useLoaderContext();
    // const { loader, setLoader } = useLoaderContext();

    const ruleTypeOptions = [
        { label: 'CAPA RULE', value: 'capa rule' },
        { label: 'MAIN RULE', value: 'main rule' }
    ];
    // Handle limit change
    // const onCategorychange = (e: any) => {
    //     setSelectedCategory(e.value); // Update limit
    //     // fetchprocurementCategories(e.value);
    //     fetchData({
    //         limit: limit,
    //         page: page,
    //         include: 'subCategories,categories,department',
    //         filters: {
    //             categoryId: e.value
    //         }
    //     });
    // };
    // // Handle limit change
    // const onDepartmentChange = (e: any) => {
    //     setSelectedDepartment(e.value);
    //     fetchData({
    //         limit: limit,
    //         page: page,
    //         include: 'subCategories,categories,department',
    //         filters: {
    //             departmentId: e.value
    //         }
    //     });
    // };
    // // Handle limit change
    // const onSubCategorychange = (e: any) => {
    //     setSelectedSubCategory(e.value); // Update limit
    //     fetchData({
    //         limit: limit,
    //         page: page,
    //         include: 'subCategories,categories,department',
    //         filters: {
    //             subCategoryId: e.value
    //         }
    //     });
    // };
    const onGlobalSearch = (e: any) => {
        setGlobalSearch(e.target?.value); // Update limit
        fetchData({ limit: limit, page: page, include: 'subCategories,categories,department', search: e.target?.value });
    };

    // Handle limit change
    const onLimitChange = (e: any) => {
        setLimit(e.value); // Update limit
        fetchData({ limit: e.value, page: 1, include: 'subCategories,categories,department' }); // Fetch data with new limit
    };
    useEffect(() => {
        fetchData();
        // fetchsupplierCategories();
        // fetchsupplierDepartment();
    }, [limit, page]);
    // const handleCreateNavigation = () => {
    //     router.push('/manage-rules/create-new-rules');
    // };

    const handleFileUpload = async (event: { files: File[] }) => {
        const file = event.files[0]; // Retrieve the uploaded file
        if (!file) {
            setAlert('error', 'Please select a file to upload.');
            return;
        }

        if (!date) {
            setAlert('error', 'Please enter a valid date.');
            return;
        }

        if (!rulesGroup) {
            setAlert('error', 'Please enter a valid name for the Rules Group.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        formData.append('effectiveFrom', formatDate(date)); // Add formatted date
        formData.append('set', rulesGroup); // Add rules group name

        // Determine API endpoint based on selected rule type
        const apiEndpoint = chooseRules === 'Capa Rules' ? '/company/caparule/bulk/capa-rules' : '/company/bulk-rules';

        setIsDetailLoading(true);
        try {
            // Use the existing PostCall function
            const response: CustomResponse = await PostCall(apiEndpoint, formData);

            setIsDetailLoading(false);

            if (response.code === 'SUCCESS') {
                setAlert('success', 'Rules imported successfully');
                setVisible(false);
                fetchData();
            } else {
                setAlert('error', response.message || 'File upload failed');
            }
        } catch (error) {
            setIsDetailLoading(false);
            console.error('An error occurred during file upload:', error);
            setAlert('error', 'An unexpected error occurred during file upload');
        }
    };

    const handleEditRules = (e: any) => {
        if (e.ruleType === 'MAIN RULE') {
            router.push(`/user-groups/manage-members`);
        } else {
            router.push(`/user-groups/manage-members`);
        }
    };

    const { isLoading, setLoading, setAlert } = useAppContext();

    const dialogHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center w-full">
                <span>Choose your file</span>
                <Button
                    label="Download Sample PDF"
                    icon="pi pi-download"
                    className="p-button-text p-button-sm text-primary-main"
                    onClick={() => {
                        // Trigger PDF download
                        const link = document.createElement('a');
                        link.href = '/path-to-your-pdf.pdf'; // Replace with the actual path to your PDF
                        link.download = 'example.pdf'; // Replace with the desired file name
                        link.click();
                    }}
                />
            </div>
        );
    };
    const handleCreateNavigation = () => {
        router.push('user-groups/create-user-group'); // Replace with the actual route for adding a new user
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left flex align-items-center">
                    <h3 className="mb-0">Manage User Groups</h3>
                </span>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-plus" size="small" label="Add Vendor" aria-label="Import Vendors" className="bg-primary-main border-primary-main hover:text-white" onClick={handleCreateNavigation} style={{ marginLeft: 10 }} />
                    {/* <Button
                        icon="pi pi-plus"
                        size="small"
                        label="Import Rules"
                        aria-label="Add Rules"
                        className="default-button"
                        style={{ marginLeft: 10 }}
                        onClick={() => setVisible(true)} // Show dialog when button is clicked
                    /> */}
                    {/* <Dialog
                        header={dialogHeader}
                        visible={visible}
                        style={{ width: '50vw' }}
                        onHide={() => setVisible(false)} // Hide dialog when the close button is clicked
                    >
                        <div className="card px-3 py-2">
                            <label htmlFor="" className="mb-1 font-bold">
                                Choose Rules
                            </label>
                            <div className="flex flex-wrap gap-3 mt-2 mb-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="rules" name="rules" value="Rules" onChange={(e) => setChooseRules(e.value)} checked={chooseRules === 'Rules'} />
                                    <label htmlFor="rules" className="ml-2">
                                        Rules
                                    </label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="capaRules" name="capaRules" value="Capa Rules" onChange={(e) => setChooseRules(e.value)} checked={chooseRules === 'Capa Rules'} />
                                    <label htmlFor="capaRules" className="ml-2">
                                        Capa Rules
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3 card flex justify-content-between align-items-center p-4 gap-3">
                                <div className="col-6">
                                    <div className="flex flex-column justify-center items-center gap-2 ">
                                        <label htmlFor="calendarInput" className="block mb-2 text-md mt-2">
                                            Select Effective Date:
                                        </label>
                                        <Calendar id="calendarInput" value={date} onChange={(e) => setDate(e.value as Date)} dateFormat="yy-mm-dd" placeholder="Select a date" showIcon style={{ borderRadius: '5px', borderColor: 'black' }} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="flex flex-column justify-center items-center gap-2 ">
                                        <label htmlFor="calendarInput" className="block mb-2 text-md mt-2">
                                            Enter Name for Rules Group:
                                        </label>
                                        <InputText id="email" type="text" onChange={(e) => setRulesGroup(e.target.value)} placeholder="Enter Rules Name " className="p-inputtext w-full py-2" />
                                    </div>
                                </div>
                            </div>
                            {isDetailLoading ? (
                                <div className="flex justify-center mb-3">
                                    <ProgressSpinner style={{ width: '30px' }} />
                                </div>
                            ) : (
                                <FileUpload name="demo[]" customUpload multiple={false} accept=".xls,.xlsx,image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>} uploadHandler={handleFileUpload} />
                            )}
                        </div>
                    </Dialog>
                    {/* <Button icon="pi pi-plus" size="small" label="Add Rules" aria-label="Add Rule" className="bg-primary-main border-primary-main hover:text-white" onClick={handleCreateNavigation} style={{ marginLeft: 10 }} /> */}
                    {/* <Button
                        icon="pi pi-plus"
                        size="small"
                        label="Delete Rules"
                        aria-label="Delete Rule"
                        className="bg-primary-main border-primary-main hover:text-white"
                        onClick={() => {
                            handleAllDelete();
                        }}
                        style={{ marginLeft: 10 }}
                    />  */}
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const fetchData = async (params?: any) => {
        try {
            setLoading(true);
            if (!params) {
                params = { limit: limit, page: page, sortBy: 'userGroupId' };
            }

            setPage(params.page);

            const queryString = buildQueryParams(params);
            const response = await GetCall(`company/user-group?${queryString}`);

            setTotalRecords(response.total);
            setuserGroups(response.data);
        } catch (error) {
            setAlert('error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const dataTableHeaderStyle = { fontSize: '12px' };

    useEffect(() => {
        fetchData();
    }, []);
    // const fetchprocurementCategories = async (categoryId: number | null) => {
    //     if (!categoryId) {
    //         setprocurementCategories([]); // Clear subcategories if no category is selected
    //         return;
    //     }
    //     setLoading(true);
    //     const response: CustomResponse = await GetCall(`/company/sub-category/${categoryId}`); // get all the roles
    //     setLoading(false);
    //     if (response.code == 'SUCCESS') {
    //         setprocurementCategories(response.data);
    //     } else {
    //         setprocurementCategories([]);
    //     }
    // };
    // const fetchsupplierCategories = async () => {
    //     setLoading(true);
    //     const response: CustomResponse = await GetCall(`/company/category`); // get all the roles
    //     setLoading(false);
    //     if (response.code == 'SUCCESS') {
    //         setCategories(response.data);
    //     } else {
    //         setCategories([]);
    //     }
    // };
    // const fetchsupplierDepartment = async () => {
    //     setLoading(true);
    //     const response: CustomResponse = await GetCall(`/company/department`); // get all the roles
    //     setLoading(false);
    //     if (response.code == 'SUCCESS') {
    //         setSupplierDepartment(response.data);
    //     } else {
    //         setSupplierDepartment([]);
    //     }
    // };

    // const dropdownMenuDepartment = () => {
    //     return (
    //         <Dropdown
    //             value={selectedDepartment}
    //             onChange={onDepartmentChange}
    //             options={supplierDepartment}
    //             optionValue="departmentId"
    //             placeholder="Select Department"
    //             optionLabel="name"
    //             className="w-full md:w-10rem"
    //             showClear={!!selectedDepartment}
    //         />
    //     );
    // };

    // const dropdownFieldDeparment = dropdownMenuDepartment();

    // const dropdownCategory = () => {
    //     return (
    //         <Dropdown value={selectedCategory} onChange={onCategorychange} options={filterCategories} optionValue="categoryId" placeholder="Select Category" optionLabel="categoryName" className="w-full md:w-10rem" showClear={!!selectedCategory} />
    //     );
    // };
    // const dropdownFieldCategory = dropdownCategory();

    // const dropdownMenuSubCategory = () => {
    //     return (
    //         <Dropdown
    //             value={SelectedSubCategory}
    //             onChange={onSubCategorychange}
    //             options={procurementCategories}
    //             optionLabel="subCategoryName"
    //             optionValue="subCategoryId"
    //             placeholder="Select Sub Category"
    //             className="w-full md:w-10rem"
    //             showClear={!!SelectedSubCategory}
    //         />
    //     );
    // };
    // const dropdownFieldSubCategory = dropdownMenuSubCategory();
    const globalSearch = () => {
        return <InputText value={selectedglobalSearch} onChange={onGlobalSearch} placeholder="Search" className="w-full md:w-10rem" />;
    };
    const FieldGlobalSearch = globalSearch();

    const onRowSelect = async (perm: SetRulesDir, action: any) => {
        setAction(action);

        setSelectedRuleSetId(perm);

        if (action === ACTIONS.DELETE) {
            openDeleteDialog(perm);
        }
    };

    const openDeleteDialog = (items: SetRulesDir) => {
        setIsDeleteDialogVisible(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
        setIsAllDeleteDialogVisible(false);
    };
    const handleAllDelete = () => {
        setIsAllDeleteDialogVisible(true);
        setIsDeleteDialogVisible(true);
    };

    const onDelete = async () => {
        setLoading(true);
        if (isAllDeleteDialogVisible) {
            try {
                const response = await DeleteCall(`/company/rules`);

                if (response.code === 'SUCCESS') {
                    closeDeleteDialog();
                    setAlert('success', 'Rule successfully deleted!');
                    fetchData();
                } else {
                    setAlert('error', 'Something went wrong!');
                    closeDeleteDialog();
                }
            } catch (error) {
                setAlert('error', 'Something went wrong!');
            } finally {
                setLoading(false);
            }
        } else {
            if (selectedRuleSetId.ruleType === 'MAIN RULE') {
                try {
                    const response = await DeleteCall(`/company/rules-set/${selectedRuleSetId.ruleSetId}`);

                    if (response.code === 'SUCCESS') {
                        setRules((prevRules) => prevRules.filter((rule) => rule.ruleSetId !== selectedRuleSetId.ruleSetId));
                        closeDeleteDialog();
                        setAlert('success', 'Rule successfully deleted!');
                    } else {
                        setAlert('error', 'Something went wrong!');
                        closeDeleteDialog();
                    }
                } catch (error) {
                    setAlert('error', 'Something went wrong!');
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    const response = await DeleteCall(`/company/caparule-set/${selectedRuleSetId.ruleSetId}`);

                    if (response.code === 'SUCCESS') {
                        setRules((prevRules) => prevRules.filter((rule) => rule.ruleSetId !== selectedRuleSetId.ruleSetId));
                        closeDeleteDialog();
                        setAlert('success', 'Rule successfully deleted!');
                    } else {
                        setAlert('error', 'Something went wrong!');
                        closeDeleteDialog();
                    }
                } catch (error) {
                    setAlert('error', 'Something went wrong!');
                } finally {
                    setLoading(false);
                }
            }
        }
    };
    // Handle rule type selection and fetch data
    const onRuleTypeChange = (e: any) => {
        setSelectedRuleType(e.value);
        fetchData({ limit, page, sortBy: 'ruleSetId', filters: { ruleType: e.value } });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className={`panel-container ${isShowSplit ? (layoutState.isMobile ? 'mobile-split' : 'split') : ''}`}>
                    <div className="left-panel">
                        <div className="header">{header}</div>
                        <div
                            className="bg-[#ffffff] border border-1  p-3  mt-4 shadow-lg"
                            style={{ borderColor: '#CBD5E1', borderRadius: '10px', WebkitBoxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)', MozBoxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)', boxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)' }}
                        >
                            <div className="flex justify-content-between items-center border-b">
                                <div>
                                    <Dropdown className="mt-2" value={limit} options={limitOptions} onChange={onLimitChange} placeholder="Limit" style={{ width: '100px', height: '30px' }} />
                                </div>
                                <div className="flex  gap-2">
                                    <div>
                                        <Dropdown className="mt-2" value={selectedRuleType} options={ruleTypeOptions} onChange={onRuleTypeChange} placeholder="Select Rule Type" style={{ width: '150px', height: '30px' }} />
                                    </div>
                                    <div className="mt-2">{FieldGlobalSearch}</div>
                                </div>
                            </div>

                            {isLoading ? (
                                <TableSkeletonSimple columns={7} rows={limit}/>
                            ) : (
                                <CustomDataTable
                                    ref={dataTableRef}
                                    page={page}
                                    limit={limit} // no of items per page
                                    totalRecords={totalRecords} // total records from api response
                                    // isEdit={true} // show edit button
                                    isDelete={true} // show delete button
                                    extraButtons={(item) => [
                                        {
                                            icon: 'pi pi-eye',
                                            onClick: (e) => {
                                                handleEditRules(item); // Pass the item (row data) instead of e
                                            }
                                        }
                                    ]}
                                    data={userGroups?.map((item: any) => ({
                                        reviewType: item.reviewType?.reviewTypeName,
                                        templateType: item.templateType?.templateTypeName,
                                        userGroup: item.userGroupName,
                                        whitelistedDomains: item.domains?.map((domain: any) => domain.whiteListedDomain?.whitelistedDomainName).join(', '),
                                        totalMembers: item.totalMembers
                                    }))}
                                    columns={[
                                        {
                                            header: 'SR. NO',
                                            body: (data: any, options: any) => {
                                                const normalizedRowIndex = options.rowIndex % limit;
                                                const srNo = (page - 1) * limit + normalizedRowIndex + 1;

                                                return <span>{srNo}</span>;
                                            },
                                            bodyStyle: { minWidth: 50, maxWidth: 50 }
                                        },
                                        {
                                            header: 'Review Type ',
                                            field: 'reviewType',
                                            bodyStyle: { minWidth: 150, maxWidth: 150 },
                                            headerStyle: dataTableHeaderStyle
                                        },
                                        {
                                            header: 'Template Type',
                                            field: 'templateType',
                                            bodyStyle: { minWidth: 150, maxWidth: 150 },
                                            headerStyle: dataTableHeaderStyle
                                        },
                                        {
                                            header: 'User Group',
                                            field: 'userGroup',
                                            bodyStyle: { minWidth: 150, maxWidth: 150 },
                                            headerStyle: dataTableHeaderStyle
                                        },
                                        {
                                            header: 'Whitlisted Domains',
                                            field: 'whitelistedDomains',
                                            bodyStyle: { minWidth: 150, maxWidth: 150 },
                                            headerStyle: dataTableHeaderStyle
                                        },
                                        {
                                            header: 'Total Members',
                                            field: 'totalMembers',
                                            bodyStyle: { minWidth: 150, maxWidth: 150 },
                                            headerStyle: dataTableHeaderStyle
                                        }
                                    ]}
                                    onLoad={(params: any) => fetchData(params)}
                                    onDelete={(item: any) => onRowSelect(item, 'delete')}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <Dialog
                    header="Delete confirmation"
                    visible={isDeleteDialogVisible}
                    style={{ width: layoutState.isMobile ? '90vw' : '35vw' }}
                    className="delete-dialog"
                    footer={
                        <div className="flex justify-content-center p-2">
                            <Button label="Cancel" style={{ color: '#DF1740' }} className="px-7" text onClick={closeDeleteDialog} />
                            <Button label="Delete" style={{ backgroundColor: '#DF1740', border: 'none' }} className="px-7 hover:text-white" onClick={onDelete} />
                        </div>
                    }
                    onHide={closeDeleteDialog}
                >
                    {isLoading && (
                        <div className="center-pos">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                        </div>
                    )}
                    <div className="flex flex-column w-full surface-border p-3 text-center gap-4">
                        <i className="pi pi-info-circle text-6xl" style={{ marginRight: 10, color: '#DF1740' }}></i>

                        <div className="flex flex-column align-items-center gap-1">
                            <span>{isAllDeleteDialogVisible ? 'Are you sure you want to delete all rule.' : 'Are you sure you want to delete selected rule.'}</span>
                            <span>This action cannot be undone. </span>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default UserGroups;
