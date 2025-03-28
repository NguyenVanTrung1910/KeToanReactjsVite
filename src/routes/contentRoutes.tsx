import React, { lazy, Suspense, useRef } from 'react';
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
import Page from '../layout/Page/Page';
interface MenuItem {
	[key: string]: {
		id?: string;
		text?: string;
		path?: string;
		icon?: string;
		isDisable?: boolean;
		subMenu?: {
			[key: string]: {
				id?: string;
				text?: string;
				path?: string;
				icon?: string;
				isDisable?: boolean;
			};
		} | null;
	};
}

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/presentation/dashboard/DashboardPage')),
	HOMEPAGE: lazy(() => import('../pages/presentation/dashboard/HomePage')),

};
const PAGE: Record<string, Record<string, React.LazyExoticComponent<any>>> = {
	DANHMUC: {
		DANHMUCTENDONVI: lazy(() => import("../pages/danhmuc/DoiTuong/DanhMucDoiTuong")),
		DANHMUCNHOMDONVI: lazy(() => import("../pages/danhmuc/DoiTuong/NhomDoiTuong")),
		DANHMUCTAIKHOAN: lazy(() => import("../pages/danhmuc/TaiKhoan")),
		DANHMUCNHOMKHUVUC: lazy(() => import("../pages/danhmuc/DoiTuong/NhomKhuVuc")),
		DANHMUCKHUVUC: lazy(() => import("../pages/danhmuc/DoiTuong/DanhMucKhuVuc")),
		DANHMUCPHONGBAN: lazy(() => import("../pages/danhmuc/DoiTuong/PhongBanBoPhan")),
		DANHMUCHOATDONGSXKD: lazy(() => import("../pages/danhmuc/HoatDongSXKD")),
		DANHMUCNHOMHOPDONG: lazy(() => import("../pages/danhmuc/NhomHopDong")),
		DANHMUCHOPDONG: lazy(() => import("../pages/danhmuc/DanhMucHopDong")),
	},
	// PRESENTATION: {
	// 	DASHBOARD: lazy(() => import("../pages/presentation/dashboard/DashboardPage")),
	// 	HOMEPAGE: lazy(() => import("../pages/presentation/dashboard/HomePage")),
	// },
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
	// {
	// 	path: '/danhmuc/danhmuc/loai=danhmuctendonvi',
	// 	element: <PAGE.DANHMUC.NHOMDOITUONG />,
	// },
];
const DynamicRoutes = (): RouteProps[] => {
	const menus: MenuItem = JSON.parse(localStorage.getItem("menus") || "{}");

	// Hàm đệ quy lấy routes từ menu và subMenu
	const getRoutes = (menuList: MenuItem): RouteProps[] => {
		return Object.values(menuList)
			.flatMap((menu) => {
				if (menu.path==='' || menu.path === undefined) return [];
				if (menu.path ==='/'){
					return menu.subMenu ? getRoutes(menu.subMenu) : []
				} 
				const regex = /\/([^\/]+)\/([^\/]+)\/loai=([^\/]+)/;
				const match = menu.path.match(regex);
				if (!match) return [];
				const controller = match[1].toUpperCase();
				const loai = match[3]
					.replace(/_/g, " ")
					.split(" ")
					.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					.join("").toUpperCase();
				const Component = getComponent(controller, loai);


				const currentRoute: RouteProps = {
					path: menu.path,
					element: <Component />
				};
				const subRoutes = menu.subMenu ? getRoutes(menu.subMenu) : [];

				return [currentRoute, ...subRoutes];
			})
			.filter(Boolean) as RouteProps[];
	};

	return getRoutes(menus);
};

const getComponent = (controller: string, loai: string) => {
	return PAGE?.[controller]?.[loai] || AUTH.PAGE_404;
};
console.log(presentation)

const contents = [...presentation, ...DynamicRoutes()];

export default contents;
