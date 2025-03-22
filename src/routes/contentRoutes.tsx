import React, { lazy,useContext } from 'react';
import { RouteProps } from 'react-router-dom';
import {
	componentPagesMenu,
	dashboardPagesMenu,
	demoPagesMenu,
	gettingStartedPagesMenu,
	pageLayoutTypesPagesMenu,
} from '../menu';
import Login from '../pages/presentation/auth/Login';
import AuthContext from '../contexts/authContext';


const LANDING = {
	DASHBOARD: lazy(() => import('../pages/presentation/dashboard/DashboardPage')),
	HOMEPAGE: lazy(() => import('../pages/presentation/dashboard/HomePage')),

};
const DANHMUC = {
	DOITUONG_NHOMDOITUONG: lazy(() => import('../pages/danhmuc/DoiTuong/NhomDoiTuong')),
};


const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};

const PAGE_LAYOUTS = {
	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};


const presentation: RouteProps[] = [
	{
		path: dashboardPagesMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
	},
	{
		path: dashboardPagesMenu.homePage.path,
		element: <LANDING.HOMEPAGE />,
	},
	{
		path: pageLayoutTypesPagesMenu.asideTypes.subMenu.defaultAside.path,
		element: <PAGE_LAYOUTS.ASIDE />,
	},
	{
		path: pageLayoutTypesPagesMenu.asideTypes.subMenu.minimizeAside.path,
		element: <PAGE_LAYOUTS.MINIMIZE_ASIDE />,

	},
	{
		path: demoPagesMenu.page404.path,
		element: <AUTH.PAGE_404 />,
	},
	{
		path: demoPagesMenu.login.path,
		element: <Login />,
	},
	{
		path: demoPagesMenu.signUp.path,
		element: <Login isSignUp />,
	},

	//Danh muc

	{
		path: '/danhmuc/danhmuc/loai=DANHMUCNHOMDONVI',
		element: <DANHMUC.DOITUONG_NHOMDOITUONG namController='danhmuc' nameAction='danhmuc' loai='NOIDUNGCHUNGTU'/>,
	},
];

const contents = [...presentation];

export default contents;
