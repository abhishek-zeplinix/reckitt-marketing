'use client';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface Vendor {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    address: string;
    children?: Vendor[]; // Add children property for nested vendors
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [expandedRows, setExpandedRows] = useState<Vendor[]>([]);
    const [form, setForm] = useState<Omit<Vendor, 'id'>>({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: ''
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [childForm, setChildForm] = useState<Omit<Vendor, 'id'>>({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: ''
    });
    const [childVisible, setChildVisible] = useState(false);
    const [parentVendorId, setParentVendorId] = useState<string | null>(null);
    const [childEditId, setChildEditId] = useState<string | null>(null);

    useEffect(() => {
    const data = localStorage.getItem('vendors');
    if (data) {
        const parsedData = JSON.parse(data);
        setVendors(parsedData);
        setExpandedRows(parsedData); // Expand all by default
    }
}, []);

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleChildChange = (key: keyof typeof childForm, value: string) => {
        setChildForm({ ...childForm, [key]: value });
    };

    const saveToStorage = (data: Vendor[]) => {
        localStorage.setItem('vendors', JSON.stringify(data));
        setVendors(data);
    };

    const handleSubmit = () => {
        if (editId) {
            const updated = vendors.map((v) => (v.id === editId ? { ...v, ...form } : v));
            saveToStorage(updated);
        } else {
            const newVendor: Vendor = { id: uuidv4(), ...form };
            const updated = [...vendors, newVendor];
            saveToStorage(updated);
        }
        resetForm();
    };

    const handleChildSubmit = () => {
        if (!parentVendorId) return;

        const updatedVendors = [...vendors];
        const parentIndex = updatedVendors.findIndex(v => v.id === parentVendorId);

        if (parentIndex === -1) return;

        if (childEditId) {
            // Edit existing child
            updatedVendors[parentIndex].children = updatedVendors[parentIndex].children?.map(child => 
                child.id === childEditId ? { ...child, ...childForm } : child
            );
        } else {
            // Add new child
            const newChild: Vendor = { id: uuidv4(), ...childForm };
            updatedVendors[parentIndex].children = [...(updatedVendors[parentIndex].children || []), newChild];
        }

        saveToStorage(updatedVendors);
        resetChildForm();
    };

    const resetForm = () => {
        setForm({ name: '', email: '', phone: '', companyName: '', address: '' });
        setEditId(null);
        setVisible(false);
    };

    const resetChildForm = () => {
        setChildForm({ name: '', email: '', phone: '', companyName: '', address: '' });
        setParentVendorId(null);
        setChildEditId(null);
        setChildVisible(false);
    };

    const handleEdit = (vendor: Vendor) => {
        setForm({
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            companyName: vendor.companyName,
            address: vendor.address
        });
        setEditId(vendor.id);
        setVisible(true);
    };

    const handleEditChild = (parentId: string, child: Vendor) => {
        setChildForm({
            name: child.name,
            email: child.email,
            phone: child.phone,
            companyName: child.companyName,
            address: child.address
        });
        setParentVendorId(parentId);
        setChildEditId(child.id);
        setChildVisible(true);
    };

    const handleDelete = (id: string) => {
        const updated = vendors.filter((v) => v.id !== id);
        saveToStorage(updated);
    };

    const handleDeleteChild = (parentId: string, childId: string) => {
        const updatedVendors = [...vendors];
        const parentIndex = updatedVendors.findIndex(v => v.id === parentId);
        
        if (parentIndex !== -1) {
            updatedVendors[parentIndex].children = updatedVendors[parentIndex].children?.filter(child => child.id !== childId);
            saveToStorage(updatedVendors);
        }
    };

    const handleAddChild = (parentId: string) => {
        setParentVendorId(parentId);
        setChildVisible(true);
    };

    const actionBodyTemplate = (vendor: Vendor) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => handleEdit(vendor)} />
            <Button icon="pi pi-plus" rounded text severity="success" onClick={() => handleAddChild(vendor.id)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(vendor.id)} />
        </div>
    );

    const childActionBodyTemplate = (parentId: string, child: Vendor) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => handleEditChild(parentId, child)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDeleteChild(parentId, child.id)} />
        </div>
    );

    const rowExpansionTemplate = (vendor: Vendor) => {
        if (!vendor.children || vendor.children.length === 0) {
            return <div className="p-3">No child vendors</div>;
        }

        return (
            <div className="p-3">
                <DataTable value={vendor.children} responsiveLayout="scroll">
                    <Column field="name" header="Name" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Phone" />
                    <Column field="companyName" header="Company" />
                    <Column field="address" header="Address" />
                    <Column body={(child) => childActionBodyTemplate(vendor.id, child)} header="Actions" style={{ width: '120px' }} />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="p-4 card">
            <div className="">
                <h2 className="text-xl font-semibold mb-4">Vendor Onboarding</h2>
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="col-12 flex">
                    <div className="md:col-4">
                        <label htmlFor="name">Vendor Name</label>
                        <InputText id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="phone">Phone</label>
                        <InputText id="phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full mt-2" />
                    </div>
                </div>
                <div className="col-12 flex">
                    <div className="md:col-4">
                        <label htmlFor="companyName">Company Name</label>
                        <InputText id="companyName" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="address">Address</label>
                        <InputText id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full mt-2" />
                    </div>
                </div>
            </div>

            <div className="flex justify-content-end">
                <Button label="Add Vendor" icon="pi pi-plus" onClick={handleSubmit} />
            </div>

            <h3 className="text-lg font-medium mt-5 mb-3">Vendor List</h3>
            {vendors.length === 0 ? (
                <p>No vendors added yet</p>
            ) : (
                <DataTable 
                    value={vendors} 
                    stripedRows 
                    responsiveLayout="scroll"
                    rowExpansionTemplate={rowExpansionTemplate}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data as Vendor[])}
                >
                    <Column expander style={{ width: '3em' }} />
                    <Column field="name" header="Name" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Phone" />
                    <Column field="companyName" header="Company" />
                    <Column field="address" header="Address" />
                    <Column body={actionBodyTemplate} header="Actions" style={{ width: '150px' }} />
                </DataTable>
            )}

            <Dialog header={editId ? 'Edit Vendor' : 'Add Vendor'} visible={visible} style={{ width: '30vw' }} onHide={resetForm} modal>
                <div className="flex flex-column gap-3">
                    <InputText placeholder="Vendor Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                    <InputText placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <InputText placeholder="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    <InputText placeholder="Company Name" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
                    <InputText placeholder="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                    <Button label={editId ? 'Update' : 'Save'} onClick={handleSubmit} />
                </div>
            </Dialog>

            <Dialog header={childEditId ? 'Edit Child Vendor' : 'Add Child Vendor'} visible={childVisible} style={{ width: '30vw' }} onHide={resetChildForm} modal>
                <div className="flex flex-column gap-3">
                    <InputText placeholder="Vendor Name" value={childForm.name} onChange={(e) => handleChildChange('name', e.target.value)} />
                    <InputText placeholder="Email" value={childForm.email} onChange={(e) => handleChildChange('email', e.target.value)} />
                    <InputText placeholder="Phone" value={childForm.phone} onChange={(e) => handleChildChange('phone', e.target.value)} />
                    <InputText placeholder="Company Name" value={childForm.companyName} onChange={(e) => handleChildChange('companyName', e.target.value)} />
                    <InputText placeholder="Address" value={childForm.address} onChange={(e) => handleChildChange('address', e.target.value)} />
                    <Button label={childEditId ? 'Update' : 'Save'} onClick={handleChildSubmit} />
                </div>
            </Dialog>
        </div>
    );
}