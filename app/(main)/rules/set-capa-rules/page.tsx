/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { CustomResponse, Rules } from '@/types';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { ColumnBodyOptions } from 'primereact/column';
import { limitOptions } from '@/utils/constant';
import TableSkeletonSimple from '@/components/skeleton/TableSkeletonSimple';

const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    DELETE: 'delete'
};

const ManageCapaRulesPage = () => {
    const router = useRouter();
    const { layoutState } = useContext(LayoutContext);
    const [isShowSplit, setIsShowSplit] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const dataTableRef = useRef<CustomDataTableRef>(null);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const [selectedRuleId, setSelectedRuleId] = useState();
    const [action, setAction] = useState(null);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    // const [selectedDepartment, setSelectedDepartment] = useState('');
    // const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [rules, setRules] = useState<Rules[]>([]);
    const [totalRecords, setTotalRecords] = useState();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [procurementCategories, setprocurementCategories] = useState([]);
    const [filterCategories, setCategories] = useState([]);
    const [supplierDepartment, setSupplierDepartment] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedglobalSearch, setGlobalSearch] = useState('');
    const [SelectedSubCategory, setSelectedSubCategory] = useState('');
    const [isAllDeleteDialogVisible, setIsAllDeleteDialogVisible] = useState(false);
    const searchParams = useSearchParams();
    const ruleSetId = searchParams.get('ruleSetId');
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const handleCreateNavigation = () => {
        router.push(`/rules/set-capa-rules/create-new-capa-rules?ruleSetId=${ruleSetId}`); // Replace with the route you want to navigate to
    };

    // Handle limit change
    const onCategorychange = (e: any) => {
        setSelectedCategory(e.value); // Update limit
        fetchprocurementCategories(e.value);
        fetchData({
            limit: limit,
            page: page,
            include: 'subCategories,categories,department',
            filters: {
                categoryId: e.value
            }
        });
    };
    // Handle limit change
    const onDepartmentChange = (e: any) => {
        setSelectedDepartment(e.value);
        fetchData({
            limit: limit,
            page: page,
            include: 'subCategories,categories,department',
            filters: {
                departmentId: e.value
            }
        });
    };
    // Handle limit change
    const onSubCategorychange = (e: any) => {
        setSelectedSubCategory(e.value); // Update limit
        fetchData({
            limit: limit,
            page: page,
            include: 'subCategories,categories,department',
            filters: {
                subCategoryId: e.value
            }
        });
    };
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
        fetchsupplierCategories();
        fetchsupplierDepartment();
    }, [limit, page]);
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

        const formData = new FormData();
        formData.append('file', file);

        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        // In the handleFileUpload function
        if (date) {
            formData.append('effectiveFrom', formatDate(date)); // Format the date as DD-MM-YYYY
        }

        try {
            setLoading(true);
            // Use the existing PostCall function
            const response: CustomResponse = await PostCall('/company/caparule/bulkadd', formData);

            if (response.code === 'SUCCESS') {
                setAlert('success', 'Capa Rules imported successfully');
                setVisible(false);
                fetchData();
            } else {
                setAlert('error', response.message || 'File upload failed');
            }
        } catch (error) {
            setAlert('error', 'An unexpected error occurred during file upload');
        } finally {
            setLoading(false);
        }
    };
    const { isLoading, setLoading, setAlert } = useAppContext();
    const handleEditRules = (ruleSetId: any, capaRuleId: any) => {
        router.push(`/rules/set-capa-rules/create-new-capa-rules?edit=true&ruleSetId=${ruleSetId}&capaRuleId=${capaRuleId}`);
    };
    const openAllDeleteDialog = (items: any) => {
        setIsAllDeleteDialogVisible(true);
    };

    const closeAllDeleteDialog = () => {
        setIsAllDeleteDialogVisible(false);
    };

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
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left flex align-items-center">
                    <h3 className="mb-0">Manage Capa Rules</h3>
                </span>
                <div className="flex justify-content-end">
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
                        <div className="mb-3">
                            <div>
                                <div className="flex justify-center items-center gap-4 ">
                                    <label htmlFor="calendarInput" className="block mb-2 text-md mt-2">
                                        Select Effective Date:
                                    </label>
                                    <Calendar id="calendarInput" value={date} onChange={(e) => setDate(e.value as Date)} dateFormat="yy-mm-dd" placeholder="Select a date" showIcon style={{ borderRadius: '5px', borderColor: 'black' }} />
                                </div>
                            </div>
                        </div>
                        <FileUpload name="demo[]" customUpload multiple={false} accept=".xls,.xlsx,image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>} uploadHandler={handleFileUpload} />
                    </Dialog> */}
                    <label className="block mb-1 text-md mt-4 font-bold">
                        Effective From Date: {rules[0]?.effectiveFrom 
                            ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(rules[0].effectiveFrom)) 
                            : "N/A"}
                    </label>
                    <Button 
                        icon="pi pi-plus" 
                        size="small" 
                        label="Add Capa Rules" 
                        aria-label="Add Rule" 
                        className="bg-primary-main border-primary-main hover:text-white ml-4 mt-2"
                        onClick={handleCreateNavigation} 
                    />


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
                    /> */}
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const renderInputBox = () => {
        return (
            <div style={{ position: 'relative' }}>
                <InputText placeholder="Search" style={{ paddingLeft: '40px', width: '40%' }} />
                <span
                    className="pi pi-search"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'gray',
                        fontSize: '1.5rem'
                    }}
                ></span>
            </div>
        );
    };

    const fetchData = async (params?: any) => {
        try {
            setLoading(true);
            if (!params) {
                params = { limit: limit, page: page, include: 'subCategories', sortOrder: 'asc' };
            }

            setPage(params.page);

            const queryString = buildQueryParams(params);
            const response = await GetCall(`company/caparule-set/${ruleSetId}?${queryString}`);

            setTotalRecords(response.total);
            setRules(response.data);
        } catch (error) {
            setAlert('error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const dataTableHeaderStyle = { fontSize: '12px' };

    const fetchprocurementCategories = async (categoryId: number | null) => {
        try {
            setLoading(true);
            if (!categoryId) {
                setprocurementCategories([]); // Clear subcategories if no category is selected
                return;
            }
            const response: CustomResponse = await GetCall(`/company/sub-category/${categoryId}`); // get all the roles

            if (response.code == 'SUCCESS') {
                setprocurementCategories(response.data);
            } else {
                setprocurementCategories([]);
            }
        } catch (error) {
            setAlert('error', 'Failed to load category');
        } finally {
            setLoading(false);
        }
    };
    const fetchsupplierCategories = async () => {
        try {
            setLoading(true);
            const response: CustomResponse = await GetCall(`/company/category`); // get all the roles
            setLoading(false);
            if (response.code == 'SUCCESS') {
                setCategories(response.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            setAlert('error', 'Failed to load category');
        } finally {
            setLoading(false);
        }
    };
    const fetchsupplierDepartment = async () => {
        try {
            setLoading(true);
            const response: CustomResponse = await GetCall(`/company/department`); // get all the roles
            setLoading(false);
            if (response.code == 'SUCCESS') {
                setSupplierDepartment(response.data);
            } else {
                setSupplierDepartment([]);
            }
        } catch (error) {
            setAlert('error', 'Failed to load department');
        } finally {
            setLoading(false);
        }
    };

    const dropdownMenuDepartment = () => {
        return (
            <Dropdown
                value={selectedDepartment}
                onChange={onDepartmentChange}
                options={supplierDepartment}
                optionValue="departmentId"
                placeholder="Select Department"
                optionLabel="name"
                className="w-full md:w-10rem"
                showClear={!!selectedDepartment}
            />
        );
    };

    const dropdownFieldDeparment = dropdownMenuDepartment();

    const dropdownCategory = () => {
        return (
            <Dropdown value={selectedCategory} onChange={onCategorychange} options={filterCategories} optionValue="categoryId" placeholder="Select Category" optionLabel="categoryName" className="w-full md:w-10rem" showClear={!!selectedCategory} />
        );
    };
    const dropdownFieldCategory = dropdownCategory();

    const dropdownMenuSubCategory = () => {
        return (
            <Dropdown
                value={SelectedSubCategory}
                onChange={onSubCategorychange}
                options={procurementCategories}
                optionLabel="subCategoryName"
                optionValue="subCategoryId"
                placeholder="Select Sub Category"
                className="w-full md:w-10rem"
                showClear={!!SelectedSubCategory}
            />
        );
    };
    const dropdownFieldSubCategory = dropdownMenuSubCategory();
    const globalSearch = () => {
        return <InputText value={selectedglobalSearch} onChange={onGlobalSearch} placeholder="Search" className="w-full md:w-10rem" />;
    };
    const FieldGlobalSearch = globalSearch();

    const onRowSelect = async (perm: Rules, action: any) => {
        setAction(action);

        setSelectedRuleId(perm.capaRuleId);

        if (action === ACTIONS.DELETE) {
            openDeleteDialog(perm);
        }
    };

    const openDeleteDialog = (items: Rules) => {
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
                setLoading(true);
                const response = await DeleteCall(`/company/caparule&ruleSetId=${ruleSetId}`);

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
            try {
                setLoading(true);
                const response = await DeleteCall(`/company/caparule/${selectedRuleId}`);

                if (response.code === 'SUCCESS') {
                    setRules((prevRules) => prevRules.filter((rule) => rule.ruleId !== selectedRuleId));
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
        }
    };

    // const BulkDelete = async () => {
    //     setLoading(true);

    //     try {
    //         const response = await DeleteCall(`/company/caparule/`);

    //         if (response.code === 'SUCCESS') {
    //             closeAllDeleteDialog();
    //             fetchData();
    //             setAlert('success', 'Rule successfully deleted!');
    //         } else {
    //             setAlert('error', 'Something went wrong!');
    //             closeAllDeleteDialog();
    //         }
    //     } catch (error) {
    //         setAlert('error', 'Something went wrong!');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const openDialog = (item: React.SetStateAction<null>) => {
        setSelectedRow(item);
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        setSelectedRow(null);
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
                            {/* <div className="search-box  mt-5 w-70">{inputboxfeild}</div> */}
                            <div className="flex justify-content-between items-center border-b">
                                <div>
                                    <Dropdown className="mt-2" value={limit} options={limitOptions} onChange={onLimitChange} placeholder="Limit" style={{ width: '100px', height: '30px' }} />
                                </div>
                                <div className="flex  gap-2">
                                    <div className="mt-2">{dropdownFieldDeparment}</div>
                                    <div className="mt-2">{dropdownFieldCategory}</div>
                                    <div className="mt-2">{dropdownFieldSubCategory}</div>
                                    <div className="mt-2">{FieldGlobalSearch}</div>
                                </div>
                            </div>
                            {isLoading ?(
                                <TableSkeletonSimple columns={6} rows={limit} />
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
                                        icon: 'pi pi-user-edit',
                                        onClick: (e) => {
                                            handleEditRules(ruleSetId, item.capaRuleId); // Pass the userId from the row data
                                        }
                                    },
                                    {
                                        icon: 'pi pi-eye',
                                        onClick: () => openDialog(item)
                                    }
                                ]}
                                data={rules}
                                columns={[
                                    {
                                        header: 'Sr. No',
                                        body: (data: any, options: any) => {
                                            const normalizedRowIndex = options.rowIndex % limit;
                                            const srNo = (page - 1) * limit + normalizedRowIndex + 1;

                                            return <span>{srNo}</span>;
                                        },
                                        bodyStyle: { minWidth: 50, maxWidth: 50 }
                                    },
                                    {
                                        header: 'DEPARTMENT ',
                                        field: 'department.name',
                                        // filter: true,
                                        bodyStyle: { minWidth: 100, maxWidth: 100 },
                                        headerStyle: dataTableHeaderStyle
                                    },
                                    {
                                        header: 'PROC. CATEGORY',
                                        field: 'category.categoryName',
                                        // sortable: true,
                                        // filter: true,
                                        filterPlaceholder: 'Supplier Name',
                                        headerStyle: dataTableHeaderStyle,
                                        style: { minWidth: 120, maxWidth: 120 }
                                    },
                                    {
                                        header: 'SUB CATEGORY',
                                        field: 'subCategory.subCategoryName',
                                        headerStyle: dataTableHeaderStyle,
                                        style: { minWidth: 180, maxWidth: 180 }
                                    },
                                    // {
                                    //     header: 'EFFECTIVE FROM',
                                    //     field: 'effectiveFrom',
                                    //     body: (data: any) => {
                                    //         if (data.effectiveFrom) {
                                    //             const date = new Date(data.effectiveFrom);
                                    //             return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
                                    //         }
                                    //         return;
                                    //     },
                                    //     headerStyle: dataTableHeaderStyle,
                                    //     style: { minWidth: 180, maxWidth: 180 }
                                    // },
                                    {
                                        header: 'CRITERIA CATEGORY',
                                        field: 'capaRulesName',
                                        body: (data: any, options: ColumnBodyOptions) => {
                                            const rowIndex = options.rowIndex;
                                            const isExpanded = expandedRows[rowIndex] || false;

                                            const words = data.capaRulesName.split(' ');
                                            const isLongText = words.length > 5;
                                            const displayText = isExpanded ? data.capaRulesName : words.slice(0, 5).join(' ') + (isLongText ? '...' : '');

                                            const toggleExpand = () => {
                                                setExpandedRows((prev) => ({
                                                    ...prev,
                                                    [rowIndex]: !isExpanded
                                                }));
                                            };

                                            return (
                                                <span>
                                                    {displayText}
                                                    {isLongText && (
                                                        <button onClick={toggleExpand} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none', marginLeft: '5px', fontSize: '10px' }}>
                                                            {isExpanded ? 'Read Less' : 'Read More'}
                                                        </button>
                                                    )}
                                                </span>
                                            );
                                        },
                                        bodyStyle: { minWidth: 300, maxWidth: 300 },
                                        headerStyle: dataTableHeaderStyle
                                    }
                                    // {
                                    //     header: 'CRITERIA',
                                    //     field: 'status',
                                    //     body: (data: any, options: ColumnBodyOptions) => {
                                    //         const rowIndex = options.rowIndex;
                                    //         const isExpanded = expandedRows[rowIndex] || false;

                                    //         const words = data.status.split(' ');
                                    //         const isLongText = words.length > 5;
                                    //         const displayText = isExpanded ? data.status : words.slice(0, 5).join(' ') + (isLongText ? '...' : '');

                                    //         const toggleExpand = () => {
                                    //             setExpandedRows((prev) => ({
                                    //                 ...prev,
                                    //                 [rowIndex]: !isExpanded,
                                    //             }));
                                    //         };

                                    //         return (
                                    //             <span>
                                    //                 {displayText}
                                    //                 {isLongText && (
                                    //                     <button
                                    //                         onClick={toggleExpand}
                                    //                         style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none', marginLeft: '5px',fontSize:'10px' }}
                                    //                     >
                                    //                         {isExpanded ? 'Read Less' : 'Read More'}
                                    //                     </button>
                                    //                 )}
                                    //             </span>
                                    //         );
                                    //     },
                                    //     filterPlaceholder: 'Search Supplier Category',
                                    //     bodyStyle: { minWidth: 150, maxWidth: 150 },
                                    //     headerStyle: dataTableHeaderStyle
                                    // }
                                ]}
                                onLoad={(params: any) => fetchData(params)}
                                onDelete={(item: any) => onRowSelect(item, 'delete')}
                            />
                            )}
                        </div>
                    </div>
                </div>
                <Dialog header="Criteria Evaluation & Score:" visible={dialogVisible} onHide={closeDialog} style={{ width: '500px' }}>
                    {selectedRow && (
                        <div>
                            <ul>
                                {selectedRow.status?.map((item: any, index: number) => (
                                    <li key={index} className="mb-3">
                                        {item}
                                    </li>
                                )) || <li>N/A</li>}
                            </ul>
                        </div>
                    )}
                </Dialog>

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
                            <span>{isAllDeleteDialogVisible ? 'Are you sure you want to delete all CAPA rule.' : 'Are you sure you want to delete selected CAPA rule.'}</span>
                            <span>This action cannot be undone. </span>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageCapaRulesPage;
