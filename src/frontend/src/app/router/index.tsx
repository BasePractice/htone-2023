import {createBrowserRouter, Navigate} from 'react-router-dom';
import DefaultLayout from '../../common/layouts/DefaultLayout';
import RequireRoleLayout from '../../common/layouts/RequireRoleLayout';
import RequireSessionLayout from '../../common/layouts/RequireSessionLayout';
import About from '../../pages/about/About';
import Auth from '../../pages/auth/Auth';
import Bookings from '../../pages/bookings/Bookings';
import Companies from '../../pages/companies/Companies';
import CompanyCardComponent from '../../pages/companies/components/CompanyCardComponent';
import NotFound from '../../pages/notFound/NotFound';
import PlatformsOrganization from '../../pages/platforms/organization/PlatformsOrganization';
import PlatformDetail from '../../pages/platforms/PlatformDetail';
import Platforms from '../../pages/platforms/Platforms';
import Users from '../../pages/users/Users';
import {EReferenceBooks, ERoles} from './enums';

/**
 * Основной route проекта.
 * todo Сюда добавлять все основные роли react-router
 */
const routes = [
    {
        path: '/auth',
        element: <Auth />
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                children: [
                    {
                        path: `/${EReferenceBooks.PLATFORMS}/:id`,
                        element: <PlatformDetail />
                    },
                    {
                        index: true,
                        path: '/',
                        element: <Platforms />
                    },
                    {
                        path: '/about',
                        element: <About />
                    }
                ]
            },
            {
                element: <RequireSessionLayout />,
                children: [
                    {
                        path: `/${EReferenceBooks.BOOKINGS}`,
                        element: <RequireRoleLayout allowedRolesForThisRoute={[ERoles.ROLE_LANDLORD, ERoles.ROLE_ADMIN, ERoles.ROLE_TENANT]} />,
                        children: [
                            {
                                index: true,
                                element: <Bookings />
                            }
                        ]
                    },
                    {
                        path: '/organization',
                        children: [
                            {
                                index: true,
                                element: <Navigate to={`/organization/${EReferenceBooks.PLATFORMS}`} replace />
                            },
                            {
                                element: <RequireRoleLayout
                                    allowedRolesForThisRoute={[
                                        ERoles.ROLE_LANDLORD,
                                        ERoles.ROLE_ADMIN,
                                        ERoles.ROLE_TENANT
                                    ]}
                                />,

                            },
                            {
                                element: <RequireRoleLayout allowedRolesForThisRoute={[ERoles.ROLE_LANDLORD, ERoles.ROLE_ADMIN]} />,
                                children: [
                                    {
                                        path: `/organization/${EReferenceBooks.PLATFORMS}`,
                                        element: <PlatformsOrganization />
                                    }
                                ]
                            },
                            {
                                element: <RequireRoleLayout allowedRolesForThisRoute={[ERoles.ROLE_LANDLORD]} />,
                                children: [
                                    {
                                        path: '/organization/me',
                                        element: <CompanyCardComponent />
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: '/admin',
                        children: [
                            {
                                index: true,
                                element: <Navigate to={`/admin/${EReferenceBooks.COMPANIES}`} replace />
                            },
                            {
                                element: <RequireRoleLayout allowedRolesForThisRoute={[ERoles.ROLE_ADMIN]} />,
                                children: [
                                    {
                                        path: `/admin/${EReferenceBooks.USERS}`,
                                        element: <Users />
                                    },
                                    {
                                        path: `/admin/${EReferenceBooks.COMPANIES}`,
                                        element: <Companies />
                                    },
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
];

export const router = createBrowserRouter(routes);
