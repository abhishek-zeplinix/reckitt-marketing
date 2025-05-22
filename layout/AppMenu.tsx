/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useRef, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { get, intersection } from 'lodash';
import { useAppContext } from './AppWrapper';
// import { getCompanyLogo } from '@/utils/uitl';
import { COMPANY_ROLE_MENU, COMPANY } from '@/config/permissions';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/navigation';
// import { useLoaderContext } from './context/LoaderContext';
import { useAuth } from './context/authContext';
import { encodeRouteParams } from '@/utils/base64';

const AppMenu = () => {
    const router = useRouter();
    const { layoutConfig, layoutState, onMenuToggle } = useContext(LayoutContext);
    // const { setLoader } = useLoaderContext();
    const { hasPermission, hasAnyPermission, isSupplier } = useAuth();
    const { user } = useAppContext();

    const handleMenuClick = ({ originalEvent, item }: any) => {
        if (originalEvent) {
            originalEvent.preventDefault();
        }
        router.push(item.url);
    };

    const model: AppMenuItem[] = [
        {
            label: '',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-th-large',
                    url: isSupplier()
                        ? (() => {
                              const supplierId = get(user, 'supplierId');
                              const categoryId = get(user, 'categoryId');
                              const subCategoryId = get(user, 'subCategoryId');

                              if (supplierId && categoryId && subCategoryId) {
                                  const params: any = { supId: supplierId, catId: categoryId, subCatId: subCategoryId };
                                  const encodedParams = encodeRouteParams(params);
                                  return `/supplier-scoreboard-summary/${encodedParams}`;
                              }
                              return '/';
                          })()
                        : '/',
                    command: handleMenuClick
                },
                {
                    label: 'Marketing',
                    icon: 'pi pi-sliders-v',
                    check: (user: any) => {
                        if (get(user, 'isSuperAdmin')) {
                            return true;
                        }
                        return hasAnyPermission(['manage_faq', 'manage_supply_glossary']);
                    },
                    items: [
                        {
                            label: 'Master',
                            url: '/marketing-master',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_faq');
                            },
                            command: handleMenuClick
                        },
                        {
                            label: 'Marketing Questions',
                            url: '/marketing-questions',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_supply_glossary');
                            },
                            command: handleMenuClick
                        },
                        // {
                        //     label: 'Manage Vendor',
                        //     url: '/vendors-marketing',
                        //     check: (user: any) => {
                        //         if (get(user, 'isSuperAdmin')) {
                        //             return true;
                        //         }
                        //         return hasPermission('manage_faq');
                        //     },
                        //     command: handleMenuClick
                        // },
                        {
                            label: 'Evaluation Name',
                            url: '/marketing-evaluation',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_supply_glossary');
                            },
                            command: handleMenuClick
                        },
                        {
                            label: 'Details',
                            url: '/marketing-details',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_supply_glossary');
                            },
                            command: handleMenuClick
                        },
                        {
                            label: 'Evaluation Setup',
                            url: '/evaluation-setup',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_supply_glossary');
                            },
                            command: handleMenuClick
                        },
                        {
                            label: 'Evaluation Progress',
                            url: '/evaluation-progress',
                            check: (user: any) => {
                                if (get(user, 'isSuperAdmin')) {
                                    return true;
                                }
                                return hasPermission('manage_supply_glossary');
                            },
                            command: handleMenuClick
                        }
                    ]
                }
            ]
        }
    ];

    const menuToggleClass = classNames('menu-toggle-icon', {
        'toogle-overlay': layoutConfig.menuMode === 'overlay',
        'toogle-static': layoutConfig.menuMode === 'static',
        'toogle-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'toogle-overlay-active': layoutState.overlayMenuActive,
        'toogle-mobile-active': layoutState.staticMenuMobileActive
    });

    const iconClass = classNames('pi', {
        'pi-angle-left text-lg text-white p-3': !layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'pi-angle-right text-lg text-white p-3': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static'
    });
    return (
        <MenuProvider>
            <div className="min-h-screen flex relative lg:static">
                <div id="app-sidebar-2" className="h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 select-none" style={{ width: !layoutState.isMobile && layoutState.staticMenuDesktopInactive ? 60 : 265 }}>
                    <div className="flex flex-column" style={{ height: '92%' }}>
                        <div className="overflow-y-auto " style={{ scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
                            <ul className="list-none p-3 m-0">
                                {get(model, '0.items', []).map((item, i) =>
                                    !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={`AppMenuitem${i}${item.label}`} /> : <li key={`AppMenuitem${i}${item.label}`} className="menu-separator"></li>
                                )}
                            </ul>
                        </div>
                        {!layoutState.isMobile && (
                            <div className="mt-auto">
                                <a
                                    v-ripple
                                    className="flex mb-1 justify-content-center align-items-center  p-2 text-700 transition-duration-150 transition-colors p-ripple "
                                    style={{ width: layoutState.staticMenuDesktopInactive ? 60 : 250, height: '15px' }}
                                ></a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MenuProvider>
    );
};

export default AppMenu;
