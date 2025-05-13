'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useAppContext } from '@/layout/AppWrapper';
import { GetCall, PostCall, PutCall } from '@/app/api-config/ApiKit';
import { CustomResponse } from '@/types';
import { validateFormCreateQuestion } from '@/utils/utils';
import { InputText } from 'primereact/inputtext';
import { get, set } from 'lodash';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { EmptyAccount } from '@/types/forms';
import Stepper from '@/components/Stepper';
import { Country, State, City } from 'country-state-city';
import TableSkeletonSimple from '@/components/skeleton/TableSkeletonSimple';
import CustomDataTable, { CustomDataTableRef } from '@/components/CustomDataTable';
import { buildQueryParams, getRowLimitWithScreenHeight } from '@/utils/utils';
import { MultiSelect } from 'primereact/multiselect';
import { Label } from '@mui/icons-material';
const defaultForm: EmptyAccount = {
    vendorId: null,
    reviewTypeId: null,
    templateTypeId: null,
    userGroupId: null,
    buId: null,
    brand: null,
    country: null,
    reviewType: null,
};

const ManageAccountPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supId = searchParams.get('supId');
    const isEditMode = searchParams.get('edit') === 'true';
    const { isLoading, setAlert, setLoading } = useAppContext();
    const [form, setForm] = useState<EmptyAccount>(defaultForm);
    const [reviewTypes, setReviewTypes] = useState<any>([{label:"Creative"},{label:"Brand Experience"},{label:"Media"}]);
    const [brand, setBrand] = useState<any>([{label:"Airwick"},{label:"Finish"},{label:"Gaviscon"}]);
    const [country, setCountry] = useState<any>([{label:"Global"},{label:"UK"},{label:"Germany"}]);
    const [mappedValues, setMappedValues] = useState<string | null>(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("mappedValues");
  }
  return null;
});

    const [questionData, setQuestionData] = useState<any[]>([]);
    const dataTableRef = useRef<CustomDataTableRef>(null);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const dataTableHeaderStyle = { fontSize: '12px' };
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState();
    const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>({});



    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
  if (mappedValues !== null) {
    localStorage.setItem("mappedValues", mappedValues);
  }
}, [mappedValues]);



    const handleSubmit = () => {
    if (form.reviewType && form.country && form.brand) {
        const mapped = `${form.reviewType}, ${form.country}, ${form.brand}`;
        
        setMappedValues(mapped);
    } else {
        setAlert('warn', 'Please select all fields.' );
    }
};
console.log(mappedValues);

    const onInputChange = (name: string | { [key: string]: any }, val?: any) => {
        setForm((prevForm) => {
            let updatedForm = {
                ...prevForm,
                ...(typeof name === 'string' ? { [name]: val } : name),
            };
            return updatedForm;
        });
    };
    const shouldShowMarketingQuestions = (form: any) => {
        return !!(form?.reviewTypes || form?.brand || form?.country);
      };
      const handleCheckboxChange = (id: string | number, isChecked: boolean) => {
        setCheckedRows((prev) => ({
          ...prev,
          [id]: isChecked,
        }));
      };
      const handleSave = async () => {
    if (!form.reviewType || !form.country || !form.brand) {
        setAlert('warn', 'Please select all fields before saving.' );
        return;
    }

    try {
        setLoading(true);
        const response = await PostCall('/your-api-endpoint', {
            reviewType: form.reviewType,
            country: form.country,
            brand: form.brand,
        });

        if (response.success) {
            setAlert('success','Saved successfully.' );
        } else {
            throw new Error('Save failed');
        }
    } catch (err) {
        setAlert('error','An error occurred while saving.' );
    } finally {
        setLoading(false);
    }
};

    const renderStepContent = () => {
        return (
            <div>
                <div className="flex flex-column gap-2 pt-2">
                    <h2 className="text-center font-bold ">Account</h2>
                    <div className="p-fluid grid mx-1 pt-2">
                        <div className="field col-4">
                            <label htmlFor="Label" className="font-semibold">
                                Review Type
                            </label>
                            <Dropdown
                                id="reviewType"
                                value={form.reviewType}
                                options={reviewTypes}
                                optionLabel="label"
                                optionValue="label"
                                onChange={(e) => onInputChange('reviewType', e.value)}
                                placeholder="Select Review Type"
                                className="w-full mb-1"
                                showClear={!!form.reviewType}
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="label" className="font-semibold">
                                Country
                            </label>
                            <Dropdown
                                id="country"
                                value={form.country}
                                options={country}
                                optionLabel="label"
                                optionValue="label"
                                onChange={(e) => onInputChange('country', e.value)}
                                placeholder="Select Country"
                                className="w-full mb-1"
                                showClear={!!form.country}
                            />
                        </div>
                        <div className="field col-4">
                            <label htmlFor="brand" className="font-semibold">
                                Brands
                            </label>
                            <Dropdown
                                id="brand"
                                value={form.brand}
                                options={brand}
                                optionLabel="label"
                                optionValue="label"
                                onChange={(e) => onInputChange('brand', e.value)}
                                placeholder="Select Brand Name"
                                className="w-full mb-1"
                                showClear={!!form.brand}
                            />
                        </div>
                    </div>
                    <div className="p-card-footer flex justify-content-end px-1 gap-1 py-0 bg-slate-300 shadow-slate-400">
                    <Button label= 'Submit' icon="pi pi-check" className="bg-primary-main border-primary-main hover:text-white mb-3" onClick={handleSubmit} />
                </div>
                </div>
            </div>
        );
    };
    return (
        <div className="">
            <div className="p-card">
                <hr />
                <div className="p-card-body">{renderStepContent()}</div>
                <hr />
                {shouldShowMarketingQuestions(form) && (
                    <div className='m-4'>
                        <div>
                            <h3>Maketing Map Account</h3>
                        </div>
                        <hr />
                       {isLoading ? (
                            <TableSkeletonSimple columns={3} rows={limit} />
                        ) : mappedValues ? (
                            <div className="p-4 bg-gray-100 rounded-md">
                                <strong>1. </strong> {mappedValues}
                            </div>
                        ) : (
                            <div className="p-4 text-gray-500 italic">No data submitted yet.</div>
                        )}


                    </div>
                )}
                <div className="p-card-footer flex justify-content-end px-4 gap-3 py-0 bg-slate-300 shadow-slate-400">
                    <Button label="Save" icon="pi pi-check" className="bg-primary-main border-primary-main hover:text-white mb-3" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};

export default ManageAccountPage;