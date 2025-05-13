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
import { limitOptions } from '@/utils/constant';
import TableSkeletonSimple from '@/components/skeleton/TableSkeletonSimple';

const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    DELETE: 'delete'
};

const MainRules = () => {
    const router = useRouter();
    const { layoutState } = useContext(LayoutContext);
    const [isShowSplit, setIsShowSplit] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const dataTableRef = useRef<CustomDataTableRef>(null);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const [rules, setRules] = useState<SetRulesDir[]>([]);
    const [totalRecords, setTotalRecords] = useState();
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
    // const [visible, setVisible] = useState(false);
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
    const [bulkDialogVisible, setBulkDialogVisible] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);
    const [visible, setVisible] = useState(false); // State to control dialog visibility
    const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

    const ruleTypeOptions = [
        { label: 'CAPA RULE', value: 'capa rule' },
        { label: 'MAIN RULE', value: 'main rule' }
    ];
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
    }, [limit, page]);

    const handleEditRules = (e: any) => {
            router.push(`/mapping-evaluation/view-escalation`);
    };
    const handleCreateNavigation = () => {
        router.push('/mapping-evaluation/create-escalation');
    };

    const { isLoading, setLoading, setAlert } = useAppContext();

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left flex align-items-center">
                    <h3 className="mb-0">Escalation With Project Timeline</h3>
                </span>
                <div className="flex justify-content-end">
                    <Button
                        icon="pi pi-plus"
                        size="small"
                        label="   Create Escalation With Timeline"
                        aria-label="Create Escalation With Timeline "
                        className="bg-primary-main hover:text-white border-primary-main"
                        style={{ marginLeft: 10 }}
                        onClick={handleCreateNavigation} // Show dialog when button is clicked
                    />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const fetchData = async (params?: any) => {
        try {
            setLoading(true);
            if (!params) {
                params = { limit: limit, page: page, sortBy: 'ruleSetId' };
            }

            setPage(params.page);

            const queryString = buildQueryParams(params);
            setLoading(true);
            const response = await GetCall(`/sbs/api/company/rules-set?${queryString}`);

            setTotalRecords(response.total);
            setRules(response.data.rows);
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
    const globalSearch = () => {
        return <InputText value={selectedglobalSearch} onChange={onGlobalSearch} placeholder="Search" className="w-full md:w-10rem" />;
    };
    const FieldGlobalSearch = globalSearch();

    const onRowSelect = async (perm: any, action: any) => {
        setAction(action);

        setSelectedRuleSetId(perm);

        if (action === ACTIONS.VIEW) {
            handleEditRules(perm);
        }
    };

    // const openDeleteDialog = (items: SetRulesDir) => {
    //     setIsDeleteDialogVisible(true);
    // };
    const onRuleTypeChange = (e: any) => {
        setSelectedRuleType(e.value);
        fetchData({ limit, page, sortBy: 'ruleSetId', filters: { ruleType: e.value } });
    };
    // Function to handle button clicks
    const handleButtonClick = (action: string) => {
        let title, message;
        switch (action) {
            case 'initialize':
                title = 'INITIALIZER';
                message = 'Are you sure? You are about to initialize the process.';
                break;
            case 'sendReminder':
                title = 'SEND REMINDER';
                message = 'Are you sure? You are about to send a reminder email.';
                break;
            case 'sendSuperior':
                title = 'SEND SUPERIOR';
                message = 'Are you sure? You are about to send an email to the superior.';
                break;
            default:
                title = '';
                message = '';
        }
        setDialogContent({ title, message });
        setVisible(true); // Show the dialog
    };

    // Dialog footer with "Yes Proceed" and "Cancel" buttons
    const dialogFooter = (
        <div className='p-2'>
            <Button label="Yes Proceed" icon="pi pi-check mt-2" onClick={() => setVisible(false)} autoFocus />
            <Button label="Cancel" style={{ color: '#DF1740' }} className="px-7" text onClick={() => setVisible(false)}  />
        </div>
    );

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
                                        <Dropdown
                                            className="mt-2"
                                            value={selectedRuleType}
                                            options={ruleTypeOptions}
                                            onChange={onRuleTypeChange}
                                            placeholder="Select Rule Type"
                                            style={{ width: '150px', height: '30px' }}
                                            showClear={!!selectedRuleType}
                                        />
                                    </div>
                                    <div className="mt-2">{FieldGlobalSearch}</div>
                                </div>
                            </div>
                            {isLoading ?(
                                <TableSkeletonSimple columns={4} rows={limit} />
                            ) : (

                            <CustomDataTable
                                ref={dataTableRef}
                                page={page}
                                limit={limit} // no of items per page
                                totalRecords={totalRecords} // total records from api response
                                isView={true} // show edit button
                                // isDelete={true} // show delete button
                                extraButtons={(item) => [
                                    {
                                        icon: "pi pi-bell",
                                        tooltip:'Initialize',
                                        onClick: (e) => {
                                            handleButtonClick('initialize'); // Pass the item (row data) instead of e
                                        }
                                    },
                                    {
                                        icon: "pi pi-send",
                                        tooltip:'Send Reminder',
                                        onClick: (e) => {
                                            handleButtonClick('sendReminder'); // Pass the item (row data) instead of e
                                        }
                                    },
                                    {
                                        icon: "pi pi-envelope",
                                        tooltip:'Send Superior',
                                        onClick: (e) => {
                                            handleButtonClick('sendSuperior'); // Pass the item (row data) instead of e
                                        }
                                    }
                                ]}
                                data={rules.map((item: any) => ({
                                    ruleSetId: item.ruleSetId,
                                    value: item.value?.split('_')[2].toUpperCase(),
                                    ruleType: item.ruleType.toUpperCase(),
                                    effectiveFrom: item.effectiveFrom?.split('T')[0]
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
                                        header: 'RULES TYPE ',
                                        field: 'ruleType',
                                        bodyStyle: { minWidth: 150, maxWidth: 150 },
                                        headerStyle: dataTableHeaderStyle
                                    },
                                    {
                                        header: 'EFFECTIVE FROM',
                                        field: 'effectiveFrom',
                                        body: (data: any) => {
                                            if (data.effectiveFrom) {
                                                const date = new Date(data.effectiveFrom);
                                                return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
                                            }
                                            return;
                                        },
                                        bodyStyle: { minWidth: 150, maxWidth: 150 },
                                        headerStyle: dataTableHeaderStyle
                                    },

                                    {
                                        header: 'RULES NAME ',
                                        field: 'value',
                                        bodyStyle: { minWidth: 150, maxWidth: 150 },
                                        headerStyle: dataTableHeaderStyle
                                    }
                                ]}
                                onLoad={(params: any) => fetchData(params)}
                                onView={(item: any) => onRowSelect(item, 'view')}
                            />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Dialog Box */}
            <Dialog
                header={dialogContent.title}
                visible={visible}
                style={{ width: '400px' }}
                footer={dialogFooter}
                onHide={() => setVisible(false)}
            >
                <div className="flex flex-column align-items-center gap-3">
                    <i className="pi pi-exclamation-circle" style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
                    <h3>Are you sure?</h3>
                    <p>You are about to send the email.</p>
                </div>
            </Dialog>
        </div>
    );
};

export default MainRules;
