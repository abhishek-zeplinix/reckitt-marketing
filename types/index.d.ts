import React, { ReactNode } from 'react';

import {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    AppSubMenuProps,
    LayoutConfig,
    LayoutState,
    AppBreadcrumbState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    MenuModelItem,
    AppMenuItemProps,
    AppMenuItem
} from './layout';
import { Calendar } from 'primereact/calendar';

type ChildContainerProps = {
    children: ReactNode;
};
type User = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    countryCode?: string;
    gender?: string;
    profile?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isSuperAdmin?: boolean;
    isAdmin?: boolean;
    userRole?: string
    company?: {
        domain: string;
        companyId: string;
        name: string;
    };
    userRole?: string;
    permissions: {
        permissions: any[];
    }
};

type CustomResponse = {
    code: string;
    message: string;
    data: any;
    total?: number;
    filters?: any;
    page?: any;
    search?: any;
    totalPages?: any;
};

type AppContextType = {
    displayName: any;
    setDisplayName: (name: any) => void;
    user: any;
    setUser: (user: any) => void;
    company: any;
    setCompany: (company: any) => void;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    signOut: () => void;
    setAlert: (type: string, message: string) => void;
    authToken: any;
    setAuthToken: (token: any) => void;
    isScroll: boolean;
    setScroll: (loading: boolean) => void;
    selectedSubLocation: any;
    setSelectedSubLocation: (selectedSubLocation: any) => void;

};

interface Routes {
    routeId: string;
    method: string;
    path: string;
    desc?: string;
}

interface Permissions {
    permissionId: any;
    module: string;
    permission: string;
    desc?: string;
}
interface Roles {
    roleId: any;
    name: string;
    desc?: string;
}
interface Supplier {
    supId: number;
    supplierName: string;
    supplierManufacturerName: string;
    warehouseLocation: string;
    siteAddress: string;
    gmpFile?: any;
    gdpFile?: any;
    reachFile: any;
    isoFile: any;
    blockType: any;
    blockReason: any;
    blockStartDate: any;
    blockEndDate: any;
    totalDepartments: number;
    isEvaluated: boolean;
    isApproved: boolean;
    category?: {
        categoryId: number;
        categoryName: string;
    };
    subCategories?: {
        subCategoryId: number;
        subCategoryName: string;
    };
    factoryName?: {
        factoryId: number;
        factoryName: string;

    };
    countries: {
        name: string;
        countryId: number | null;
    },
    states: {
        name: string;
        stateId: number | null;
    },
    cities: {
        name: string;
        cityId: number | null;
    }
    departments: [
        {
            departmentId: number | null,
            name: string,
            evaluationType: string,
            isQ1Evaluated: boolean,
            isQ2Evaluated: boolean,
            isQ3Evaluated: boolean,
            isQ4Evaluated: boolean,
            isQ1Approved: boolean,
            isQ2Approved: boolean,
            isQ3Approved: boolean,
            isQ4Approved: boolean
        },
        {
            departmentId: number | null,
            name: string,
            evaluationType: string,
            h1Value: string,
            h2Value: string,
            isH1Evaluated: boolean,
            isH2Evaluated: boolean,
            isH1Approved: boolean,
            isH2Approved: boolean
        }
    ]
};
interface Field {
    effectiveFrom: Date | null;
    departmentId: number | null;
    orderBy: number | null;
    section: string;
    categoryId: number | null;
    subCategoryId: number | null;
    ratedCriteria: string;
    criteriaEvaluation: string;
    score: string;
    ratiosRawpack: string;
    ratiosCopack: string;
}
interface Rules {
    capaRuleId: any
    ruleId: any;
    section: string;
    ratedCriteria: string;
    criteriaEvaluation: string;
    score: string;
    ratiosRawpack: number;
    ratiosCopack: number;
    effectiveFrom: string;
    subCategories?: {
        subCategoryName: string;
    }
}
interface SetRulesDir {
    ruleSetId: any
    value: any;
    ruleType: string;
    createdAt: any;
    updatedAt: any;
}

interface CompanyUsers {
    id: number;
    name: string;
    email: string;
    phone: number;
    roleId: number;
    isSuperAdmin: boolean;
    isActive: boolean;
    roleName: string;
    role?: {
        name: string
    }
}

interface PayloadItem {
    routeId: number;
    permissionId: string;
    action: string;
};


interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
};
interface Column {
    id: 'todo' | 'in-progress' | 'done';
    title: string;
    tasks: Task[];
};



interface Scores {
    supplierName: string;
    department?: {
        name: string
    }
    evalutionPeriod: string
    totalScore: number
    categoryName: string
    subCategoryName: string
}



interface SupplierEvaluatedScore {
    supplierScoreId: number;
    departmentId: number;
    totalScore: number;
    evalutionPeriod: string;
    department: {
        name: string;
    };
}

// Define the structure of the mapped data
interface MappedSupplierScore {
    id: number;
    name: string;
    [key: string]: string | number; // This allows dynamic keys like 'H1 2024', 'H2 2024'
}

interface Department {
    departmentId: number;
    orderBy: number;
    name: string;
    evolutionType: "Quarterly" | "Halfyearly"; // Restricting to specific values
}


interface SupplierScoreboardSummary {
    ratings: {
        period: string;
        rating: number;
        value: string;
        action: string;
        rateMasterId: number;
    }[];
    supScore: {
        supplierScoreId: number;
        departmentId: number;
        totalScore: number;
        evalutionPeriod: string;
        allPeriods: string[];
        department: {
            departmentId: number;
            name: string;
        };
    }[];
}
interface SupplierData {
    supplier: {
        supId: number | null;
        supplierName: string;
    };
    category: {
        categoryId: number | null;
        categoryName: string;
    };
    subCategory: {
        subCategoryId: number | null;
        subCategoryName: string;
    };
    evaluationPeriod: string;
    department: {
        departmentId: number | null;
        name: string;
    };
    totalScore: number;
}

interface Tile {
    title: string;
    value: number;
    change: string;
    changeClass: string;
    link?: string; // Optional
}

interface Vendors {
    vendorId: number;
    vendorFactoryName: string;
    vendorName: string;
    vendorPhoneNumber: string;
    vendorManufacturerName: string;
    vendorSiteAddress: string;
    vendorWarehouseLocation: string;
    createdAt: string; // Consider using Date if you plan to parse it
    vendorZip: number;
    vendorEmail: string;
    vendorIsBlocked: boolean;
    vendorBlockType: string | null;
    vendorBlockStartDate: string | null;
    vendorBlockEndDate: string | null;
    vendorBlockReason: string | null;
    vendorOtp: string | null;
    vendorOtpExpiration: string | null;
    vendorCountry: string;
    vendorState: string;
    vendorCity: string;
    vendorStatus: boolean;
}
export type {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    LayoutConfig,
    LayoutState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    ChildContainerProps,
    CustomEvent,
    AppMenuItem,
    CustomResponse,
    AppContextType,
    Routes,
    Permissions,
    RolePermission,
    CompanyUser,
    Roles,
    Company,
    CompanySubLocation,
    CompanyMaster,
    CompanyRole,
    Warehouse,
    CompanyRack,
    CompanyProductsMapping,
    CompanyBin,
    Asset,
    MasterCode,
    Category,
    Make,
    Vendor,
    ContactPerson,
    Address,
    CreateSKU,
    PurchaseOrder,
    PurchaseItem,
    Product,
    NewSku,
    Grading,
    UploadedFile,
    Pallet,
    GradeTobin,
    ReceivePurchaseOrder,
    CategoryOption,
    SKUOption,
    Item,
    Supplier,
    Rules,
    CompanyUsers,
    PayloadItem,
    Task,
    Column,
    Scores,
    SupplierEvaluatedScore,
    MappedSupplierScore,
    Department,
    SupplierScoreboardSummary,
    Tile,
    SetRulesDir,
    Field,
    SupplierData,
    Vendors
};
